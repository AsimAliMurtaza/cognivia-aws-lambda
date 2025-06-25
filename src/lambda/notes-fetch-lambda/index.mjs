import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "cognivia";

export const handler = async (event) => {
  try {
    const token = (
      event.headers.authorization ||
      event.headers.Authorization ||
      ""
    ).replace("Bearer ", "");

    console.log("Received headers:", JSON.stringify(event.headers));
    console.log(
      "Raw Authorization header:",
      event.headers.Authorization || event.headers.authorization
    );

    console.log("Token recieved:", token);
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const userId = decoded?.id;

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    const query = event.queryStringParameters || {};
    const skip = parseInt(query.skip || "0");
    const limit = parseInt(query.limit || "6");

    await client.connect();
    const db = client.db(dbName);
    const notesCollection = db.collection("generated_notes");

    const notes = await notesCollection
      .find({ userID: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await notesCollection.countDocuments({ userID: userId });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, total }),
    };
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch notes" }),
    };
  }
};
