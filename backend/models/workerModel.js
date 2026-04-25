import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    workderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    skills: {
      type: [String],
      required: true,       
  },
  isActive:{
    type: Boolean,
    default: true,
  },
},
  { timestamps: true },
);  

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;