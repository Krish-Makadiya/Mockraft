import React from "react";
import { Crown } from "lucide-react";

/**
 * PremiumHighlightCard
 * - All content is static except for the button label, which can be customized via prop.
 * - If you want to customize the features, pass an array as the `features` prop.
 */
export default function PremiumHighlightCard({ buttonLabel = "Upgrade Now", onUpgrade }) {
    // Static features list
    const features = [
        "Unlimited mock interviews & AI feedback",
        "Priority support & early feature access",
        "Exclusive resources and community",
    ];

    return (
        <div className="md:w-[49%] w-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-900/40 dark:via-yellow-900/10 dark:to-gray-900 border-2 border-yellow-300 dark:border-yellow-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                    <span className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                        Unlock Premium Features!
                    </span>
                </div>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 text-sm mb-4">
                    {features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>
                <div className="text-base font-semibold text-yellow-700 dark:text-yellow-200 mb-4">
                    Invest in your career. Stand out from the crowd.
                </div>
            </div>
            <button
                className="mt-2 px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow transition"
                onClick={onUpgrade}
            >
                {buttonLabel}
            </button>
        </div>
    );
}