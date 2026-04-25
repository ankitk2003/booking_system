import express from "express";
import customerController from "../controllers/customerController.js";
import { userMiddleware } from "../helpers/userMiddleware.js";

const customerRouter = express.Router();

customerRouter.get("/get-customer-data",userMiddleware, customerController.getCustomerData);
customerRouter.post("/book-slot", userMiddleware, customerController.bookWorkerSlot);
customerRouter.get("/all-workers", userMiddleware, customerController.getAllWorkers);
customerRouter.get("/worker-slots/:workerId", userMiddleware, customerController.getWorkerSlot);


export default customerRouter;
