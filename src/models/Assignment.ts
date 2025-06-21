import mongoose, { Document, Schema } from "mongoose";

interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  fileUrl?: string; // Made optional as not all assignments might have an initial file
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for Assignment
const AssignmentSchema: Schema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Ensures referential integrity with the Course model
      required: true, // An assignment must belong to a course
    },
    title: {
      type: String,
      required: true, // Title is essential
      trim: true, // Removes whitespace from both ends of a string
    },
    description: {
      type: String,
      default: "", // Default to empty string if no description provided
    },
    dueDate: {
      type: Date,
      required: true, // Due date is crucial for assignments
    },
    fileUrl: {
      type: String,
      default: "", // Default to empty string
    }, // Google Drive file link for assignment details/resources
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Mongoose model
export default mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);
