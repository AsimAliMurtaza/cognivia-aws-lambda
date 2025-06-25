import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const dbName = "cognivia";
const client = new MongoClient(uri);

export const handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    const token =
      event.headers?.authorization || event.headers?.Authorization || "";

    if (!token.startsWith("Bearer ")) {
      console.error("Missing or malformed token:", token);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const jwtToken = token.replace("Bearer ", "").trim();

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const requesterID = decoded?.id;

    const query = event.queryStringParameters || {};
    const userID = query.userID;

    console.log("Decoded ID:", requesterID, "Queried ID:", userID);

    if (!requesterID || requesterID !== userID) {
      console.error("Forbidden access");
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden" }),
      };
    }

    await client.connect();
    const db = client.db(dbName);

    const quizzes = await db
      .collection("quizzes")
      .find({ userID })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Fetched quizzes:", quizzes.length);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizzes }),
    };
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch quizzes",
        error: err.message || err,
      }),
    };
  }
};
