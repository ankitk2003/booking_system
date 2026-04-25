import User from "../models/userModel.js";

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
}


export default { getCustomerData };
