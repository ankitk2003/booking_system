import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: String,
      required: true,
    },
    slots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
