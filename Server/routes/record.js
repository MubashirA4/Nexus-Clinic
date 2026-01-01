import express from "express";
import { addRecord, getPatientHistory, getMyRecords } from "../controller/record.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// Doctor routes
router.post("/records", addRecord);
router.get("/records/patient/:patientId", getPatientHistory);

// Patient routes
router.get("/records/my-records", getMyRecords);

export default router;
