import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "failed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  { workerId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

export default mongoose.model("Booking", bookingSchema);
