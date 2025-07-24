import React from "react";
import { motion } from "framer-motion";
import { User, BrainCircuit, Star, ChartPie, Users, MoveRight, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const howItWorksSteps = [
    {
        date: "Step 1",
        title: "Sign Up & Set Goals",
        icon: <User className="w-10 h-10 text-emerald-500" />,
    },
    {
        date: "Step 2",
        title: "Practice Interviews",
        icon: <BrainCircuit className="w-10 h-10 text-blue-500" />,
    },
    {
        date: "Step 3",
        title: "Get Instant Feedback",
        icon: <Star className="w-10 h-10 text-purple-500" />,
    },
    {
        date: "Step 4",
        title: "Track Progress",
        icon: <ChartPie className="w-10 h-10 text-yellow-500" />,
    },
    {
        date: "Step 5",
        title: "Join Community",
        icon: <Users className="w-10 h-10 text-pink-500" />,
    },
];

export default function HowItWorksSection() {
    return (
        <section className="relative w-full py-20 px-4 flex justify-center bg-gray-50 dark:bg-dark-bg overflow-hidden">
            {/* Simple subtle background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                {/* Concentric circles top center - blue */}
                <div className="absolute left-1/4 top-0 -translate-x-1/2">
                    <div className="w-96 h-96 rounded-full bg-blue-100/20 dark:bg-blue-900/20 blur-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-72 h-72 rounded-full bg-blue-200/50 dark:bg-blue-800/30 blur-sm" />
                        <div className="absolute w-48 h-48 rounded-full bg-blue-300/50 dark:bg-blue-700/40 blur-xs" />
                        <div className="absolute w-28 h-28 rounded-full bg-blue-400/50 dark:bg-blue-600/20" />
                    </div>
                </div>
                {/* Concentric circles bottom right - emerald */}
                <div className="absolute right-1/4 bottom-0 translate-x-1/2">
                    <div className="w-96 h-96 rounded-full bg-emerald-100/20 dark:bg-emerald-900/20 blur-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-72 h-72 rounded-full bg-emerald-200/30 dark:bg-emerald-800/30 blur-sm" />
                        <div className="absolute w-48 h-48 rounded-full bg-emerald-400/40 dark:bg-emerald-700/40 blur-xs" />
                        <div className="absolute w-28 h-28 rounded-full bg-emerald-600/50 dark:bg-emerald-600/20" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl w-full z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-2xl md:text-3xl font-bold text-center mb-2 text-light-primary-text dark:text-dark-primary-text"
                >
                    How It Works
                </motion.h2>
                <p className="text-center text-light-secondary-text dark:text-dark-secondary-text text-sm mb-10 max-w-xl mx-auto">
                    Mockraft makes your interview prep journey simple and
                    effective. Here’s how you can get started and grow with
                    us:
                </p>
                {/* Timeline */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between md:gap-10 px-2">
                    {/* Line */}
                    <div
                        className="hidden md:block absolute left-0 right-0 top-15 h-[6px] rounded-full bg-light-secondary-text/20 dark:bg-dark-secondary-text/20 opacity-60 z-0"
                    />
                    {howItWorksSteps.map((step, idx) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.5 + idx * 0.1,
                                ease: "easeOut",
                            }}
                            className="relative z-10 flex flex-col items-center md:w-1/5 w-full"
                        >
                            {/* Icon with subtle ring */}
                            <div className="text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text mb-2">
                                {step.date}
                            </div>
                            <motion.div
                                className="relative mb-3 rounded-full"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="relative z-10 flex items-center justify-center p-4 rounded-full bg-light-surface dark:bg-dark-surface shadow-lg ">
                                    {step.icon}
                                </div>
                            </motion.div>
                            <div className="font-semibold max-w-[120px] text-base text-light-primary-text dark:text-dark-primary-text mb-1 text-center">
                                {step.title}
                            </div>
                            {/* Connector line for mobile */}
                            {idx < howItWorksSteps.length - 1 && (
                                <div className="block md:hidden w-1 h-8 bg-light-secondary-text/20 dark:bg-dark-secondary-text/20 mx-auto my-2 rounded-full"></div>
                            )}
                        </motion.div>
                    ))}
                </div>
                {/* More to come */}
                <div className="flex flex-col items-center mt-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.3 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        className="flex items-center gap-2 px-4 py-3 rounded-full bg-light-secondary dark:bg-dark-secondary shadow"
                        onClick={()=>{
                            toast.success("More features coming soon!");
                        }}
                    >
                        <span className="font-semibold text-white text-sm">
                            More features & updates coming soon!
                        </span>
                        <ArrowRight className="w-6 h-6 text-white" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}