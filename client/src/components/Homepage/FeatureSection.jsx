import React from "react";
import { motion } from "framer-motion";
import { PlugZap, BrainCircuit, Handshake } from "lucide-react";

const features = [
    {
        icon: <PlugZap className="w-12 h-12 text-emerald-400 mt-1" />,
        title: "Zero Configuration Set Up",
        desc: "Instantly start practicing with smart defaults and real-time feedback—no setup required.",
    },
    {
        icon: <BrainCircuit className="w-9 h-9 text-purple-400 mt-1" />,
        title: "AI-Powered Insights",
        desc: "Get actionable, AI-driven analytics on your answers and progress.",
    },
    {
        icon: <Handshake className="w-9 h-9 text-blue-400 mt-1" />,
        title: "Community Support",
        desc: "Join a vibrant community, share experiences, and get peer feedback.",
    },
];

const featureListVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const featureItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function FeatureSection() {
    return (
        <section
            className="
                relative py-20 px-4 md:px-0 flex justify-center items-center
                bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f4f4f9] dark:from-[#262626] dark:via-[#181818] dark:to-[#181818]
                overflow-hidden
            "
        >
            <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 items-center">
                {/* Feature List */}
                <div className="flex-1">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-light-primary dark:text-dark-primary mb-2"
                    >
                        Features
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-sm md:text-base text-light-secondary-text dark:text-dark-secondary-text mb-8 max-w-lg"
                    >
                        A powerful dashboard to help you manage and analyze your interview progress, feedback, and growth—all in one place.
                    </motion.p>
                    <motion.ul
                        variants={featureListVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="space-y-4"
                    >
                        {features.map((feature, idx) => (
                            <motion.li
                                key={idx}
                                variants={featureItemVariants}
                                className=""
                                whileHover={{
                                    scale: 1.01,
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <div className="flex items-start gap-4 group p-4 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:shadow-md transition-all">
                                    {feature.icon}
                                    <div>
                                        <span
                                            className={`font-semibold text-light-primary-text dark:text-dark-primary-text transition group-hover:${
                                                feature.icon.props.className.includes("emerald")
                                                    ? "text-emerald-400"
                                                    : feature.icon.props.className.includes("purple")
                                                    ? "text-purple-400"
                                                    : "text-blue-400"
                                            }`}
                                        >
                                            {feature.title}
                                        </span>
                                        <p className="text-light-secondary-text dark:text-dark-secondary-text text-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
                {/* Glassy Card / Illustration */}
                <div className="flex-1 flex justify-center">
                    <div
                        className="
                            w-full max-w-lg rounded-2xl
                            bg-white/2 backdrop-blur-md border border-blue-200/10
                            shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4 flex flex-col items-center
                        "
                    >
                        {/* Replace with your own SVG/Chart/Illustration */}
                        <div className="w-full h-80 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-emerald-900/20 rounded-xl flex items-center justify-center">
                            <span className="text-blue-200/60 text-lg"></span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Subtle dots or decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-blue-400/10 blur-2xl" />
                <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-400/10 blur-2xl" />
            </div>
        </section>
    );
}