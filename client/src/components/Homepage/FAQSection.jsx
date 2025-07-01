import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    HelpCircle,
    CreditCard,
    User,
    Zap,
    ShieldCheck,
} from "lucide-react";

const faqGroups = [
    {
        name: "General",
        icon: <HelpCircle className="w-6 h-6" />,
        faqs: [
            {
                q: "Is there a free trial available?",
                a: "Yes! You can start practicing for free with limited features. Upgrade anytime for more.",
            },
            {
                q: "Do I need to enter payment details to start?",
                a: "No, you can use the free plan without entering payment details.",
            },
            {
                q: "Can I use Careerly on mobile?",
                a: "Yes, Careerly works great on all devices.",
            },
            {
                q: "Is Careerly suitable for all experience levels?",
                a: "Absolutely! Whether you’re a beginner or an experienced professional, Careerly adapts to your needs.",
            },
            {
                q: "Can I invite friends to join Careerly?",
                a: "Yes, you can invite friends and grow together. Stay tuned for referral rewards!",
            },
        ],
    },
    {
        name: "Pricing",
        icon: <CreditCard className="w-6 h-6" />,
        faqs: [
            {
                q: "How does billing work?",
                a: "You can choose monthly or annual billing. Cancel anytime from your dashboard.",
            },
            {
                q: "Can I change my plan later?",
                a: "Absolutely! Upgrade or downgrade your plan at any time.",
            },
            {
                q: "Is there a discount for annual plans?",
                a: "Yes, you save 20% when you choose annual billing.",
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards and UPI.",
            },
            {
                q: "Will I be charged automatically?",
                a: "Yes, subscriptions renew automatically, but you can cancel anytime.",
            },
        ],
    },
    {
        name: "Account",
        icon: <User className="w-6 h-6" />,
        faqs: [
            {
                q: "How do I change my account email?",
                a: "Go to your profile settings and update your email address.",
            },
            {
                q: "How do I reset my password?",
                a: "Click 'Forgot password' on the login page and follow the instructions.",
            },
            {
                q: "Can I delete my account?",
                a: "Yes, you can delete your account from your profile settings.",
            },
            {
                q: "How do I update my profile information?",
                a: "Edit your details anytime from your dashboard profile section.",
            },
            {
                q: "Can I use multiple devices?",
                a: "Yes, your account works seamlessly across all your devices.",
            },
        ],
    },
    {
        name: "Features",
        icon: <Zap className="w-6 h-6" />,
        faqs: [
            {
                q: "How does AI feedback work?",
                a: "Our AI analyzes your answers and provides instant, actionable feedback.",
            },
            {
                q: "Can I track my progress?",
                a: "Yes, your dashboard shows your practice stats and improvement over time.",
            },
            {
                q: "Are there mock interviews?",
                a: "Yes, you can take unlimited mock interviews tailored to your goals.",
            },
            {
                q: "Can I customize my practice topics?",
                a: "Absolutely! Choose topics and skills you want to focus on.",
            },
            {
                q: "Is there a community or forum?",
                a: "Yes, join our supportive community to share tips and experiences.",
            },
        ],
    },
    {
        name: "Security",
        icon: <ShieldCheck className="w-6 h-6" />,
        faqs: [
            {
                q: "Is my data safe?",
                a: "We use industry-standard encryption and never share your data.",
            },
            {
                q: "Can I export my data?",
                a: "Yes, you can export your practice history and stats anytime.",
            },
            {
                q: "How do you handle privacy?",
                a: "We comply with all privacy regulations and never sell your data.",
            },
            {
                q: "Is payment information secure?",
                a: "All payments are processed securely using PCI-compliant providers.",
            },
            {
                q: "How do I report a security issue?",
                a: "Contact our support team immediately at support@careerly.com.",
            },
        ],
    },
];

// ...existing imports and code...

