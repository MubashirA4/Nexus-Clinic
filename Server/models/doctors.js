import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop", // Default doctor image
    },
    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number, // years of experience
      default: 0,
    },

    phone: {
      type: String,
      required: false,
    },
    patients: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    education: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    specializations: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
