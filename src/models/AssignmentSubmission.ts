// models/AssignmentSubmission.ts
import mongoose from "mongoose";

const AssignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: Number, // optional future use
    feedback: String, // optional future use
  },
  { timestamps: true }
);

export default mongoose.models.AssignmentSubmission ||
  mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);
