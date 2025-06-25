import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizResult from "@/models/QuizResult";
import Note from "@/models/Note";
import Course from "@/models/Course";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userID } = await req.json();

    const userId = userID || "defaultUserId";

    const quizzesCount = await Quiz.countDocuments({ userID });

    const resultsAgg = await QuizResult.aggregate([
      { $match: { userID } },
      {
        $group: {
          _id: null,
          avgPercentage: { $avg: "$percentage" },
        },
      },
    ]);
    const averageScore = resultsAgg[0]?.avgPercentage || 0;

    const notesCount = await Note.countDocuments({ userID });
    const takenQuizCount = await QuizResult.countDocuments({ userID });

    const recentQuizzes = await Quiz.find({ userID })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("topic createdAt");

    const recentNotes = await Note.find({ userID })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("prompt createdAt");

    const joinedCourses = await Course.find({ students: userId }).select("_id");
    const courseIds = joinedCourses.map((course) => course._id);

    const upcomingAssignments = await Assignment.find({
      courseId: { $in: courseIds },
      dueDate: { $gt: new Date() },
    })
      .populate("courseId", "title")
      .sort({ dueDate: 1 })
      .limit(3)
      .select("title dueDate courseId");

    const submittedAssignments = await AssignmentSubmission.find({
      studentId: userId,
    })
      .populate({
        path: "assignmentId",
        select: "title dueDate courseId",
        populate: { path: "courseId", select: "title" },
      })
      .sort({ submittedAt: -1 })
      .limit(3);

    return NextResponse.json({
      quizzesCount,
      averageScore: Math.round(averageScore),
      notesCount,
      recentQuizzes,
      recentNotes,
      takenQuizCount,
      upcomingAssignments,
      submittedAssignments,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
