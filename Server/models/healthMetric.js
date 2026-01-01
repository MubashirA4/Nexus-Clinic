import mongoose from "mongoose";

const HealthMetricSchema = new mongoose.Schema({
          patient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Patient",
                    required: true
          },
          type: {
                    type: String,
                    enum: ['heartRate', 'bloodPressure', 'bloodGlucose', 'steps', 'calories', 'activeMinutes', 'weight'],
                    required: true
          },
          value: {
                    type: mongoose.Schema.Types.Mixed, // Can be number for heartRate or object for bloodPressure {systolic, diastolic}
                    required: true
          },
          unit: {
                    type: String,
                    required: true
          },
          date: {
                    type: Date,
                    default: Date.now
          }
}, { timestamps: true });

const HealthMetric = mongoose.models.HealthMetric || mongoose.model("HealthMetric", HealthMetricSchema);
export default HealthMetric;
