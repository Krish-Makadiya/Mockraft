import React from "react";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "../../components/main/Navbar";
import { useTheme } from "../../context/ThemeProvider";

const PricingPage = () => {
    const { theme } = useTheme(); // optional if root sets dark class

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
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Professional Plan */}
                        <div className="rounded-2xl p-8 border bg-light-surface border-neutral-200 dark:bg-dark-bg dark:border-neutral-700 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-8 text-light-primary-text dark:text-dark-primary-text">
                                Professional
                            </h2>

                            <div className="space-y-4 mb-8">
                                {[
                                    "All Basic Services",
                                    "Unlimited Requests",
                                    "Unlimited Revisions",
                                    "Cancel Anytime",
                                    "A-Sync Collaboration",
                                ].map((item) => (
                                    <div
                                        className="flex items-center gap-3"
                                        key={item}>
                                        <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                                        <span className="text-slate-600 dark:text-neutral-300">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-slate-800 dark:text-neutral-100">
                                        3.990€
                                    </span>
                                    <span className="text-lg text-slate-600 dark:text-neutral-400">
                                        / month
                                    </span>
                                </div>
                            </div>

                            <button className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-slate-900 hover:bg-slate-800 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600">
                                Start now
                            </button>
                        </div>

                        {/* Unlimited Plan */}
                        <div className="relative rounded-2xl p-8 border-2 bg-slate-900 border-blue-600 dark:bg-neutral-800 dark:border-indigo-500 transition-all duration-300">
                            {/* Popular Badge */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 dark:bg-indigo-500 text-white">
                                    MOST POPULAR
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold mb-8 text-white">
                                Unlimited
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="space-y-4">
                                    {[
                                        "All Basic Services",
                                        "All Advanced Services",
                                        "Cancel anytime",
                                        "Art Direction",
                                        "Concept and Ideation",
                                    ].map((item) => (
                                        <div
                                            className="flex items-center gap-3"
                                            key={item}>
                                            <Check className="w-5 h-5 text-green-400" />
                                            <span className="text-neutral-300 text-sm">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {[
                                        "Unlimited Requests",
                                        "Unlimited Revisions",
                                        "A-Sync Collaboration",
                                        "Weekly Updates",
                                    ].map((item) => (
                                        <div
                                            className="flex items-center gap-3"
                                            key={item}>
                                            <Check className="w-5 h-5 text-green-400" />
                                            <span className="text-neutral-300 text-sm">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-white">
                                        5.990€
                                    </span>
                                    <span className="text-lg text-neutral-400">
                                        / month
                                    </span>
                                </div>
                            </div>

                            <button className="w-full py-3 px-6 rounded-lg font-medium transition-colors bg-lime-400 hover:bg-lime-500 text-black dark:bg-lime-500 dark:hover:bg-lime-400">
                                Start now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingPage;