function FAQList({ group, openIdx, handleToggle, activeGroup, icon }) {
    // Stagger and item animation configs (static)
    const faqStagger = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };
    const faqItemAnim = {
        hidden: { opacity: 0, y: 24, boxShadow: "0 0 0 0 rgba(45,93,237,0)" },
        visible: {
            opacity: 1,
            y: 0,
            boxShadow: "0 2px 16px 0 rgba(45,93,237,0.07)",
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    // Control animation when FAQ list is in viewport
    const [inView, setInView] = React.useState(false);
    const ref = React.useRef();

    React.useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <motion.ul
            ref={ref}
            variants={faqStagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-4">
            {group.faqs.map((faq, idx) => (
                <motion.li
                    key={faq.q}
                    variants={faqItemAnim}
                    className="bg-white dark:bg-dark-surface rounded-xl shadow-sm transition-all border border-gray-100 dark:border-gray-800 py-4">
                    <button
                        className="w-full flex items-center justify-between gap-4 px-5 text-left focus:outline-none"
                        onClick={() => handleToggle(idx)}>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary font-bold">
                                {icon}
                            </span>
                            <span className="font-medium text-light-primary-text dark:text-dark-primary-text text-base">
                                {faq.q}
                            </span>
                        </div>
                        <ChevronDown
                            className={`w-5 h-5 text-light-secondary-text dark:text-dark-secondary-text transition-transform duration-200 ${
                                openIdx[activeGroup] === idx ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                    <AnimatePresence initial={false}>
                        {openIdx[activeGroup] === idx && (
                            <motion.div
                                key="answer"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="px-16 pt-4 text-light-secondary-text dark:text-dark-secondary-text text-sm overflow-hidden">
                                {faq.a}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.li>
            ))}
        </motion.ul>
    );
}

export default function FAQSection() {
    const [activeGroup, setActiveGroup] = useState(faqGroups[0].name);
    const [openIdx, setOpenIdx] = useState({ [faqGroups[0].name]: 0 });

    React.useEffect(() => {
        setOpenIdx((prev) => {
            if (prev[activeGroup] === undefined) {
                return { ...prev, [activeGroup]: 0 };
            }
            return prev;
        });
    }, [activeGroup]);

    const group = faqGroups.find((g) => g.name === activeGroup);

    const handleTabChange = (name) => {
        setActiveGroup(name);
    };

    const handleToggle = (idx) => {
        setOpenIdx((prev) => ({
            ...prev,
            [activeGroup]: prev[activeGroup] === idx ? null : idx,
        }));
    };

    return (
        <section className="relative w-full py-20 px-4 flex justify-center bg-light-bg dark:bg-dark-bg">
            <div className="max-w-3xl w-full mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-2xl md:text-3xl font-bold text-center mb-2 text-light-primary-text dark:text-dark-primary-text">
                    Frequently asked questions
                </motion.h2>
                <p className="text-center text-light-secondary-text dark:text-dark-secondary-text text-sm mb-8">
                    Can’t find what you’re looking for?{" "}
                    <a
                        href="mailto:support@Mockraft.com"
                        className="text-light-primary dark:text-dark-primary hover:underline">
                        Contact our team
                    </a>
                </p>
                {/* FAQ Groups */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {faqGroups.map((g) => (
                        <button
                            key={g.name}
                            onClick={() => handleTabChange(g.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
                                ${
                                    activeGroup === g.name
                                        ? "bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white border-transparent"
                                        : "bg-light-surface dark:bg-dark-surface text-light-primary-text dark:text-dark-primary-text border-gray-200 dark:border-gray-700 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
                                }
                            `}>
                            {g.icon}
                            <span className="text-sm font-medium">
                                {g.name}
                            </span>
                        </button>
                    ))}
                </div>
                {/* FAQ List with stagger effect */}
                <FAQList
                    group={group}
                    openIdx={openIdx}
                    handleToggle={handleToggle}
                    activeGroup={activeGroup}
                    icon={group.icon}
                />
            </div>
        </section>
    );
}
