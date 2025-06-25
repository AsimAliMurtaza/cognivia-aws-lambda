//Individual Lambda function to handle specific individual course operations
// coursesById.mjs
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "cognivia";

export const handler = async (event) => {
  try {
    const method = event.requestContext.http.method;
    const query = event.queryStringParameters || {};
    const courseId = query.courseId;
    const token = (
      event.headers.authorization ||
      event.headers.Authorization ||
      ""
    ).replace("Bearer ", "");

    if (!token) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id;
    const role = decoded?.role;

    if (!userId || !role) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    await client.connect();
    const db = client.db(dbName);
    const courses = db.collection("courses");
    const assignments = db.collection("assignments");

    if (method === "GET") {
      const course = await courses.findOne({ _id: new ObjectId(courseId) });

      if (!course) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }

      const shouldPopulate = ["assignments", "messages"];

      if (Array.isArray(course.assignments)) {
        const populatedAssignments = await assignments
          .find({
            _id: { $in: course.assignments.map((id) => new ObjectId(id)) },
          })
          .toArray();
        course.assignments = populatedAssignments;
      }

      if (Array.isArray(course.messages)) {
        const populatedMessages = await db
          .collection("messages")
          .find({ _id: { $in: course.messages.map((id) => new ObjectId(id)) } })
          .sort({ createdAt: -1 })
          .toArray();
        course.messages = populatedMessages;
      }

      return {
        statusCode: 200,
        body: JSON.stringify(course),
      };
    }

    if (method === "PUT") {
      if (role !== "teacher") {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      if (!courseId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing courseId" }),
        };
      }

      let updates = {};
      try {
        const body = JSON.parse(event.body);

        if (body.title) updates.title = body.title;
        if (body.description) updates.description = body.description;
        if (body.subject) updates.subject = body.subject;
        if (body.level) updates.level = body.level;

        if (Object.keys(updates).length === 0) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "No fields to update" }),
          };
        }
      } catch (err) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid JSON body" }),
        };
      }

      try {
        const updated = await courses.findOneAndUpdate(
          {
            _id: new ObjectId(courseId),
            createdBy: new ObjectId(userId),
          },
          { $set: updates },
          { new: false }
        );

        if (!updated.value) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "Not found or not allowed" }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify(updated.value),
        };
      } catch (err) {
        console.error("Error during DB update:", err);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to update course" }),
        };
      }
    }

    if (method === "DELETE") {
      if (role !== "teacher") {
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      const deleted = await courses.findOneAndDelete({
        _id: new ObjectId(courseId),
        createdBy: new ObjectId(userId),
      });

      if (!deleted.value) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found or not allowed" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Deleted successfully" }),
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
