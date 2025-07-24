import React from "react";
import { MailCheck } from "lucide-react";

/**
 * SupportContactCard
 * - All contact info and text is static inside the component.
 * - If you want to override any info, you can add props later.
 */
export default function SupportContactCard() {
    return (
        <div className="md:w-[49%] w-full bg-gradient-to-br from-light-primary/10 via-white to-light-primary/30 dark:from-dark-primary/20 dark:via-dark-primary/10 dark:to-dark-primary/30 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <MailCheck className="w-8 h-8 text-light-primary dark:text-dark-primary" />
                    <span className="text-xl font-bold text-light-primary dark:text-dark-primary">
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
                            href="mailto:mockraft.official@gmail.com"
                            className="text-light-primary dark:text-dark-primary font-semibold hover:underline"
                        >
                            mockraft.official@gmail.com
                        </a>
                    </span>
                    <span>
                        <span className="font-semibold">Phone:</span>{" "}
                        <a
                            href="tel:+1234567890"
                            className="text-light-primary dark:text-dark-primary font-semibold hover:underline"
                        >
                            +91 12345 67890
                        </a>
                    </span>
                    <span>
                        <span className="font-semibold">Live Chat:</span>{" "}
                        <a
                            href="/support"
                            className="text-light-primary dark:text-dark-primary font-semibold hover:underline"
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