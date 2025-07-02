import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-24 pb-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                    Practice. Improve. Get Hired. <br /> With Mockraft.
                </h1>
                <p className="max-w-xl mx-auto text-lg md:text-2xl text-light-primary-text dark:text-dark-primary-text mb-8">
                    Master interviews, track your growth, and join a winning
                    community.
                </p>
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.98,
                    }}>
                    <a
                        href="/signup"
                        className="px-8 py-4 rounded-full bg-gradient-to-r dark:from-[#f4f4f9] dark:to-[#ffffff] from-[#181818] to-[#262626] dark:text-black text-white font-semibold">
                        Get Started Free
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
