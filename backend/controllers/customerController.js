import User from "../models/userModel.js";
import Worker from "../models/workerModel.js";
import Booking from "../models/bookingModel.js";
import Schedule from "../models/scheduleModel.js";
const getCustomerData = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching data for user ID:", userId); // Debug log
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const bookWorkerSlot = async (req, res) => {
  try {
    const { workerId, date, startTime, endTime, slotId } = req.body;
    console.log("Booking request received with data:", {
      workerId,
      date,
      startTime,
      endTime,
      slotId,
    }); // Debug log

    const customerId = req.userId;
    // console.log("Booking slot with data:", {
    //   workerId,
    //   date,
    //   startTime,
    //   endTime,
    //   slotId,
    //   customerId,
    // }); Debug log
    const newBooking = await new Booking({
      workerId,
      userId: customerId,
      date,
      startTime,
      endTime,
    });

    await newBooking.save();

    const schedule = await Schedule.findOne({ workerId, date });
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Schedule not found for this worker and date" });
    }
    const slot = schedule.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    slot.isBooked = true;
    await schedule.save();
    return res.status(200).json({ message: "Slot booked successfully" });
  } catch (error) {
    // console.error(error);
    // return res.status(500).json({ message: "Server error" });

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Slot already booked by someone else",
      });
    }
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .select("-password")
      .populate("workerId", "username email");
    return res.status(200).json({ workers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWorkerSlot = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const slots = await Schedule.find({ workerId });
    return res.status(200).json({ slots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export default {
  getCustomerData,
  bookWorkerSlot,
  getAllWorkers,
  getWorkerSlot,
};
