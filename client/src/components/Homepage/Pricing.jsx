import React, { useState } from "react";
import { CheckCircle, Star, Mail } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useUser } from "@clerk/clerk-react";

const plans = [
    {
        name: "Starter",
        price: { monthly: 0, annual: 0 },
        features: [
            "Unlimited interview practice",
            "Access to basic question sets",
            "Community support",
            "Track your progress",
        ],
        cta: "Get Started Now",
        highlight: false,
    },
    {
        name: "Pro",
        price: { monthly: 200, annual: 180 },
        features: [
            "Everything in Starter",
            "AI-powered feedback",
            "Premium question sets",
            "1-on-1 mentor sessions",
            "Advanced analytics",
        ],
        cta: "Buy Now",
        highlight: true,
        badge: "Most Popular",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

export default function Pricing() {
    const [billing, setBilling] = useState("monthly");
    const {user} = useUser();
    console.log("User data:", user.emailAddresses[0].emailAddress);
    const { Razorpay } = useRazorpay();

    const paymentHandler = async (price) => {
        console.log(`Proceeding to payment for Rs. ${price}`);

        const response = await axios.post(
            "http://localhost:4000/payment/create-order",
            {
                amount: price,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        console.log("Payment order response:", response.data);

        var options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            currency: "INR",
            name: "Mockraft",
            description: "Placement Preparation Platform",
            image: "/logo-dark-bnw.png",
            order_id: response.data.id,
            handler: function (response) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
            },
            // prefill: {
            //     name: user.fullName || user.firstName,
            //     email: user.emailAddresses[0].emailAddress,
            //     contact: "",
            // },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };
        const razorpay = new Razorpay(options);
        razorpay.open();
    };

    return (
        <div className="min-h-screen relative bg-light-bg dark:bg-dark-bg flex flex-col items-center py-12 px-2">
            <div className="max-w-6xl w-full mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-3xl md:text-4xl font-bold text-center text-light-primary-text dark:text-dark-primary-text mb-2">
                    Budget-friendly pricing alternatives
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="text-center text-light-secondary-text dark:text-dark-secondary-text mb-10">
                    Get started free or upgrade to unlock premium features for
                    your interview prep.
                </motion.p>
                {/* Billing Switch */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center justify-center gap-4 mb-8">
                    <span
                        className={`text-sm font-medium cursor-pointer ${
                            billing === "monthly"
                                ? "text-light-primary dark:text-dark-primary"
                                : "text-light-secondary-text dark:text-dark-secondary-text"
                        }`}
                        onClick={() => setBilling("monthly")}>
                        MONTHLY
                    </span>
                    <button
                        className={`relative w-14 h-7 rounded-full flex items-center px-1 transition-colors duration-200 ${
                            billing === "annual"
                                ? "bg-light-primary/30 dark:bg-dark-primary/30"
                                : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        onClick={() =>
                            setBilling(
                                billing === "monthly" ? "annual" : "monthly"
                            )
                        }
                        aria-label="Toggle billing period">
                        <span
                            className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-transform duration-200 shadow ${
                                billing === "annual"
                                    ? "translate-x-0 bg-light-primary dark:bg-dark-primary"
                                    : "translate-x-0 bg-white dark:bg-dark-surface"
                            }`}
                            style={{
                                transform:
                                    billing === "annual"
                                        ? "translateX(28px)"
                                        : "translateX(0)",
                            }}
                        />
                    </button>
                    <div>
                        <span
                            className={`text-sm font-medium cursor-pointer ${
                                billing === "annual"
                                    ? "text-light-primary dark:text-dark-primary"
                                    : "text-light-secondary-text dark:text-dark-secondary-text"
                            }`}
                            onClick={() => setBilling("annual")}>
                            ANNUAL
                        </span>

                        <span className="ml-2 text-xs text-light-success font-bold bg-light-success/10 px-2 py-0.5 rounded">
                            Save 20%
                        </span>
                    </div>
                </motion.div>
                {/* Plans + Contact */}
                <div className="grid md:grid-cols-3 grid-row-2 gap-6 items-start">
                    {/* Plans */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.name}
                                custom={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.01,
                                    boxShadow: plan.highlight
                                        ? "0 4px 16px 0 rgba(0,0,0,0.10)"
                                        : "0 4px 16px 0 rgba(0,0,0,0.10)",
                                    transition: { duration: 0.3 },
                                }}
                                className={`
                    relative rounded-2xl p-6 flex flex-col md:flex-row md:items-center border border-gray-100 dark:border-gray-700
                                                                                ${
                                                                                    plan.highlight
                                                                                        ? ` shadow-xl bg-light-surface dark:bg-dark-bg
                                                   after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none after:z-20
                                                   after:bg-[repeating-linear-gradient(120deg,rgba(45,93,237,0.13)_0px,transparent_1.5px,transparent_32px)]`
                                                                                        : " bg-light-surface dark:bg-dark-bg shadow"
                                                                                }
                    before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                  `}>
                                {/* Badge */}
                                {plan.highlight && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.3,
                                        }}
                                        className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-br dark:from-yellow-500 from-yellow-400 dark:to-yellow-600 to-yellow-500 text-white text-xs font-semibold px-3 py-2 rounded-full shadow z-10">
                                        <Star className="w-4 h-4 mr-1" />{" "}
                                        {plan.badge}
                                    </motion.div>
                                )}
                                {/* Plan Info */}
                                <div className="flex-1 flex flex-col md:flex-row justify-between">
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay: 0.2 + idx * 0.1,
                                                    duration: 0.4,
                                                }}
                                                className="flex items-center gap-2 mb-2">
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        plan.name.toUpperCase() ===
                                                        "STARTER"
                                                            ? "bg-gray-100 dark:bg-gray-800 text-light-secondary-text dark:text-dark-secondary-text"
                                                            : "bg-gradient-to-br dark:from-yellow-500 from-yellow-400 dark:to-yellow-600 to-yellow-500 text-white"
                                                    }  px-2 py-0.5 rounded`}>
                                                    {plan.name.toUpperCase()}
                                                </span>
                                            </motion.div>
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    x: -20,
                                                }}
                                                whileInView={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay: 0.25 + idx * 0.1,
                                                    duration: 0.4,
                                                }}
                                                className="flex items-end gap-1 mb-1">
                                                <span className="text-3xl font-extrabold text-light-primary dark:text-dark-primary">
                                                    {plan.price[billing] === 0
                                                        ? "Rs. 0"
                                                        : `Rs. ${plan.price[billing]}`}
                                                </span>
                                                <span className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-0.5">
                                                    /month
                                                </span>
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                delay: 0.45 + idx * 0.1,
                                                duration: 0.3,
                                            }}
                                            className="md:w-40">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05,
                                                }}
                                                whileTap={{
                                                    scale: 0.9,
                                                }}
                                                onClick={() =>
                                                    paymentHandler(
                                                        plan.price[billing]
                                                    )
                                                }
                                                className={`
                        w-full md:w-auto px-5 py-2 rounded-lg text-sm font-semibold transition
                        ${
                            plan.highlight
                                ? "bg-light-primary text-white hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover"
                                : "bg-gray-100 text-light-primary-text hover:bg-gray-200 dark:bg-gray-800 dark:text-dark-primary-text dark:hover:bg-gray-700"
                        }
                      `}>
                                                {plan.cta}
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                    <motion.ul
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.35 + idx * 0.1,
                                            duration: 0.4,
                                        }}
                                        className="mb-4 mt-2 space-y-2 w-3/5">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-2 text-light-primary-text dark:text-dark-primary-text text-sm">
                                                <CheckCircle className="w-4 h-4 text-light-success dark:text-dark-success" />
                                                {feature}
                                            </li>
                                        ))}
                                    </motion.ul>
                                </div>
                                {/* CTA */}
                            </motion.div>
                        ))}
                    </div>
                    {/* Contact Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="w-full h-full self-stretch flex flex-col">
                        <div className="flex-1 rounded-2xl bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white p-8 shadow-lg flex flex-col items-center justify-center h-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                className="mb-3">
                                <Mail className="w-8 h-8" />
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.3 }}
                                className="text-lg font-bold mb-2">
                                Contact Us
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.3 }}
                                className="text-sm mb-4 text-white text-center">
                                Need a custom plan or have questions? <br />
                                Reach out for enterprise solutions or team
                                pricing.
                            </motion.p>
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                href=""
                                className="w-full mt-2 py-2 rounded-lg bg-white text-light-primary font-semibold text-center">
                                Contact Us
                            </motion.a>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="text-xs text-center text-white/80 mt-6">
                                All plans include unlimited practice, progress
                                tracking, and access to our supportive
                                community.
                            </motion.p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
