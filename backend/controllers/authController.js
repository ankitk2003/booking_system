import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
import Worker from "../models/workerModel.js";


const login = async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Login attempt:", { email, role }); // Debug log

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }
    if (user.role !== role) {
      return res.status(403).json({
        message: "Role mismatch",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_USER_PASSWORD,
    );

    res.json({
      token: token,
      userName: user.username,
      role: user.role,
    });
  } catch (e) {
    console.log("Error during signin: " + e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log("Creating user with data:", { username, email, role }); // Debug log

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
   const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (role === "worker") {  
      await Worker.create({
       workderId: user._id,
       skills: ["general"], // Default skill, can be updated later
       isActive: true,
      });
    }

   
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  login,
  createUser,
};
