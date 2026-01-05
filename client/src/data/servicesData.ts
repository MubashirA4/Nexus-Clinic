import RecordImage from '../assets/services/Patient-Records.png';
import SecureImage from '@/assets/services/Secure1.jpg'
import AppointmentImage from '@/assets/services/Appointment.jpg'
import TeleconsultationImage from '@/assets/services/TeleConsultation.png'
import CalendarImage from '@/assets/services/Calendar.jpeg'
import NotificationImage from '@/assets/services/notification.jpeg'

export interface Service {
          id: string;
          title: string;
          description: string;
          imageUrl: string;
          color: string;
          bgColor: string;
          badge?: string;
          longDescription?: string;
          process?: {
                    step: number;
                    title: string;
                    description: string;
                    duration: string;
          }[];
}

export const servicesData: Service[] = [
          {
                    id: 'appointment-scheduling',
                    title: 'Online Appointment Scheduling',
                    description: 'Browse through available doctors, select your preferred time slots, and instantly book appointments with our easy-to-use scheduling system designed for your convenience.',
                    imageUrl: AppointmentImage,
                    color: '#3b82f6',
                    bgColor: 'bg-blue-50',
                    badge: 'Core Feature',
                    longDescription: 'Our advanced scheduling system allows for seamless booking and management of medical appointments. Patients can see real-time availability of their preferred specialists and choose times that work best for their schedule.',
          },
          {
                    id: 'teleconsultation',
                    title: 'Doctor-Patient Teleconsultation',
                    description: 'Connect with certified doctors through secure video, audio, and chat consultations from anywhere, ensuring quality healthcare is always accessible when you need it most.',
                    imageUrl: TeleconsultationImage,
                    color: '#8b5cf6',
                    bgColor: 'bg-purple-50',
                    longDescription: 'Experience high-quality healthcare from the comfort of your home. Our teleconsultation platform provides secure, high-definition video and audio links to ensure your virtual visit is as effective as an in-person one.',
          },
          {
                    id: 'calendar-management',
                    title: 'Calendar & Availability Management',
                    description: 'Doctors efficiently manage their schedules with real-time updates and synchronization, preventing overlapping appointments and ensuring optimal time management for better patient care delivery.',
                    imageUrl: CalendarImage,
                    color: '#10b981',
                    bgColor: 'bg-green-50',
                    longDescription: 'Efficient calendar management ensures that our medical staff is always where they need to be. By synchronizing multiple schedules in real-time, we eliminate double-bookings and reduce wait times for our patients.',
          },
          {
                    id: 'reminders-notifications',
                    title: 'Reminders & Notifications',
                    description: 'Receive automated alerts and reminders via email and SMS about your upcoming appointments, ensuring you never miss an important consultation with your healthcare provider.',
                    imageUrl: NotificationImage,
                    color: '#ef4444',
                    bgColor: 'bg-red-50',
                    longDescription: 'Never miss an appointment again. Our automated notification system sends timely reminders via email and SMS, keeping both patients and healthcare providers informed about their upcoming schedule.',
          },
          {
                    id: 'secure-communication',
                    title: 'Secure Communication',
                    description: 'All consultations are protected with end-to-end encryption technology, ensuring complete privacy and full compliance with medical data protection standards for your peace of mind.',
                    imageUrl: SecureImage,
                    color: '#f59e0b',
                    bgColor: 'bg-yellow-50',
                    longDescription: 'Your privacy is our priority. All communications through our platform are protected by industry-standard end-to-end encryption, ensuring that your sensitive medical information stays between you and your doctor.',
          },
          {
                    id: 'patient-records',
                    title: 'Patient History & Records',
                    description: 'Securely store and access your complete consultation history, prescriptions, medical reports, and lab results in one convenient location for easy reference and continuity of care.',
                    imageUrl: RecordImage,
                    color: '#6366f1',
                    bgColor: 'bg-indigo-50',
                    longDescription: 'All your medical history in one secure place. Easily access your past prescriptions, lab results, and consultation notes anytime you need them, helping you maintain a clear picture of your health journey.',
          },
];