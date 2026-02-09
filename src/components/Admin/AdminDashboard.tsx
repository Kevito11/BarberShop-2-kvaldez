import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../../firebase';
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Simple password protection (In a real app, use Firebase Auth)
const ADMIN_PASSWORD = "admin";

interface AppointmentData {
    id: string;
    barberId: string;
    serviceName: string;
    date: Timestamp;
    dateString: string;
    timeSlot: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            fetchAppointments();
        } else {
            alert("Contraseña incorrecta");
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // Fetch all appointments ordered by date
            const q = query(collection(db, "appointments"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AppointmentData[];
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter appointments for the selected date
    const dailyAppointments = appointments.filter(
        app => app.dateString === selectedDate.toLocaleDateString('en-CA')
    ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    if (!isAuthenticated) {
        return (
            <div className="section bg-darker" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="booking-container text-center">
                    <h2>Panel de Administración</h2>
                    <form onSubmit={handleLogin} style={{ marginTop: '2rem' }}>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #333' }}
                        />
                        <button type="submit" className="btn-primary" style={{ marginLeft: '1rem' }}>Entrar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <section className="section bg-darker admin-section" style={{ paddingTop: '120px' }}>
            <div className="container">
                <div className="section-header">
                    <h2>PANEL DE CONTROL</h2>
                    <p>Gestión de Reservas</p>
                </div>

                <div className="contact-grid"> {/* Reusing grid layout */}

                    {/* Calendar View */}
                    <div>
                        <h3 className="text-white mb-4">Seleccionar Fecha</h3>
                        <div className="booking-container">
                            <Calendar
                                onChange={(value) => setSelectedDate(value as Date)}
                                value={selectedDate}
                                tileContent={({ date, view }) => {
                                    // Show dot if appointments exist on this date
                                    if (view === 'month') {
                                        const dateStr = date.toLocaleDateString('en-CA');
                                        const hasApps = appointments.some(a => a.dateString === dateStr);
                                        return hasApps ? <div style={{ height: '6px', width: '6px', background: 'var(--color-primary)', borderRadius: '50%', margin: '2px auto' }}></div> : null;
                                    }
                                    return null;
                                }}
                            />
                        </div>
                    </div>

                    {/* List View */}
                    <div>
                        <h3 className="text-white mb-4">Citas para {selectedDate.toLocaleDateString()}</h3>
                        <div className="booking-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {loading ? (
                                <p className="text-white">Cargando...</p>
                            ) : dailyAppointments.length === 0 ? (
                                <p className="text-gray-400">No hay citas para este día.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {dailyAppointments.map(app => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={app.id}
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '1rem',
                                                borderRadius: '4px',
                                                borderLeft: '4px solid var(--color-primary)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{app.timeSlot}</span>
                                                <span style={{ color: 'var(--color-primary)' }}>{app.barberId}</span>
                                            </div>
                                            <h4 style={{ color: 'white', margin: '0' }}>{app.customerName}</h4>
                                            <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#aaa' }}>{app.serviceName}</p>
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                                                <p>📞 {app.customerPhone}</p>
                                                <p>✉️ {app.customerEmail}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
