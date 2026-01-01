import Message from "../models/message.js";
import Appointment from "../models/appointments.js";
import MedicalRecord from "../models/medicalRecord.js";
import Doctor from "../models/doctors.js";
import Patient from "../models/patient.js";

// Send a message
export const sendMessage = async (req, res) => {
          try {
                    const { receiverId, receiverType, content } = req.body;
                    const senderId = req.userId;
                    const senderType = req.role === 'doctor' ? 'Doctor' : 'Patient';

                    const newMessage = new Message({
                              sender: senderId,
                              senderType,
                              receiver: receiverId,
                              receiverType,
                              content
                    });

                    await newMessage.save();

                    res.status(201).json({
                              success: true,
                              message: "Message sent",
                              data: newMessage
                    });
          } catch (error) {
                    console.error("Error sending message:", error);
                    res.status(500).json({ success: false, message: "Server error" });
          }
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
          try {
                    const { otherSideId } = req.params;
                    const userId = req.userId;

                    const messages = await Message.find({
                              $or: [
                                        { sender: userId, receiver: otherSideId },
                                        { sender: otherSideId, receiver: userId }
                              ]
                    }).sort({ createdAt: 1 });

                    // Mark as read if current user is receiver
                    await Message.updateMany(
                              { sender: otherSideId, receiver: userId, isRead: false },
                              { $set: { isRead: true } }
                    );

                    res.status(200).json({
                              success: true,
                              data: messages
                    });
          } catch (error) {
                    console.error("Error fetching messages:", error);
                    res.status(500).json({ success: false, message: "Server error" });
          }
};

// Get list of active conversations for current user
export const getConversations = async (req, res) => {
          try {
                    const userId = req.userId;
                    const userRole = req.role; // Assuming role is available on req from verifyToken

                    // Find all messages involving the user
                    const messages = await Message.find({
                              $or: [{ sender: userId }, { receiver: userId }]
                    }).sort({ createdAt: -1 });

                    const conversationMap = new Map();

                    for (const msg of messages) {
                              const otherId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
                              const otherType = msg.sender.toString() === userId.toString() ? msg.receiverType : msg.senderType;

                              if (!conversationMap.has(otherId)) {
                                        let otherInfo = null;
                                        if (otherType === 'Doctor') {
                                                  otherInfo = await Doctor.findById(otherId).select('name specialization image');
                                        } else {
                                                  otherInfo = await Patient.findById(otherId).select('name email');
                                        }

                                        conversationMap.set(otherId, {
                                                  otherId,
                                                  otherType,
                                                  otherInfo,
                                                  lastMessage: msg.content,
                                                  lastMessageDate: msg.createdAt,
                                                  unreadCount: 0
                                        });
                              }

                              if (!msg.isRead && msg.receiver.toString() === userId.toString()) {
                                        const conv = conversationMap.get(otherId);
                                        conv.unreadCount += 1;
                              }
                    }

                    res.status(200).json({
                              success: true,
                              data: Array.from(conversationMap.values())
                    });
          } catch (error) {
                    console.error("Error fetching conversations:", error);
                    res.status(500).json({ success: false, message: "Server error" });
          }
};

// Get eligible contacts based on medical relationship
export const getEligibleContacts = async (req, res) => {
          try {
                    const userId = req.userId;
                    const userRole = req.role;

                    let contacts = [];

                    if (userRole === 'doctor') {
                              // Doctors can message patients who have appointments with them or medical records
                              const [appointments, records] = await Promise.all([
                                        Appointment.find({ doctor: userId }).distinct('patient'),
                                        MedicalRecord.find({ doctor: userId }).distinct('patient')
                              ]);

                              const patientIds = [...new Set([...appointments, ...records])].filter(id => id);
                              contacts = await Patient.find({ _id: { $in: patientIds } }).select('name email');
                              contacts = contacts.map(c => ({ ...c.toObject(), type: 'Patient' }));
                    } else {
                              // Patients can message doctors they have appointments with or records from
                              const [appointments, records] = await Promise.all([
                                        Appointment.find({ patient: userId }).distinct('doctor'),
                                        MedicalRecord.find({ patient: userId }).distinct('doctor')
                              ]);

                              const doctorIds = [...new Set([...appointments, ...records])].filter(id => id);
                              contacts = await Doctor.find({ _id: { $in: doctorIds } }).select('name specialization image');
                              contacts = contacts.map(c => ({ ...c.toObject(), type: 'Doctor' }));
                    }

                    res.status(200).json({
                              success: true,
                              data: contacts
                    });
          } catch (error) {
                    console.error("Error fetching eligible contacts:", error);
                    res.status(500).json({ success: false, message: "Server error" });
          }
};
