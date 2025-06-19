import mongoose from "mongoose";

const LiveClassSchema = new mongoose.Schema({
  title: String,
  channelName: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.LiveClass ||
  mongoose.model("LiveClass", LiveClassSchema);
