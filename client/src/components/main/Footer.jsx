import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeProvider";

const footerStagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 },
    },
};
const iconAnim = {
    whileHover: { scale: 1.18, rotate: 8 },
    whileTap: { scale: 0.92, rotate: -8 },
};
const buttonAnim = {
    whileHover: { scale: 1.05, boxShadow: "0 2px 12px 0 rgba(45,93,237,0.10)" },
    whileTap: { scale: 0.96 },
};

export default function Footer() {
    const { theme } = useTheme();

    return (
        <footer className="relative w-full bg-light-bg dark:bg-dark-bg py-16 pt-30 px-4">
            <motion.div
                className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8"
                variants={footerStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}>
                {/* Logo and tagline */}
                <motion.div
                    className="flex flex-col items-center md:items-start gap-3"
                    variants={fadeUp}>
                    <a href="/" className="flex items-center gap-2">
                        <motion.img
                            src={theme ? "/logo-dark.png" : "/logo-light.png"}
                            alt="Mockraft Logo"
                            className="h-10 w-10"
                            whileHover={{ scale: 1.1, rotate: 8 }}
                            whileTap={{ scale: 0.95, rotate: -8 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        />
                        <motion.span
                            className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text"
                            whileHover={{
                                letterSpacing: "0.08em",
                                color: "#2d5ded",
                            }}
                            transition={{ type: "spring", stiffness: 200 }}>
                            Mockraft
                        </motion.span>
                    </a>
                    <motion.p
                        className="text-light-secondary-text dark:text-dark-secondary-text text-sm max-w-xs text-center md:text-left"
                        variants={fadeUp}>
                        Practice. Improve. Get Hired. Your all-in-one interview
                        prep platform.
                    </motion.p>
                </motion.div>
                {/* Links */}
                <motion.div
                    className="flex flex-col md:flex-row gap-8"
                    variants={fadeUp}>
                    <motion.div
                        className="flex flex-col gap-2"
                        variants={fadeUp}>
                        <span className="font-semibold text-light-primary-text dark:text-dark-primary-text mb-1">
                            Product
                        </span>
                        <motion.a
                            href="/features"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            Features
                        </motion.a>
                        <motion.a
                            href="/pricing"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            Pricing
                        </motion.a>
                        <motion.a
                            href="/faq"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            FAQ
                        </motion.a>
                    </motion.div>
                    <motion.div
                        className="flex flex-col gap-2"
                        variants={fadeUp}>
                        <span className="font-semibold text-light-primary-text dark:text-dark-primary-text mb-1">
                            Company
                        </span>
                        <motion.a
                            href="/about"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            About
                        </motion.a>
                        <motion.a
                            href="/privacy"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            Privacy Policy
                        </motion.a>
                        <motion.a
                            href="/terms"
                            className="hover:underline text-light-secondary-text dark:text-dark-secondary-text"
                            whileHover={{ color: "#2d5ded" }}>
                            Terms of Service
                        </motion.a>
                    </motion.div>
                </motion.div>
                {/* CTA */}
                <motion.div
                    className="flex flex-col items-center md:items-end gap-4"
                    variants={fadeUp}>
                    <motion.a
                        href="/signup"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-light-primary text-white dark:bg-dark-primary font-semibold text-base shadow transition"
                        {...buttonAnim}>
                        Get Started Free
                        <motion.span {...iconAnim}>
                            <ArrowRight className="w-5 h-5" />
                        </motion.span>
                    </motion.a>
                    <motion.span
                        className="text-xs text-light-secondary-text dark:text-dark-secondary-text"
                        variants={fadeUp}>
                        &copy; {new Date().getFullYear()} Mockraft. All rights
                        reserved.
                    </motion.span>
                </motion.div>
            </motion.div>
        </footer>
    );
}
