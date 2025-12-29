export const verifyPatient = (req, res, next) => {
    if (req.role !== 'patient') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Patient role required."
        });
    }
    next();
};