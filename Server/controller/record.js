import MedicalRecord from "../models/medicalRecord.js";
import Appointment from "../models/appointments.js";
import mongoose from "mongoose";

export const addRecord = async (req, res) => {
          try {
                    const {
                              patientId,
                              appointmentId,
                              patientName,
                              patientEmail,
                              diagnosis,
                              medications,
                              notes,
                              treatment
                    } = req.body;

                    const doctorId = req.userId; // From verifyToken

                    if (!patientId || !diagnosis || !medications) {
                              return res.status(400).json({ success: false, message: "Missing required fields" });
                    }

                    const newRecord = new MedicalRecord({
                              patient: patientId,
                              doctor: doctorId,
                              appointment: appointmentId,
                              patientName,
                              patientEmail,
                              diagnosis,
                              medications,
                              notes,
                              treatment
                    });

                    await newRecord.save();

                    // Optionally update appointment status to completed
                    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
                              await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });
                    }

                    res.status(201).json({
                              success: true,
                              message: "Medical record added successfully",
                              data: newRecord
                    });
          } catch (error) {
                    console.error("Error adding medical record:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};

export const getPatientHistory = async (req, res) => {
          try {
                    const { patientId } = req.params;

                    // Ensure patientId is valid
                    if (!mongoose.Types.ObjectId.isValid(patientId)) {
                              return res.status(400).json({ success: false, message: "Invalid patient ID" });
                    }

                    const records = await MedicalRecord.find({ patient: patientId })
                              .populate('doctor', 'name specialization image')
                              .sort({ createdAt: -1 });

                    res.status(200).json({ success: true, data: records });
          } catch (error) {
                    console.error("Error fetching patient history:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};

export const getMyRecords = async (req, res) => {
          try {
                    const patientId = req.userId;
                    const records = await MedicalRecord.find({ patient: patientId })
                              .populate('doctor', 'name specialization image')
                              .sort({ createdAt: -1 });

                    res.status(200).json({ success: true, data: records });
          } catch (error) {
                    console.error("Error fetching my records:", error);
                    res.status(500).json({ success: false, message: error.message });
          }
};
