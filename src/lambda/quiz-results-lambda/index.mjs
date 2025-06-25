import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const dbName = "cognivia";
const client = new MongoClient(uri);

export const handler = async (event) => {
  try {
    const token = (
      event.headers.authorization ||
      event.headers.Authorization ||
      ""
    ).replace("Bearer ", "");

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: Token missing" }),
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Invalid or expired token" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { userID, quizID, score, total, percentage } = body;

    if (
      !userID ||
      !quizID ||
      score === undefined ||
      total === undefined ||
      percentage === undefined
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    if (decoded.id !== userID) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "User ID mismatch" }),
      };
    }

    await client.connect();
    const db = client.db(dbName);

    const insertRes = await db.collection("quizresults").insertOne({
      userID,
      quizID,
      score,
      total,
      percentage,
      createdAt: new Date(),
    });

    await db
      .collection("quizzes")
      .updateOne({ quizID }, { $set: { score, isTaken: true } });

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Result stored successfully",
        resultId: insertRes.insertedId,
      }),
    };
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
