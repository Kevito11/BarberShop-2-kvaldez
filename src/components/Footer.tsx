import { FaEnvelope, FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-section bg-darker">
            <div className="container footer-content">
                <div className="footer-links">
                    <a href="/aviso-legal.pdf" target="_blank" rel="noreferrer">Aviso Legal</a>
                    <Link to="/accesibilidad">Política de Accesibilidad</Link>
                    <a href="/aviso-legal.pdf" target="_blank" rel="noreferrer">Política de privacidad</a>
                    <a href="/" onClick={(e) => e.preventDefault()}>Condiciones de uso</a>
                    <a href="/politica-cookies.pdf" target="_blank" rel="noreferrer">Política de cookies</a>
                </div>

                <div className="social-links">
                    <a href="mailto:info@tigrebarbershop.com" aria-label="Email"><FaEnvelope /></a>
                    <a href="https://api.whatsapp.com/send?phone=34610921939&text=Reservar%20Tigre%20BarberShop" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
                    <a href="https://www.facebook.com/tigrebarbershop" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                    <a href="https://www.instagram.com/tigrebarbershop" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                </div>

                <p className="copyright">&copy; {currentYear} Tigre Barbershop. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
