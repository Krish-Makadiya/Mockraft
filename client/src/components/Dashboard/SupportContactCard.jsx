import React from "react";
import { MailCheck } from "lucide-react";

/**
 * SupportContactCard
 * - All contact info and text is static inside the component.
 * - If you want to override any info, you can add props later.
 */
export default function SupportContactCard() {
    return (
        <div className="md:w-[49%] w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/40 dark:via-blue-900/10 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <MailCheck className="w-8 h-8 text-blue-500" />
                    <span className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        Need Help? Contact Us!
                    </span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm mb-4">
                    Our support team is here for you. Reach out for any queries, feedback, or issues.
                </div>
                <div className="flex flex-col gap-1 text-sm">
                    <span>
                        <span className="font-semibold">Email:</span>{" "}
                        <a
                            href="mailto:support@Mockraft.com"
                            className="text-blue-600 hover:underline"
                        >
                            support@Mockraft.com
                        </a>
                    </span>
                    <span>
                        <span className="font-semibold">Phone:</span>{" "}
                        <a
                            href="tel:+1234567890"
                            className="text-blue-600 hover:underline"
                        >
                            +1 234 567 890
                        </a>
                    </span>
                    <span>
                        <span className="font-semibold">Live Chat:</span>{" "}
                        <a
                            href="/support"
                            className="text-blue-600 hover:underline"
                        >
                            Start Chat
                        </a>
                    </span>
                </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                We usually respond within 24 hours.
            </div>
        </div>
    );
}