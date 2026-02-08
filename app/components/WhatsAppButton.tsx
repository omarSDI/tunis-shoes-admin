'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = '1234567890'; // Replace with real number
    const message = 'Hello! I am interested in your luxury collection.';

    return (
        <motion.a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-shadow flex items-center justify-center border-2 border-white"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" fill="white" stroke="none" />
        </motion.a>
    );
}
