import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-24 pb-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="z-10"
                id="gradient"
            >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                    Practice. Improve. Get Hired. <br /> With Mockraft.
                </h1>
                <p className="max-w-xl mx-auto text-lg md:text-2xl text-light-primary-text dark:text-dark-primary-text mb-8">
                    Master interviews, track your growth, and join a winning community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/signup"
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f4f4f9] to-[#ffffff] dark:from-[#181818] dark:to-[#262626] text-black dark:text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        Get Started Free
                    </a>
                </div>
            </motion.div>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-emerald-400/10 rounded-full blur-3xl" />
            </div>
        </section>
    );
}