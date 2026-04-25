import API from "./axios";

export const getCustomerData = async () => {
  try {
    const res = await API.get("/customer/get-customer-data");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllWorkers = async () => {
  try {
    const res = await API.get("/customer/all-workers");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const bookWorkerSlot = async (data) => {
  try {
    const res = await API.post("/customer/book-slot", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Get Worker Slots
export const getWorkerSlots = async (workerId) => {
  try {
    const res = await API.get(`/customer/worker-slots/${workerId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};