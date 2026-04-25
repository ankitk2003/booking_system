import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';   
import workerController from '../controllers/wokerController.js';
import { userMiddleware } from '../helpers/userMiddleware.js';
const workerRouter = express.Router();
workerRouter.post("/create-slot", userMiddleware, workerController.createWorkerSlot);
workerRouter.post("/delete-slot", userMiddleware, workerController.deleteWorkerSlot);
workerRouter.get("/get-worker-data", userMiddleware, workerController.getWorkerData);

export default workerRouter;
