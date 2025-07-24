import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CTAGradientLight from "../../config/CTAGradient/CTAGradientLight";
import CTAGradientDark from "../../config/CTAGradient/CTAGradientDark";
import { useTheme } from "../../context/ThemeProvider";
import { SignUpButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
    const { theme } = useTheme();
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    return (
        <section className="relative w-full bg-light-bg dark:bg-dark-bg px-6 py-12 flex justify-center items-center overflow-hidden">
            <img
                src={theme ? "CTA-dark.png" : "CTA-light.png"}
                className="absolute w-full mx-auto inset-0 z-0"
            />
            <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center md:items-start px-4 md:px-8">
                {/* Left: Text */}
                <div className="flex-1 flex flex-col items-start justify-center mb-8 md:mb-0">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-3xl md:text-4xl font-bold text-dark-primary-text mb-3">
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
                        className="md:text-lg text-base text-dark-primary-text mb-6 max-w-md">
                        Join Mockraft today and unlock your full potential with
                        AI-powered practice, instant feedback, and a supportive
                        community.
                    </motion.p>
                    <motion.div>
                        {isSignedIn ? (
                            <button
                                className="inline-flex items-center gap-2 md:px-7 px-4 md:py-3 py-2 rounded-full bg-gradient-to-r from-light-bg to-light-surface  text-black font-semibold transition"
                                mode="modal"
                                onClick={() => {
                                    navigate("/dashboard");
                                }}>
                                <p className="text-xs md:text-base">Go to Dashboard</p>
                                <ArrowRight />
                            </button>
                        ) : (
                            <SignUpButton
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-light-bg to-light-surface  text-black font-semibold transition"
                                mode="modal"
                                navigate="/sign-up">
                                Get Started Free
                                {/* <ArrowRight /> */}
                            </SignUpButton>
                        )}
                    </motion.div>
                </div>
                {/* Right: (Optional illustration or empty for concise look) */}
                <div className="flex-1 hidden md:block" />
            </div>
        </section>
    );
}
