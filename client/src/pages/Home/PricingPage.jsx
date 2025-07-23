import React, { useEffect, useState } from "react";
import { Check, ArrowRight, Crown } from "lucide-react";
import Navbar from "../../components/main/Navbar";
import { useTheme } from "../../context/ThemeProvider";
import { useUser } from "@clerk/clerk-react";
import { paymentHandler } from "../../config/PaymentHandlers";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../config/firebase";
import { useRazorpay } from "react-razorpay";

const plan = [
    {
        name: "Professional",
        features: [
            "All Basic Services",
            "Unlimited Requests",
            "Unlimited Revisions",
            "Cancel Anytime",
            "A-Sync Collaboration",
        ],
        price: 200,
        validity: "Month",
        highlight: "false",
    },
    {
        name: "Unlimited",
        features: [
            "All Basic Services",
            "Unlimited Requests",
            "Unlimited Revisions",
            "Cancel Anytime",
            "A-Sync Collaboration",
        ],
        price: 1920,
        validity: "Year",
        highlight: "true",
    },
];

const PricingPage = () => {
    const { theme } = useTheme(); // optional if root sets dark class
    const [userPlan, setUserPlan] = useState("free");
    const { user } = useUser();
    const { Razorpay } = useRazorpay();

    useEffect(() => {
        try {
            if (user && user.id) {
                const userRef = doc(db, "users", user.id);
                const fetchUserPlan = async () => {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        console.log("User data:", docSnap.data());
                        const userData = docSnap.data();
                        setUserPlan(userData.plan || "free");
                    } else {
                        console.log("No such document!");
                    }
                };
                fetchUserPlan();
            }
        } catch (error) {
            console.error("Error fetching user plan:", error);
        }
    }, [user]);

    const paymentClickHandler = async (amount) => {
        console.log("Payment response:");
        const response = await paymentHandler(amount, user, setUserPlan);
        console.log("Payment response:", response);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-light-primary-text dark:text-dark-primary-text">
                            Finally, a creative service with crystal clear,
                            subscription based pricing.
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-light-secondary-text dark:text-dark-secondary-text">
                            Rapidly scale creative output for content, brand,
                            social media and campaigns. Each plan includes a
                            dedicated design team to deliver beautiful designs,
                            on-time and at the scale you need.
                        </p>
                        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-light-primary hover:bg-light-primary-hover text-white dark:bg-dark-primary dark:hover:bg-dark-primary-hover">
                            Book a demo
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid w-4/5 mx-auto md:grid-cols-2 gap-8">
                        {plan.map((item, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-lg shadow-lg transition-transform transform hover:scale-101 ${
                                    item.highlight === "true"
                                        ? "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-900/40 dark:via-yellow-900/10 dark:to-gray-900 border-2 border-yellow-300 dark:border-yellow-800"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                }`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold mb-4 text-light-primary-text dark:text-dark-primary-text">
                                        {item.name}
                                    </h2>
                                    <p className="text-xs text-white px-3 py-1 rounded-xl mb-4 bg-dark-primary">
                                        {item.highlight === "true"
                                            ? "Most Popular"
                                            : "Best for small teams"}
                                    </p>
                                </div>
                                <ul className="mb-6">
                                    {item.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-2 mb-2 text-light-secondary-text dark:text-dark-secondary-text">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-4xl font-bold mb-4">
                                    Rs.{item.price}{" "}
                                    <span className="text-lg text-gray-400 font-normal">
                                        /{item.validity}
                                    </span>
                                </div>

                                {userPlan === "paid" ? (
                                    <button className="w-full px-4 py-2 bg-yellow-400 dark:bg-yellow-500    cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 justify-center">
                                        <p>Subscribed</p>
                                        <Crown />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            paymentClickHandler(item.price)
                                        }
                                        className="w-full px-4 py-2 bg-light-primary hover:bg-light-primary-hover text-white rounded-lg transition-colors">
                                        Upgrade Plan
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingPage;
