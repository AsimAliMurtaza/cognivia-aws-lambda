//Courses Creation and retrieval Lambda Function
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const dbName = "cognivia";
const client = new MongoClient(uri);

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;

  try {
    await client.connect();
    const db = client.db(dbName);
    const courses = db.collection("courses");

    if (method === "GET") {
      const result = await courses
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result), 
      };
    }

    if (method === "POST") {
      const token =
        event.headers.authorization || event.headers.Authorization || "";
      const jwtToken = token.replace("Bearer ", "");

      if (!jwtToken) {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      const userId = decoded?.id;
      const role = decoded?.role;

      if (!userId || role !== "teacher") {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "Only teachers can create courses" }),
        };
      }

      const body = JSON.parse(event.body || "{}");
      const { title, description, subject, level } = body;

      if (!title || !subject || !level) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }

      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const newCourse = {
        title,
        description,
        subject,
        level,
        createdBy: new ObjectId(userId),
        joinCode,
        teacher: new ObjectId(userId),
        students: [],
        assignments: [],
        liveClasses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await courses.insertOne(newCourse);

      return {
        statusCode: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insertedId: result.insertedId, ...newCourse }),
      };

    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
