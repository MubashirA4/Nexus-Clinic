import Patient from "../models/patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createUsers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Patient({
      name,
      email,
      password: hashedPassword,
      role: "patient",
      isActive: true,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, phone, address, image } = req.body;
    const id = req.userId; // Use ID from verified token

    console.log("Updating profile for ID:", id);
    console.log("Payload:", { name, age, gender, phone, address, image: image ? "Data present" : "None" });

    // Find patient by ID and update
    const updatedUser = await Patient.findByIdAndUpdate(
      id,
      { $set: { name, age, gender, phone, address, image } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        age: updatedUser.age,
        gender: updatedUser.gender,
        address: updatedUser.address,
        image: updatedUser.image,
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ role: 'patient' }).select('-password');
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Patient.findOne({ email });
    if (!user) return res.status(400).json({
      success: false,
      message: "Invalid credentials"
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({
      success: false,
      message: "Invalid credentials"
    });

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'patient'
    }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'patient',
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
        image: user.image
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
