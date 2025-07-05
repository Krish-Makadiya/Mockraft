import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Rocket,
    Users,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

const whyChooseUs = [
    {
        icon: <ShieldCheck className="w-10 h-10 text-blue-500" />,
        title: "Expert Mentors",
        desc: "Learn from seasoned professionals who have cracked top interviews and know what it takes to succeed.",
    },
    {
        icon: <Rocket className="w-10 h-10 text-purple-500" />,
        title: "Career-Ready Practice",
        desc: "Sharpen your skills with real-world interview questions and actionable feedback tailored to your goals.",
    },
    {
        icon: <Users className="w-10 h-10 text-emerald-500" />,
        title: "Supportive Community",
        desc: "Join a thriving network of peers and mentors, share experiences, and grow together.",
    },
    {
        icon: <CheckCircle className="w-10 h-10 text-white" />,
        title: "About Mockraft",
        desc: "Mockraft empowers job seekers and professionals with a user-friendly platform for interview prep and career growth. We blend technology, expert insights, and community to help you unlock your potential and land your dream job.",
    },
];

const whyChooseListVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.18,
        },
    },
};

const whyChooseItemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const whyChooseHighlightVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

export default function WhyChooseUsSection() {
    return (
        <section className="relative w-full bg-light-bg dark:bg-dark-bg py-20 px-4 flex justify-center z-10">
            <div className="max-w-6xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mb-8">
                    <span className="uppercase text-xs tracking-widest text-light-primary-text dark:text-dark-primary-text font-semibold bg-light-surface dark:bg-dark-surface px-3 py-1 rounded-full">
                        Why Choose Us
                    </span>
                    <h2 className="mt-4 text-2xl md:text-3xl font-bold text-light-primary-text dark:text-dark-primary-text">
                        Why{" "}
                        <span className="text-light-secondary dark:text-dark-secondary">
                            Mockraft
                        </span>{" "}
                        is the Right Choice for You
                    </h2>
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    variants={whyChooseListVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}>
                    {/* Left 2 cards */}
                    <div className="flex flex-col gap-4 md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {whyChooseUs.slice(0, 2).map((item) => (
                                <motion.div
                                    key={item.title}
                                    variants={whyChooseItemVariants}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow:
                                            "0 8px 32px 0 rgba(0,0,0,0.10)",
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                        boxShadow: "0px",
                                    }}
                                    className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 flex flex-col gap-3 shadow-sm transition-all">
                                    <div>{item.icon}</div>
                                    <h3 className="font-semibold text-lg text-light-primary-text dark:text-dark-primary-text">
                                        {item.title}
                                    </h3>
                                    <p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        {/* Bottom left card */}
                        <motion.div
                            variants={whyChooseItemVariants}
                            whileHover={{
                                scale: 1.01,
                                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)",
                            }}
                            whileTap={{
                                scale: 0.98,
                                boxShadow: "0px",
                            }}
                            className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 flex flex-col gap-3 shadow-sm transition-all">
                            <div>{whyChooseUs[2].icon}</div>
                            <h3 className="font-semibold text-lg text-light-primary-text dark:text-dark-primary-text">
                                {whyChooseUs[2].title}
                            </h3>
                            <p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
                                {whyChooseUs[2].desc}
                            </p>
                        </motion.div>
                    </div>
                    {/* Highlighted right card */}
                    <motion.div
                        variants={whyChooseHighlightVariants}
                        whileHover={{
                            scale: 1.01,
                            boxShadow: "0 12px 40px 0 rgba(16,37,212,0.18)",
                        }}
                        whileTap={{
                            scale: 0.98,
                            boxShadow: "0px",
                        }}
                        className="bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary rounded-xl p-6 flex flex-col gap-4 shadow-md dark:text-dark-primary-text justify-between transition-all">
                        <div>{whyChooseUs[3].icon}</div>
                        <div>
                            <h3 className="font-semibold text-2xl text-white">
                                {whyChooseUs[3].title}
                            </h3>
                            <p className=" text-sm mt-3 text-white">
                                {whyChooseUs[3].desc}
                            </p>
                        </div>
                        <motion.a
                            href="/signup"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-4 w-fit bg-white text-light-primary font-semibold px-5 py-2 flex gap-2 rounded-full transition">
                            <p>Start Free Trial</p>
                            <ArrowRight />
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
