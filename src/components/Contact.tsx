import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import Footer from './Footer';

export default function Contact() {
    return (
        <section id="contacto" className="section bg-darker section-contact-split">
            <div className="container contact-container-flex">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>VISÍTANOS</h2>
                </motion.div>

                <div className="contact-content-wrapper">
                    {/* Left: Info */}
                    <div className="contact-left">
                        <div className="info-item-large">
                            <a
                                href="https://maps.app.goo.gl/bb6zoRXXoG5kpNPb9"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', textDecoration: 'none', color: 'inherit' }}
                            >
                                <FaMapMarkerAlt className="icon" />
                                <div>
                                    <h3>Ubicación</h3>
                                    <p>Felipe IV 4 Bajo/Amara, San Sebastián</p>
                                </div>
                            </a>
                        </div>
                        <div className="info-item-large">
                            <a
                                href="https://wa.me/34610921939"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', textDecoration: 'none', color: 'inherit' }}
                            >
                                <FaPhone className="icon" />
                                <div>
                                    <h3>Teléfono</h3>
                                    <p>+34 610 92 19 39</p>
                                </div>
                            </a>
                        </div>
                        <div className="info-item-large">
                            <FaClock className="icon" />
                            <div>
                                <h3>Horario</h3>
                                <p>Lun - Sáb: 10:00 - 20:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Map */}
                    <motion.div
                        className="contact-right map-container-split"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <iframe
                            src="https://maps.google.com/maps?q=Felipe+IV+4+Bajo+Amara+San+Sebastian+Spain&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy">
                        </iframe>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </section>
    );
}
