import API from "./axios";

export const loginUser = async (formData) => {
  try {
    const res = await API.post("/auth/login", formData);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};