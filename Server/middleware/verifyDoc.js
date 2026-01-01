import jwt from "jsonwebtoken";

export const verifyDoctor = (req, res, next) => {
  if (req.role !== 'doctor') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Doctor role required."
    });
  }
  next();
};
