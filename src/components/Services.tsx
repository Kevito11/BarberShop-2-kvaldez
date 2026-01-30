import { motion } from 'framer-motion';

const services = [
    { name: 'CORTE CLÁSICO', price: '20€', description: 'Corte tradicional a tijera o máquina, lavado y peinado.' },
    { name: 'CORTE + BARBA', price: '35€', description: 'Servicio completo de corte de cabello y arreglo de barba.' },
    { name: 'AFEITADO NAVAJA', price: '15€', description: 'Ritual de afeitado clásico con toalla caliente.' },
    { name: 'CORTE NIÑO', price: '15€', description: 'Estilo y cuidado para los más pequeños.' },
];

export default function Services() {
    return (
        <section id="servicios" className="section bg-dark">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>NUESTROS SERVICIOS</h2>
                    <p>Experiencia premium en cada detalle</p>
                </motion.div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.name}
                            className="service-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="service-top">
                                <h3>{service.name}</h3>
                                <span className="price">{service.price}</span>
                            </div>
                            <p>{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
