import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CTAGradientLight from "../../config/CTAGradient/CTAGradientLight";
import CTAGradientDark from "../../config/CTAGradient/CTAGradientDark";
import { useTheme } from "../../context/ThemeProvider";

export default function CTASection() {
    const {theme} = useTheme();

    return (
        <section className="relative w-full bg-light-bg dark:bg-dark-bg px-6 py-12 flex justify-center items-center overflow-hidden">
            <div className="absolute w-[95%] bg-white   mx-auto inset-0 z-0 rounded-xl">
            {/* {
                theme ? <CTAGradientLight className="rounded-xl" /> : <CTAGradientDark className="rounded-xl" />
            } */}
            </div>
            <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center md:items-start px-4 md:px-8">
                {/* Left: Text */}
                <div className="flex-1 flex flex-col items-start justify-center mb-8 md:mb-0">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl md:text-4xl font-bold text-dark-primary-text dark:text-light-primary-text mb-3">
                        Ready to ace your next interview?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            ease: "easeOut",
                        }}
                        className="text-lg text-dark-primary-text/60 dark:text-light-primary-text/60 mb-6 max-w-md">
                        Join Careerly today and unlock your full potential with
                        AI-powered practice, instant feedback, and a supportive
                        community.
                    </motion.p>
                    <motion.a
                        href="/signup"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-dark-primary text-white dark:bg-light-primary font-semibold text-base shadow-lg transition">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </motion.a>
                </div>
                {/* Right: (Optional illustration or empty for concise look) */}
                <div className="flex-1 hidden md:block" />
            </div>
        </section>
    );
}
