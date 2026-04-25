import React, { useEffect, useState } from "react";
import {
  createWorkerSlot,
  deleteWorkerSlot,
  getWorkerData,
} from "../apiservices/workerApiservice";

function WorkerPage() {
  const [schedule, setSchedule] = useState([]);

  // form states
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  const fetchData = async () => {
    try {
      const res = await getWorkerData();
      setSchedule(res.schedule || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSlot = async () => {
    try {
      if (!startHour || !endHour) {
        return alert("Enter start and end time");
      }

      await createWorkerSlot({
        startHours: [Number(startHour)],
        endHours: [Number(endHour)],
      });

      alert(" Slot created");
      setStartHour("");
      setEndHour("");

      fetchData();
    } catch (err) {
      alert(err.message || "Error creating slot");
    }
  };
//deleting a spcific slot
  const handleDelete = async (date, slotId) => {
    try {
      await deleteWorkerSlot({ date, slotId });

      alert("🗑 Slot deleted");
      fetchData();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

    const handleLogout = () => {
    localStorage.clear(); 
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Worker Dashboard</h1>
      <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

      {/* ➕ Create Slot */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Create Slots</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            placeholder="Start Hour (0-23)"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="End Hour (1-24)"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />

          <button
            onClick={handleCreateSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Slot
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Example: Start 9, End 12 → creates 09-10, 10-11, 11-12
        </p>
      </div>

      <div className="space-y-6">
        {schedule.map((day) => (
          <div
            key={day._id}
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            {/* Date */}
            <h2 className="text-lg font-bold mb-4">
               {day.date}
            </h2>

            {/* Slots */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {day.slots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-3 rounded-lg flex justify-between items-center
                    ${
                      slot.isBooked
                        ? "bg-gray-300"
                        : "bg-green-100"
                    }
                  `}
                >
                  <span>
                    {slot.startTime} - {slot.endTime}
                  </span>

                  {!slot.isBooked && (
                    <button
                      onClick={() =>
                        handleDelete(day.date, slot._id)
                      }
                      className="text-red-500 text-sm"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {schedule.length === 0 && (
          <div className="text-center text-gray-500">
            No slots created yet
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkerPage;