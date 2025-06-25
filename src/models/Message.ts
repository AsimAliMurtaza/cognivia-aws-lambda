import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  content: string;
  courseId: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
