import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const links = [
    { name: 'INICIO', path: '/' },
    { name: 'SERVICIOS', path: '/#servicios' },
    { name: 'GALERÍA', path: '/#galeria' },
    { name: 'CONTACTO', path: '/#contacto' },
];

interface NavbarProps {
    onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (e: React.MouseEvent, path: string) => {
        // If it's an anchor link on the home page
        if (path.startsWith('/#')) {
            const id = path.substring(2);
            if (location.pathname === '/') {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
            // If on another page, let generic Link behavior handle navigation to '/' then anchor
        } else if (path === '/') {
            if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <h3 className="text-2xl font-bold tracking-wider text-[var(--color-primary)]">TIGRE BARBERSHOP</h3>
                </div>

                <div className="desktop-menu" style={{ alignItems: 'center' }}>
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="nav-link"
                            onClick={(e) => handleNavigation(e, link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                        onClick={onOpenBooking}
                    >
                        RESERVAR CITA
                    </button>
                </div>

                <div className="mobile-toggle">
                    <button onClick={toggleMenu}>
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
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => handleNavigation(e, link.path)}
                                className="mobile-link"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onOpenBooking();
                            }}
                            className="mobile-link"
                            style={{
                                color: 'var(--color-primary)',
                                fontWeight: 'bold',
                                background: 'none',
                                border: 'none',
                                width: '100%',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            RESERVAR AHORA
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
