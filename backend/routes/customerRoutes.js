import express from "express";
import customerController from "../controllers/customerController.js";
import { userMiddleware } from "../helpers/userMiddleware.js";

const customerRouter = express.Router();

customerRouter.get("/get-customer-data",userMiddleware, customerController.getCustomerData);



export default customerRouter;
