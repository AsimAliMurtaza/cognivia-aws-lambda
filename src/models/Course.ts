import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  subject: string;
  level: string;
  createdBy: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  joinCode: string;
  teacher: mongoose.Types.ObjectId;
  assignments: mongoose.Types.ObjectId[];
  liveClasses: mongoose.Types.ObjectId[];
  messages?: mongoose.Types.ObjectId[];
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String },
    level: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinCode: { type: String, unique: true },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    liveClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "LiveClass" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },

  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
