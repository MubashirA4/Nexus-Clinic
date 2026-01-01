import mongoose from 'mongoose';
import Appointment from './models/appointments.js';
import Doctor from './models/doctors.js';
import 'dotenv/config';

async function diagnose() {
          try {
                    await mongoose.connect(process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/healthcare$/, '/healthcarehealthcare') : 'mongodb://localhost:27017/healthcarehealthcare');
                    console.log('Connected to DB');

                    const doctors = await Doctor.find({}, { name: 1, email: 1, _id: 1 });
                    console.log('Doctors in DB:', doctors.length);
                    doctors.forEach(d => console.log(`- ${d.name} (${d.email}) ID: ${d._id}`));

                    const appointments = await Appointment.find({});
                    console.log('Total Appointments in DB:', appointments.length);

                    if (appointments.length > 0) {
                              console.log('Sample Appointment Associations:');
                              appointments.slice(0, 5).forEach(a => {
                                        console.log(`- Patient: ${a.patientName}, Doctor ID: ${a.doctor}, Status: ${a.status}, Date: ${a.date}`);
                              });
                    }

                    process.exit(0);
          } catch (err) {
                    console.error(err);
                    process.exit(1);
          }
}

diagnose();
