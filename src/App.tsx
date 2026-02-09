import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import HelpButton from './components/HelpButton';
import BookingWizard from './components/Booking/BookingWizard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main>
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Services />
            <Gallery />
            <Contact />
          </>
        } />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <BookingWizard isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      <HelpButton />
    </main>
  );
}

export default App;
