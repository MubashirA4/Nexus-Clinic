import HealthMetric from "../models/healthMetric.js";

export const addMetric = async (req, res) => {
          try {
                    const { type, value, unit, date } = req.body;
                    const patientId = req.userId;

                    const newMetric = new HealthMetric({
                              patient: patientId,
                              type,
                              value,
                              unit,
                              date: date || new Date()
                    });

                    await newMetric.save();

                    res.status(201).json({
                              success: true,
                              message: "Metric added successfully",
                              metric: newMetric
                    });
          } catch (error) {
                    console.error("Error adding metric:", error);
                    res.status(500).json({
                              success: false,
                              message: "Server error"
                    });
          }
};

export const getMetrics = async (req, res) => {
          try {
                    const patientId = req.userId;
                    const { type, limit = 10 } = req.query;

                    const query = { patient: patientId };
                    if (type) query.type = type;

                    const metrics = await HealthMetric.find(query)
                              .sort({ date: -1, createdAt: -1 })
                              .limit(parseInt(limit));

                    res.status(200).json({
                              success: true,
                              metrics
                    });
          } catch (error) {
                    console.error("Error fetching metrics:", error);
                    res.status(500).json({
                              success: false,
                              message: "Server error"
                    });
          }
};

export const getLatestMetrics = async (req, res) => {
          try {
                    const patientId = req.userId;

                    // Get the latest reading for each major type
                    const types = ['heartRate', 'bloodPressure', 'bloodGlucose', 'steps', 'calories', 'activeMinutes'];

                    const latestMetrics = await Promise.all(types.map(async (type) => {
                              return await HealthMetric.findOne({ patient: patientId, type })
                                        .sort({ date: -1, createdAt: -1 });
                    }));

                    // Filter out types with no data
                    const results = latestMetrics.filter(m => m !== null);

                    res.status(200).json({
                              success: true,
                              metrics: results
                    });
          } catch (error) {
                    console.error("Error fetching latest metrics:", error);
                    res.status(500).json({
                              success: false,
                              message: "Server error"
                    });
          }
};
