import HeroSection from '../landing/HeroSection';
import { LiveDoctorAvailability } from '../landing/LiveDoctorAvailability';
import { TestimonialsSlider } from '../landing/TestimonialsSlider';
import { EmergencyBanner } from '../landing/EmergencyBanner';
import StatsSection from '../landing/StatsSection';
import { ServicesHome } from '../landing/Services';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesHome />
      <LiveDoctorAvailability />
      <TestimonialsSlider />
      <EmergencyBanner />
    </div>
  );
}
