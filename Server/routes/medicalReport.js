import express from "express";
import { uploadReport, getReportsForPatient, getReportsForDoctor } from "../controller/medicalReport.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(verifyToken);

// Patient routes
router.post("/upload", upload.single('report'), uploadReport);
router.get("/my-reports", getReportsForPatient);

// Doctor routes
router.get("/patient-reports", getReportsForDoctor);

export default router;
