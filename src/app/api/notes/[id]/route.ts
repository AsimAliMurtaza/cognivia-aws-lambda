import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const noteId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await Note.findById(noteId);
    if (!note || note.userID !== userId) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (deletedNote) {
      return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete note" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note from the database." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const noteId = params.id;
    const { updatedContent } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await Note.findById(noteId);
    if (!note || note.userID !== userId) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { generated_quiz: updatedContent },
      { new: true }
    );

    if (updatedNote) {
      return NextResponse.json(
        { message: "Note updated successfully", note: updatedNote },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update note" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note in the database." },
      { status: 500 }
    );
  }
}
