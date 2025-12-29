import RecordImage from '../assets/services/Patient-Records.png';

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
                    description: 'Patients can browse doctor availability, select time slots, and book appointments instantly.',
                    imageUrl: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=400&fit=crop',
                    color: '#3b82f6',
                    bgColor: 'bg-blue-50',
                    badge: 'Core Feature',
                    longDescription: 'Our advanced scheduling system allows for seamless booking and management of medical appointments. Patients can see real-time availability of their preferred specialists and choose times that work best for their schedule.',
          },
          {
                    id: 'teleconsultation',
                    title: 'Doctor-Patient Teleconsultation',
                    description: 'Secure video, audio, and chat consultations connecting doctors and patients remotely.',
                    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop',
                    color: '#8b5cf6',
                    bgColor: 'bg-purple-50',
                    longDescription: 'Experience high-quality healthcare from the comfort of your home. Our teleconsultation platform provides secure, high-definition video and audio links to ensure your virtual visit is as effective as an in-person one.',
          },
          {
                    id: 'calendar-management',
                    title: 'Calendar & Availability Management',
                    description: 'Doctors manage schedules with real-time updates to prevent overlapping appointments.',
                    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop',
                    color: '#10b981',
                    bgColor: 'bg-green-50',
                    longDescription: 'Efficient calendar management ensures that our medical staff is always where they need to be. By synchronizing multiple schedules in real-time, we eliminate double-bookings and reduce wait times for our patients.',
          },
          {
                    id: 'reminders-notifications',
                    title: 'Reminders & Notifications',
                    description: 'Automated alerts notify doctors and patients about upcoming appointments.',
                    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=400&fit=crop',
                    color: '#ef4444',
                    bgColor: 'bg-red-50',
                    longDescription: 'Never miss an appointment again. Our automated notification system sends timely reminders via email and SMS, keeping both patients and healthcare providers informed about their upcoming schedule.',
          },
          {
                    id: 'secure-communication',
                    title: 'Secure Communication',
                    description: 'End-to-end encrypted consultations ensuring privacy and medical data compliance.',
                    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop',
                    color: '#f59e0b',
                    bgColor: 'bg-yellow-50',
                    longDescription: 'Your privacy is our priority. All communications through our platform are protected by industry-standard end-to-end encryption, ensuring that your sensitive medical information stays between you and your doctor.',
          },
          {
                    id: 'patient-records',
                    title: 'Patient History & Records',
                    description: 'Store consultation history, prescriptions, and medical reports for future reference.',
                    imageUrl: RecordImage,
                    color: '#6366f1',
                    bgColor: 'bg-indigo-50',
                    longDescription: 'All your medical history in one secure place. Easily access your past prescriptions, lab results, and consultation notes anytime you need them, helping you maintain a clear picture of your health journey.',
          },
];
