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
    const { id, age, gender, phone, address } = req.body;
    console.log("Updating profile for ID:", id);
    console.log("Payload:", { age, gender, phone, address });

    // Find patient by ID and update
    const updatedUser = await Patient.findByIdAndUpdate(
      id,
      { $set: { age, gender, phone, address } },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("Profile updated successfully for ID:", id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      User: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
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
      id: user._id,
      role: user.role || 'patient' // Include role in token
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
