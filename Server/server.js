import 'dotenv/config';

import express from 'express';
import patientRoutes from './routes/patient.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import doctorRoutes from './routes/doctor.js';
import { getDoctors, getDoctorById } from './controller/doctor.js';
import chatRoutes from './routes/chat.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;



// Increase payload size limit BEFORE other middleware
app.use(express.json({ limit: '50mb' })); // For JSON data
app.use(express.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded data


// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ✔ IMPORTANT

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/healthcare$/, '/healthcarehealthcare') : 'mongodb://localhost:27017/healthcarehealthcare')
    .then(async () => {
        console.log('✓ Connected to MongoDB');
        console.log('Database:', mongoose.connection.db.databaseName);

        // Start background meeting scheduler
        try {
            const { startMeetingScheduler } = await import('./jobs/meetingScheduler.js');
            startMeetingScheduler();
        } catch (err) {
            console.warn('Failed to start meeting scheduler:', err.message || err);
        }
    })
    .catch((err) => {
        console.log('✗ MongoDB connection error: ', err.message);
    });

// Routes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api', patientRoutes);

// Chat API routes
app.use('/api', chatRoutes);

// Public endpoints for doctors (no auth)
app.get('/api/doctors', getDoctors);
app.get('/api/doctor/:id', getDoctorById);
// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Healthcare Backend API is running!' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
