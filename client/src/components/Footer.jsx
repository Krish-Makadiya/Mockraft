import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="relative w-full bg-light-bg dark:bg-dark-bg py-16 pt-30 px-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                {/* Logo and tagline */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Careerly Logo"
                            className="h-10 w-10"
                        />
                        <span className="text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Careerly
                        </span>
                    </a>
                    <p className="text-light-secondary-text dark:text-dark-secondary-text text-sm max-w-xs text-center md:text-left">
                        Practice. Improve. Get Hired. Your all-in-one interview prep platform.
                    </p>
                </div>
                {/* Links */}
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-light-primary-text dark:text-dark-primary-text mb-1">Product</span>
                        <a href="/features" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">Features</a>
                        <a href="/pricing" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">Pricing</a>
                        <a href="/faq" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">FAQ</a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-light-primary-text dark:text-dark-primary-text mb-1">Company</span>
                        <a href="/about" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">About</a>
                        <a href="/privacy" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">Privacy Policy</a>
                        <a href="/terms" className="hover:underline text-light-secondary-text dark:text-dark-secondary-text">Terms of Service</a>
                    </div>
                </div>
                {/* CTA */}
                <div className="flex flex-col items-center md:items-end gap-4">
                    <motion.a
                        href="/signup"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-light-primary text-white dark:bg-dark-primary font-semibold text-base shadow transition"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </motion.a>
                    <span className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                        &copy; {new Date().getFullYear()} Careerly. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}