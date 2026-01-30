import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const links = [
    { name: 'INICIO', href: '#' },
    { name: 'SERVICIOS', href: '#servicios' },
    { name: 'GALERÍA', href: '#galeria' },
    { name: 'CONTACTO', href: '#contacto' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const toggleMenu = () => setIsOpen(!isOpen); // Added toggleMenu function

    const handleScrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <div className="logo" onClick={handleScrollToTop} style={{ cursor: 'pointer' }}>
                    <h3 className="text-2xl font-bold tracking-wider text-[var(--color-primary)]">TIGRE BARBERSHOP</h3>
                </div>

                <div className="desktop-menu">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="nav-link"
                            onClick={(e) => {
                                if (link.name === 'INICIO') {
                                    handleScrollToTop(e);
                                }
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="mobile-toggle">
                    <button onClick={toggleMenu}> {/* Changed to use toggleMenu */}
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-menu"
                    >
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="mobile-link"
                            >
                                {link.name}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
