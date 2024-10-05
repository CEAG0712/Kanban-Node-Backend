import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskSummary: {
    type: String,
    required: true,
  },
  acceptanceCriteria: {
    type: String,
  },
  status: {
    type: String,
    default: "TO_DO",
  },
  hierarchy: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
