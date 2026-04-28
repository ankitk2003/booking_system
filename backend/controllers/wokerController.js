import Schedule from "../models/scheduleModel.js";
import Worker from "../models/workerModel.js";
// const createWorkerSlot = async (req, res) => {
//   const { workerId, date, startTime, endTime } = req.body;
//   console.log("Creating slot for worker:", {
//     workerId,
//     date,
//     startTime,
//     endTime,
//   });

//   const slots = [];
//   for (let i = 0; i < startTime.length; i++) {
//     for (let j = startTime[i]; j < endTime[i]; j++) {
//       slots.push({
//         startTime: j,
//         endTime: j + 1,
//         isBooked: false,
//       });
//     }
//   }

//   console.log("Constructed slots:", slots);

//   await Schedule.create({
//     workerId: req.userId,
//     date: Date.now(),
//     slots,
//   });
//   res.status(201).json({ message: "Worker slot created successfully" });
// };
const createWorkerSlot = async (req, res) => {
  try {
    const { startHours, endHours } = req.body;

    console.log("Received slot creation request:", {
      startHours,
      endHours,
    });
    const workerId = req.userId;

    const date = new Date().toLocaleDateString();

    if (startHours.length !== endHours.length) {
      return res.status(400).json({ message: "Mismatched time ranges" });
    }

    const slots = [];

    for (let i = 0; i < startHours.length; i++) {
      const start = startHours[i];
      const end = endHours[i];

      if (start < 0 || end > 24 || start >= end) {
        return res.status(400).json({
          message: `Invalid range: ${start} - ${end}`,
        });
      }

      for (let hour = start; hour < end; hour++) {
        slots.push({
          startTime: `${String(hour).padStart(2, "0")}:00`,
          endTime: `${String(hour + 1).padStart(2, "0")}:00`,
          isBooked: false,
        });
      }
    }
    // this is to prevent the duplicate entry of the same date for the same worker
    const existing = await Schedule.findOne({ workerId, date });
    if (existing) {
      //   console.log("Existing schedule found for worker on date:", existing);

      console.log("Existing schedule for worker on date:", existing);
      for (const slot of slots) {
        console.log("Checking slot against existing schedule:", slot);
        for (const existingSlot of existing.slots) {
          if (
            slot.startTime === existingSlot.startTime &&
            slot.endTime === existingSlot.endTime
          ) {
            return res
              .status(400)
              .json({ message: "Slot already exists for this date and time" });
          }
        }
      }

      const upatedSlots = [...existing.slots, ...slots];
      existing.slots = upatedSlots;
      await existing.save();
      return res.status(200).json({
        message: "Slots updated successfully",
        slots: upatedSlots,
      });
    }
    // if (existing) {
    //     return res.status(400).json({ message: "Slots for this date already exist" });
    // }

    console.log("created slots:", slots);
    await Schedule.create({
      workerId,
      date,
      slots,
    });

    return res.status(201).json({
      message: "Slots created successfully",
      slots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteWorkerSlot = async (req, res) => {
  try {
    const { date, slotId } = req.body;
    const workerId = req.userId;

    const schedule = await Schedule.findOne({ workerId, date });

    if (!schedule) {
      return res.status(404).json({
        message: "No schedule found for this date",
      });
    }

    const slot = schedule.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        message: "Cannot delete a booked slot",
      });
    }

    slot.deleteOne();

    await schedule.save();

    return res.status(200).json({
      message: "Slot deleted successfully",
      remainingSlots: schedule.slots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWorkerData = async (req, res) => {
  try {
    const workerId = req.userId;
    const schedule = await Schedule.find({ workerId }).populate("workerId", "username email");
    return res.status(200).json({ schedule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export default { createWorkerSlot, deleteWorkerSlot, getWorkerData };
