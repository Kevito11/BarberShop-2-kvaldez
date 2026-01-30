import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Accessibility() {
    const navigate = useNavigate();

    return (
        <section className="section bg-dark min-h-screen pt-24 px-4">
            <div className="container max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-[var(--color-primary)] mb-8 hover:underline bg-transparent border-0 cursor-pointer text-base"
                >
                    <FaArrowLeft /> Volver atrás
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert max-w-none"
                >
                    <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-heading)] uppercase text-[var(--color-primary)]">
                        Declaración de accesibilidad
                    </h1>

                    <p className="mb-6 text-[var(--color-text-muted)]">
                        Tigre Barbershop se compromete a hacer accesible su sitio web de conformidad con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 mt-8 text-white">SITUACIÓN DE CUMPLIMIENTO</h2>
                    <p className="mb-6 text-[var(--color-text-muted)]">
                        Este sitio web es parcialmente conforme con el RD 1112/2018 debido a las excepciones y a la falta de conformidad de los aspectos que se indican a continuación.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 mt-8 text-white">CONTENIDO NO ACCESIBLE</h2>
                    <p className="mb-6 text-[var(--color-text-muted)]">
                        El contenido que se recoge a continuación no es accesible por lo siguiente:
                    </p>
                    <ul className="list-disc pl-5 mb-6 text-[var(--color-text-muted)] space-y-2">
                        <li>Existen documentos ofimáticos en PDF y otros formatos que podrían no cumplir en su totalidad los requisitos de accesibilidad.</li>
                        <li>Podrían existir fallos puntuales de edición en alguna página web.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mb-4 mt-8 text-white">PREPARACIÓN DE LA SIGUIENTE DECLARACIÓN DE ACCESIBILIDAD</h2>
                    <p className="mb-6 text-[var(--color-text-muted)]">
                        La presente declaración fue preparada el 1 de enero de 2026.
                        El método empleado para preparar la declaración ha sido una autoevaluación llevada a cabo por el propio organismo.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 mt-8 text-white">OBSERVACIONES Y DATOS DE CONTACTO</h2>
                    <p className="mb-6 text-[var(--color-text-muted)]">
                        Puede realizar comunicaciones sobre requisitos de accesibilidad (artículo 10.2.a) del RD 1112/2018) como por ejemplo:
                    </p>
                    <ul className="list-disc pl-5 mb-6 text-[var(--color-text-muted)] space-y-2">
                        <li>Informar sobre cualquier posible incumplimiento por parte de este sitio web.</li>
                        <li>Transmitir otras dificultades de acceso al contenido.</li>
                        <li>Formular cualquier otra consulta o sugerencia de mejora relativa a la accesibilidad del sitio web.</li>
                    </ul>
                    <p className="text-[var(--color-text-muted)]">
                        A través del correo electrónico: <a href="mailto:info@tigrebarbershop.com" className="text-[var(--color-primary)]">info@tigrebarbershop.com</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
