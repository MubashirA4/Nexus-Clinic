import express from "express";
import { addMetric, getMetrics, getLatestMetrics } from "../controller/healthMetric.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/health-metrics", verifyToken, addMetric);
router.get("/health-metrics", verifyToken, getMetrics);
router.get("/health-metrics/latest", verifyToken, getLatestMetrics);

export default router;
