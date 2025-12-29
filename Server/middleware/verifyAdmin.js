// verifyTokens middleware should be used before this
// It attaches req.role, req.userId etc.

export const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin access required."
    });
  }
  next();
};
