import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import heroBg from '../assets/hero_bg.png';

export default function Gallery() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const images = Array(8).fill(heroBg); // Increased to 8 for collage effect

    return (
        <section id="galeria" className="section bg-dark">
            <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>GALERÍA</h2>
                    <p>Nuestra atmósfera y resultados</p>
                </motion.div>

                <div className="gallery-grid">
                    {images.map((img, index) => (
                        <motion.div
                            layoutId={`img-${index}`}
                            key={index}
                            className={`gallery-item ${index === 0 || index === 5 ? 'gallery-item-large' : ''}`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedId(index)}
                        >
                            <img src={img} alt={`Gallery ${index + 1}`} />
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedId !== null && (
                        <motion.div
                            className="lightbox-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                        >
                            <motion.div
                                layoutId={`img-${selectedId}`}
                                className="lightbox-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button className="lightbox-close" onClick={() => setSelectedId(null)}>
                                    <FaTimes />
                                </button>
                                <img src={images[selectedId]} alt="Enlarged view" />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
