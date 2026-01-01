import MedicalReport from "../models/medicalReport.js";
import Appointment from "../models/appointments.js";
import mongoose from "mongoose";

export const uploadReport = async (req, res) => {
          try {
                    const { title, appointmentId } = req.body;
                    const file = req.file;

                    if (!file) {
                              return res.status(400).json({ success: false, message: "No file uploaded" });
                    }

                    if (!appointmentId) {
                              return res.status(400).json({ success: false, message: "Appointment ID is required" });
                    }

                    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
                              return res.status(400).json({ success: false, message: "Invalid appointment ID" });
                    }

                    const appointment = await Appointment.findById(appointmentId);
                    if (!appointment) {
                              return res.status(404).json({ success: false, message: "Appointment not found" });
                    }

                    // Since we are using verifyToken, req.userId is available
                    // Ensure the appointment belongs to the patient uploading the report
                    if (appointment.patient.toString() !== req.userId) {
                              return res.status(403).json({ success: false, message: "Unauthorized: This appointment belongs to another patient" });
                    }

                    const newReport = new MedicalReport({
                              patient: req.userId,
                              doctor: appointment.doctor,
                              appointment: appointmentId,
                              title: title || file.originalname,
                              fileUrl: `/uploads/${file.filename}`,
                              fileType: file.mimetype,
                    });

                    await newReport.save();

                    res.status(201).json({
                              success: true,
                              message: "Medical report uploaded successfully",
                              data: newReport
                    });
          } catch (error) {
                    console.error("Error uploading report:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};

export const getReportsForPatient = async (req, res) => {
          try {
                    const reports = await MedicalReport.find({ patient: req.userId })
                              .populate('doctor', 'name specialization image')
                              .sort({ createdAt: -1 });
                    res.status(200).json({ success: true, data: reports });
          } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
          }
};

export const getReportsForDoctor = async (req, res) => {
          try {
                    const doctorId = req.userId;
                    // Doctor can see reports assigned to them
                    const reports = await MedicalReport.find({ doctor: doctorId })
                              .populate('patient', 'name image email')
                              .populate('appointment')
                              .sort({ createdAt: -1 });
                    res.status(200).json({ success: true, data: reports });
          } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
          }
};
