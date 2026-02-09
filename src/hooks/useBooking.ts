import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

export interface Appointment {
    barberId: string;
    serviceId: string;
    serviceName: string; // Storing name for easier display/emails
    date: Date;
    timeSlot: string; // e.g., "10:00"
    customerName: string;
    customerPhone: string;
    customerEmail: string;
}

// Helper to prevent infinite hangs
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Tiempo de espera agotado para: ${operationName}. Revisa tu conexión.`)), timeoutMs)
        )
    ]);
};

export const useBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Checks if a specific slot is already taken for a given barber
    const checkAvailability = async (barberId: string, date: Date, timeSlot: string): Promise<boolean> => {
        try {
            const dateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
            console.log(`[CheckAvailability] Barber: ${barberId}, Date: ${dateString}, Slot: ${timeSlot}`);

            const q = query(
                collection(db, "appointments"),
                where("barberId", "==", barberId),
                where("dateString", "==", dateString),
                where("timeSlot", "==", timeSlot)
            );

            // Timeout after 7s for read ops
            const querySnapshot = await withTimeout(getDocs(q), 60000, "Verificar Disponibilidad");
            return querySnapshot.empty;
        } catch (err) {
            console.error("Error checking availability:", err);
            // Don't set global error here, just return false to fail safely or throw?
            // Throwing is better so createBooking catches it
            throw err;
        }
    };

    const createBooking = async (appointment: Appointment) => {
        setLoading(true);
        setError(null);
        console.log("Iniciando reserva...", appointment);

        // 0. Validate Env Vars
        const emailKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const emailService = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const emailTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        console.log("Verificando configuración de entorno:", {
            hasEmailKey: !!emailKey,
            hasEmailService: !!emailService,
            hasEmailTemplate: !!emailTemplate,
            hasFirebaseKey: !!import.meta.env.VITE_FIREBASE_API_KEY
        });

        if (!emailKey || !emailService || !emailTemplate) {
            const msg = "Error de configuración: Faltan credenciales de EmailJS.";
            console.error(msg);
            alert(msg);
            setLoading(false);
            return false;
        }

        try {
            // 1. Double-check availability
            console.log("Paso 1: Verificando disponibilidad...");
            const isAvailable = await checkAvailability(appointment.barberId, appointment.date, appointment.timeSlot);

            if (!isAvailable) {
                throw new Error("Lo sentimos, este horario ya ha sido reservado.");
            }

            // 2. Save to Firestore
            console.log("Paso 2: Guardando en Firestore...");
            const dateString = appointment.date.toLocaleDateString('en-CA');

            await withTimeout(
                addDoc(collection(db, "appointments"), {
                    ...appointment,
                    date: Timestamp.fromDate(appointment.date),
                    dateString: dateString,
                    createdAt: Timestamp.now()
                }),
                60000, // 7s timeout for write
                "Guardar Reserva"
            );

            // 3. Send Email via EmailJS
            console.log("Paso 3: Enviando email...");
            const templateParams = {
                // Admin context
                to_name: "Administrador",

                // Template fields for User Email
                name: appointment.customerName,       // Header: "message by {{name}}"
                user_name: appointment.customerName,  // Body: "Hola, {{user_name}}"
                service_name: appointment.serviceName,
                stylist_name: appointment.barberId,
                date: dateString,
                time: appointment.timeSlot,

                // Contact info
                phone: appointment.customerPhone,
                email: appointment.customerEmail,
                message: `Nueva reserva confirmada.`
            };

            await withTimeout(
                emailjs.send(emailService, emailTemplate, templateParams, emailKey),
                60000, // 7s timeout for email
                "Enviar Confirmación"
            );

            console.log("¡Reserva completada con éxito!");
            return true;

        } catch (err: any) {
            console.error("Error creating booking:", err);
            const msg = err.message || "Hubo un error desconocido al procesar la reserva.";
            setError(msg);
            alert(`Error: ${msg}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Helper to get all taken slots for a specific day/barber to disable them in UI
    const getTakenSlots = async (barberId: string, date: Date): Promise<string[]> => {
        try {
            const dateString = date.toLocaleDateString('en-CA');
            console.log(`[GetTakenSlots] Barber: ${barberId}, Date: ${dateString}`);

            const q = query(
                collection(db, "appointments"),
                where("barberId", "==", barberId),
                where("dateString", "==", dateString)
            );

            const querySnapshot = await withTimeout(getDocs(q), 60000, "Obtener Horarios");
            return querySnapshot.docs.map(doc => doc.data().timeSlot);
        } catch (err) {
            console.error("Error fetching slots:", err);
            return [];
        }
    };

    return { createBooking, checkAvailability, getTakenSlots, loading, error };
};
