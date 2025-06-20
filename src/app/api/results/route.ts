import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QuizResult from "@/models/QuizResult";
import Quiz from "@/models/Quiz";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userID, quizID, score, total, percentage } = body;

    if (
      !userID ||
      !quizID ||
      score == null ||
      total == null ||
      percentage == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const result = await QuizResult.create({
      userID,
      quizID,
      score,
      total,
      percentage,
    });

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizID },
      { score, isTaken: true },
      { new: true }
    );

    return NextResponse.json(
      { message: "Result stored successfully", result, updatedQuiz },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error storing quiz result:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
