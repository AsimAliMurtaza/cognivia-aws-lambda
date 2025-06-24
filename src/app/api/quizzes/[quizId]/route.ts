import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import QuizResult from "@/models/QuizResult";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const session = await getServerSession(authOptions);
  const { quizId } = params;
  const { searchParams } = new URL(req.url);
  const userIdFromQuery = searchParams.get("userID");

  if (!session?.user?.id || session.user.id !== userIdFromQuery) {
    return NextResponse.json(
      { message: "Unauthorized to delete this quiz" },
      { status: 403 }
    );
  }

  if (!quizId) {
    return NextResponse.json({ message: "Invalid quiz ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedQuiz = await Quiz.findOneAndDelete({
      _id: quizId,
      userID: session.user.id,
    });

    const deleteQuizResult = await QuizResult.findOneAndDelete({
      quizID: quizId,
      userID: session.user.id,
    })

    if (!deletedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    if(deleteQuizResult){
      console.log("Quiz result deleted", deleteQuizResult)
    }

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { message: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
