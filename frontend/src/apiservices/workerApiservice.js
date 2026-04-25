import API from "./axios";

export const createWorkerSlot = async (data) => {
  try {
    const res = await API.post("/worker/create-slot", data);
    return res.data;
  } catch (error) {
    console.error("Create slot error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const deleteWorkerSlot = async (data) => {
  try {
    const res = await API.post("/worker/delete-slot", data);
    return res.data;
  } catch (error) {
    console.error("Delete slot error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};
//get worker data (schedule )
export const getWorkerData = async () => {
  try {
    const res = await API.get("/worker/get-worker-data");
    return res.data;
  } catch (error) {
    console.error("Get worker data error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};