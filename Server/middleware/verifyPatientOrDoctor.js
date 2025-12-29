export const verifyPatientOrDoctor = (req, res, next) => {
          if (req.role !== 'patient' && req.role !== 'doctor') {
                    return res.status(403).json({
                              success: false,
                              message: "Access denied. Patient or Doctor role required."
                    });
          }
          next();
};
