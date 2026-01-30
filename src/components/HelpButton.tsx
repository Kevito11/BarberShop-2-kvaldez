import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestion, FaPaperPlane, FaCheck } from 'react-icons/fa';

export default function HelpButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState('');

    const toggleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsLoading(true);
            // Simular carga inicial del widget
            setTimeout(() => setIsLoading(false), 800);
        } else {
            setIsOpen(false);
            // Resetear estados al cerrar después de un tiempo
            setTimeout(() => {
                setIsSent(false);
                setMessage('');
            }, 500);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        // Simular envío a servidor
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
            setMessage('');
        }, 1500);
    };

    return (
        <>
            <div className="help-container">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={`help-popover ${isLoading ? 'loading' : ''}`}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : isSent ? (
                                <div className="success-message">
                                    <FaCheck className="text-green-500 text-3xl mb-2" />
                                    <p className="font-bold">¡Mensaje enviado!</p>
                                    <p className="text-sm text-gray-400 mt-2 text-center px-4">
                                        Gracias por tu sugerencia, seguiremos mejorando para el disfrute de nuestros usuarios
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="help-form">
                                    <p className="mb-3 text-sm">¿Tienes alguna sugerencia?</p>
                                    <textarea
                                        className="help-textarea"
                                        placeholder="Escribe tu mensaje aquí..."
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="send-button"
                                        disabled={isSending || !message.trim()}
                                    >
                                        {isSending ? 'Enviando...' : <><FaPaperPlane /> Enviar</>}
                                    </button>
                                </form>
                            )}
                            <div className="popover-arrow"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    className={`help-button ${isOpen ? 'active' : ''}`}
                    onClick={toggleOpen}
                    aria-label="Ayuda"
                >
                    <FaQuestion />
                </button>
            </div>
        </>
    );
}
