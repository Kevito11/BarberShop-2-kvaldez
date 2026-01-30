import { motion } from 'framer-motion';
import heroBg from '../assets/hero_bg.png';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <img src={heroBg} alt="Barbershop Interior" className="hero-bg" />

            <div className="container hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    TIGRE BARBERSHOP
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    MAESTRÍA Y TRADICIÓN EN CADA CORTE
                </motion.p>
                <motion.a
                    href="#contacto"
                    className="btn btn-primary"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    RESERVAR CITA
                </motion.a>
            </div>
        </section>
    );
}
