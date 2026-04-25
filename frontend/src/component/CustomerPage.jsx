import React, { useEffect, useState } from "react";
import {
  getAllWorkers,
  getWorkerSlots,
  bookWorkerSlot,
} from "../apiservices/customerApiservice";

function CustomerPage() {
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await getAllWorkers();
        // console.log("Workers fetched:", res.workers);
        setWorkers(res.workers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkers();
  }, []);

  const handleBook = async (workerId) => {
    try {
      const res = await getWorkerSlots(workerId);

    //   console.log("All schedules:", res.slots);

      setSchedules(res.slots || []);
      setSelectedWorker(workerId);
      setSelectedDateIndex(0);
      setSelectedSlot(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async () => {
    const currentSchedule = schedules[selectedDateIndex];

    try {
      await bookWorkerSlot({
        workerId: selectedWorker,
        slotId: selectedSlot._id,
        date: currentSchedule.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      alert("Slot booked successfully!");

      // update UI
      const updatedSchedules = [...schedules];
      updatedSchedules[selectedDateIndex].slots = updatedSchedules[
        selectedDateIndex
      ].slots.map((s) =>
        s._id === selectedSlot._id ? { ...s, isBooked: true } : s,
      );

      setSchedules(updatedSchedules);
      setSelectedSlot(null);
    } catch (error) {
      console.error(error);
      alert("Booking failed", error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // remove token, role etc
    window.location.href = "/"; // redirect to home/login
  };

  const isToday = (dateStr) => {
    const today = new Date();

    const [d, m, y] = dateStr.split("/");
    const scheduleDate = new Date(y, m - 1, d);

    return (
      scheduleDate.getDate() === today.getDate() &&
      scheduleDate.getMonth() === today.getMonth() &&
      scheduleDate.getFullYear() === today.getFullYear()
    );
  };
  return (
    <>
      {/* Workers */}
      <div className="bg-gray-100 p-6 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Available Workers</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white shadow-md rounded-2xl p-5"
            >
              <h2 className="text-lg font-semibold">
                {worker.workerId?.username}
              </h2>

              <p className="text-sm text-gray-600">{worker.workerId?.email}</p>

              <p className="text-sm mt-2">
                <span className="font-medium">Skills:</span>{" "}
                {worker.skills.join(", ")}
              </p>

              <button
                onClick={() => handleBook(worker.workerId._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Book Worker
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dates + Slots */}

      {schedules.length > 0 &&
        (() => {
          const todayStr = new Date().toLocaleDateString("en-GB");
          console.log("todays date", todayStr);
          // en-GB → gives DD/MM/YYYY 

          const todaySchedules = schedules.filter((s) => isToday(s.date));
          if (todaySchedules.length === 0) {
            return (
              <div className="p-6 bg-white shadow-md m-6 rounded-2xl text-center">
                No slots available for today
              </div>
            );
          }

          return (
            <div className="p-6 bg-white shadow-md m-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Today's Slots</h2>

              <div className="flex gap-3 mb-6 flex-wrap">
                {todaySchedules.map((schedule, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDateIndex(index);
                      setSelectedSlot(null);
                    }}
                    className={`px-4 py-2 rounded-lg border
              ${
                selectedDateIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }
            `}
                    disabled={schedule.slots.every((slot) => slot.isBooked)}
                  >
                    {schedule.date}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {todaySchedules[selectedDateIndex]?.slots.map((slot) => {
                  const isSelected = selectedSlot?._id === slot._id;

                  return (
                    <button
                      key={slot._id}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.isBooked}
                      className={`py-2 rounded-lg transition
                ${
                  slot.isBooked
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-green-500 text-white hover:bg-green-600"
                }
              `}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  );
                })}
              </div>

              {selectedSlot && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
                  >
                    Confirm Booking ({selectedSlot.startTime} -{" "}
                    {selectedSlot.endTime})
                  </button>
                </div>
              )}
            </div>
          );
        })()}
    </>
  );
}

export default CustomerPage;
