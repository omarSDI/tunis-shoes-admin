'use client';

import { motion } from 'framer-motion';

export default function Marquee() {
    const text = "تخفيضات خيالية لمدة محدودة  |  Discount up to 70% off  |  ";

    return (
        <div className="relative w-full overflow-hidden bg-[#D4AF37] py-2">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{
                        x: [0, -1000],
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                    className="flex shrink-0 items-center gap-4"
                >
                    <span className="text-black font-bold text-sm tracking-wider uppercase">
                        {text.repeat(10)}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
