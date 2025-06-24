import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note"; 
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1]; 

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate token using next-auth
  const verifiedToken = await getToken({ req, secret, raw: true });

  if (!verifiedToken) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  try {
    const { content, userId, prompt } = await req.json();

    if (!content || !userId || !prompt) {
      return NextResponse.json(
        { error: "Content, userId, and prompt are required to save notes." },
        { status: 400 }
      );
    }

    await dbConnect();

    const newNote = new Note({
      _id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a unique _id
      userID: userId,
      prompt: prompt,
      generated_quiz: content,
      createdAt: new Date(),
    });

    const savedNote = await newNote.save();

    return NextResponse.json(
      { message: "Notes saved successfully!", noteId: savedNote._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving notes:", error);
    return NextResponse.json(
      { error: "Failed to save notes to the database." },
      { status: 500 }
    );
  }
}
