import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "cognivia";

export const handler = async (event) => {
  try {
    const method = event.requestContext.http.method;
    if (method !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const token = (
      event.headers.authorization ||
      event.headers.Authorization ||
      ""
    ).replace("Bearer ", "");
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;
    const role = decoded?.role;

    if (!userId || role !== "teacher") {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Forbidden" }),
      };
    }

    const body = JSON.parse(event.body);
    const { courseId, title, description, dueDate, files } = body;

    if (!courseId || !title || !dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    await client.connect();
    const db = client.db(dbName);
    const assignments = db.collection("assignments");
    const courses = db.collection("courses");

    const assignmentDoc = {
      courseId: new ObjectId(courseId),
      title,
      description,
      dueDate: new Date(dueDate),
      files: files || [],
      createdAt: new Date(),
    };

    const result = await assignments.insertOne(assignmentDoc);
    const createdAssignment = result.ops?.[0] || assignmentDoc;

    await courses.updateOne(
      { _id: new ObjectId(courseId) },
      { $push: { assignments: result.insertedId } }
    );

    return {
      statusCode: 201,
      body: JSON.stringify(createdAssignment),
    };
  } catch (err) {
    console.error("Lambda Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create assignment" }),
    };
  }
};
