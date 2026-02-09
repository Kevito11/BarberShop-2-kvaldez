import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useBooking } from '../../hooks/useBooking';
import type { Appointment } from '../../hooks/useBooking';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

// Hardcoded for now, can be moved to DB later
const SERVICES = [
    { id: 'corte-clasico', name: 'CORTE CLÁSICO', price: '20€' },
    { id: 'corte-barba', name: 'CORTE + BARBA', price: '35€' },
    { id: 'afeitado', name: 'AFEITADO NAVAJA', price: '15€' },
    { id: 'corte-nino', name: 'CORTE NIÑO', price: '15€' },
];

const BARBERS = [
    { id: 'silla-1', name: 'Silla 1 (Juan)' },
    { id: 'silla-2', name: 'Silla 2 (Pedro)' },
    { id: 'silla-3', name: 'Silla 3 (Luis)' },
    { id: 'silla-4', name: 'Silla 4 (Carlos)' },
];

const TIME_SLOTS = [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "16:00", "17:00", "18:00", "19:00", "20:00"
];

interface BookingWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingWizard({ isOpen, onClose }: BookingWizardProps) {
    const { createBooking, getTakenSlots, loading, error } = useBooking();
    const [step, setStep] = useState(1);

    // Form State
    const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<typeof BARBERS[0] | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });

    const [takenSlots, setTakenSlots] = useState<string[]>([]);

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            // Optionally reset other fields
        }
    }, [isOpen]);

    // Fetch taken slots when date or barber changes
    useEffect(() => {
        if (selectedBarber && selectedDate) {
            getTakenSlots(selectedBarber.id, selectedDate).then(setTakenSlots);
        }
    }, [selectedBarber, selectedDate]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Intentando confirmar reserva...");

        // Manual validation feedback
        if (!selectedService || !selectedBarber || !selectedTime) {
            alert("Error: Faltan datos de la reserva. Por favor reinicia el proceso.");
            return;
        }

        if (!customerDetails.name || !customerDetails.phone || !customerDetails.email) {
            alert("Por favor completa todos los campos (Nombre, Teléfono, Email).");
            return;
        }

        // Basic format validation
        const isValidEmail = (email: string) => {
            const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase());
        };

        if (!isValidEmail(customerDetails.email)) {
            alert("Por favor, ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).");
            return;
        }

        const appointment: Appointment = {
            barberId: selectedBarber.id,
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            date: selectedDate,
            timeSlot: selectedTime,
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone
        };

        const success = await createBooking(appointment);
        if (success) {
            console.log("Reserva exitosa");
            setStep(5); // Success validation
        } else {
            console.error("Fallo la reserva");
            // If createBooking returns false, the hook sets 'error', but we also alert to be sure user sees it
            // We can read the error from state *on next render*, but here we just show generic or whatever current error is (might be stale if state update hasn't flushed).
            // Better to assume generic error if success is false
            alert("Hubo un problema al crear la reserva. Revisa la consola o intenta de nuevo.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="booking-modal-overlay">
            <motion.div
                className="booking-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <button className="modal-close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <h2 className="text-center mb-4">RESERVAR CITA</h2>

                {error && <div className="error-message bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3>1. Elige un Servicio</h3>
                        <div className="grid-options">
                            {SERVICES.map(s => (
                                <button
                                    key={s.id}
                                    className={`option-btn ${selectedService?.id === s.id ? 'active' : ''}`}
                                    onClick={() => setSelectedService(s)}
                                >
                                    {s.name} - {s.price}
                                </button>
                            ))}
                        </div>
                        <div className="modal-actions right-only">
                            <button className="btn-secondary" disabled={!selectedService} onClick={() => setStep(2)}>Siguiente</button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3>2. Elige un Profesional</h3>
                        <div className="grid-options">
                            {BARBERS.map(b => (
                                <button
                                    key={b.id}
                                    className={`option-btn ${selectedBarber?.id === b.id ? 'active' : ''}`}
                                    onClick={() => setSelectedBarber(b)}
                                >
                                    {b.name}
                                </button>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
                            <button className="btn-secondary" disabled={!selectedBarber} onClick={() => setStep(3)}>Siguiente</button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3>3. Fecha y Hora</h3>
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={(value) => setSelectedDate(value as Date)}
                                value={selectedDate}
                                minDate={new Date()}
                                className="react-calendar-dark"
                            />
                        </div>

                        <h4 className="mt-4">Horarios Disponibles para {selectedDate.toLocaleDateString()}:</h4>
                        <div className="time-grid">
                            {TIME_SLOTS.map(time => {
                                const isTaken = takenSlots.includes(time);
                                return (
                                    <button
                                        key={time}
                                        disabled={isTaken}
                                        className={`time-btn ${selectedTime === time ? 'active' : ''} ${isTaken ? 'disabled' : ''}`}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setStep(2)}>Atrás</button>
                            <button className="btn-secondary" disabled={!selectedTime} onClick={() => setStep(4)}>Siguiente</button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3>4. Tus Datos</h3>
                        <form onSubmit={handleBooking} className="booking-form">
                            <div className="form-group">
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    required
                                    value={customerDetails.name}
                                    onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    required
                                    value={customerDetails.phone}
                                    onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    required
                                    value={customerDetails.email}
                                    onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                                />
                            </div>

                            <div className="summary-card">
                                <h4>Resumen:</h4>
                                <p><strong>Servicio:</strong> {selectedService?.name}</p>
                                <p><strong>Peluquero:</strong> {selectedBarber?.name}</p>
                                <p><strong>Fecha:</strong> {selectedDate.toLocaleDateString()} a las {selectedTime}</p>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setStep(3)}>Atrás</button>
                                <button
                                    type="submit"
                                    className="btn-secondary"
                                    disabled={loading}
                                    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', fontWeight: 'bold' }}
                                >
                                    {loading ? 'CONFIRMANDO...' : 'CONFIRMAR'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center success-message"
                        style={{ padding: '1rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="rgba(74, 222, 128, 0.2)" />
                                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-7.86l-2.765-2.767L7 12.431l3.823 3.823 8.177-8.176-1.06-1.06-7.117 7.117z" fill="#4ade80" />
                            </svg>
                        </div>

                        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>¡RESERVA CONFIRMADA!</h2>
                        <p style={{ color: '#A1A1AA', marginBottom: '2rem' }}>Hemos enviado los detalles de tu cita a {customerDetails.email}</p>

                        <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#A1A1AA' }}>Servicio:</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{selectedService?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#A1A1AA' }}>Profesional:</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{selectedBarber?.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
                                <span style={{ color: '#A1A1AA' }}>Fecha:</span>
                                <span style={{ color: '#D4AF37', fontWeight: 600 }}>{selectedDate.toLocaleDateString()} - {selectedTime}</span>
                            </div>
                        </div>

                        <div className="w-full max-w-md mx-auto mb-8">
                            <h4 style={{ color: '#A1A1AA', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Agregar a mi calendario</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    onClick={() => {
                                        const startTime = new Date(selectedDate);
                                        const [hours, minutes] = selectedTime!.split(':').map(Number);
                                        startTime.setHours(hours, minutes, 0);

                                        const endTime = new Date(startTime);
                                        endTime.setHours(startTime.getHours() + 1);

                                        const title = `Cita en Barbería - ${selectedService?.name}`;
                                        const details = `Servicio: ${selectedService?.name}\nBarbero: ${selectedBarber?.name}\nCliente: ${customerDetails.name}`;
                                        const location = "Felipe IV 4 Bajo/Amara, San Sebastián";

                                        const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

                                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(startTime)}/${formatTime(endTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

                                        window.open(url, '_blank');
                                    }}
                                    className="calendar-btn"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem',
                                        backgroundColor: '#2D3748',
                                        border: '1px solid transparent',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        height: '90px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                                        e.currentTarget.style.borderColor = '#4285F4';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2D3748';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#4285F4" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" /></svg>
                                    <span style={{ fontSize: '0.85rem' }}>Google</span>
                                </button>

                                <button
                                    onClick={() => {
                                        const startTime = new Date(selectedDate);
                                        const [hours, minutes] = selectedTime!.split(':').map(Number);
                                        startTime.setHours(hours, minutes, 0);

                                        const endTime = new Date(startTime);
                                        endTime.setHours(startTime.getHours() + 1);

                                        const title = `Cita en Barbería - ${selectedService?.name}`;
                                        const description = `Servicio: ${selectedService?.name}\\nBarbero: ${selectedBarber?.name}\\nCliente: ${customerDetails.name}`;
                                        const location = "Felipe IV 4 Bajo/Amara, San Sebastián";

                                        const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');
                                        const now = new Date().toISOString().replace(/-|:|\.\d+/g, '');

                                        const icsContent = [
                                            'BEGIN:VCALENDAR',
                                            'VERSION:2.0',
                                            'PRODID:-//BarberShop//Appointment//EN',
                                            'BEGIN:VEVENT',
                                            `UID:${Date.now()}@barbershop.com`,
                                            `DTSTAMP:${now}`,
                                            `DTSTART:${formatTime(startTime)}`,
                                            `DTEND:${formatTime(endTime)}`,
                                            `SUMMARY:${title}`,
                                            `DESCRIPTION:${description}`,
                                            `LOCATION:${location}`,
                                            'END:VEVENT',
                                            'END:VCALENDAR'
                                        ].join('\\r\\n');

                                        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                                        const link = document.createElement('a');
                                        link.href = window.URL.createObjectURL(blob);
                                        link.setAttribute('download', 'cita-barberia.ics');
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="calendar-btn"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '1rem',
                                        backgroundColor: '#2D3748',
                                        border: '1px solid transparent',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        height: '90px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#2D3748';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#A0AEC0" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" /></svg>
                                    <span style={{ fontSize: '0.85rem' }}>Outlook / Apple</span>
                                </button>
                            </div>
                        </div>

                        <button
                            className="btn-secondary"
                            onClick={onClose}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                marginTop: '1rem',
                                fontSize: '1rem',
                                letterSpacing: '1px'
                            }}
                        >
                            CERRAR Y FINALIZAR
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
