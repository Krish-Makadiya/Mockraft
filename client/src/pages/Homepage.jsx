import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    ShieldCheck,
    Users,
    Rocket,
    CheckCircle,
    User,
    DollarSign,
    ChartPie,
    ChevronDown,
    CirclePlay,
    Fingerprint,
    Menu,
    Moon,
    MousePointerClick,
    Phone,
    RefreshCw,
    Sun,
    Grid2x2Plus,
    X,
    Shield,
    Zap,
    PlugZap,
    BrainCircuit,
    Handshake,
    Clock,
    ArrowBigLeft,
    MoveRight,
    MoveRightIcon,
    ArrowRight,
} from "lucide-react";
import { SignUpButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeProvider";
import LightGradient from "../config/LightGradient";
import Pricing from "./Pricing";

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
        icon: <Handshake className="w-9 h-9   text-blue-400 mt-1" />,
        title: "Community Support",
        desc: "Join a vibrant community, share experiences, and get peer feedback.",
    },
];

// Framer Motion variants for staggered animation
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

const products = [
    {
        name: "Analytics",
        description: "Get a better understanding of your traffic",
        href: "#",
        icon: ChartPie,
    },
    {
        name: "Engagement",
        description: "Speak directly to your customers",
        href: "#",
        icon: MousePointerClick,
    },
    {
        name: "Security",
        description: "Your customers’ data will be safe and secure",
        href: "#",
        icon: Fingerprint,
    },
    {
        name: "Integrations",
        description: "Connect with third-party tools",
        href: "#",
        icon: Grid2x2Plus,
    },
    {
        name: "Automations",
        description: "Build strategic funnels that will convert",
        href: "#",
        icon: RefreshCw,
    },
];
const callsToAction = [
    { name: "Watch demo", href: "#", icon: CirclePlay },
    { name: "Contact sales", href: "#", icon: Phone },
];

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
        icon: <CheckCircle className="w-10 h-10 text-light-primary-text" />,
        title: "About Careerly",
        desc: "Careerly empowers job seekers and professionals with a user-friendly platform for interview prep and career growth. We blend technology, expert insights, and community to help you unlock your potential and land your dream job.",
    },
];

// Add these variants above your Homepage component
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
    hidden: { opacity: 0, x: 60, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

// Add this above your Homepage component
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

const Homepage = () => {
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    return (
        <div className="relative min-h-screen bg-light-bg dark:bg-dark-bg w-full text-gray-900 dark:text-gray-100">
            <div className="sticky top-0 z-0">
                <LightGradient
                    className="absolute inset-0 w-full h-full"
                />
                <div className="relative z-10">
                    <header className="relative z-20">
                        <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 lg:px-8 relative z-10">
                            <div className="flex lg:flex-1">
                                <a href="#" className="">
                                    <img
                                        alt=""
                                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                        className="h-8 w-auto"
                                    />
                                </a>
                            </div>
                            <div className="flex lg:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 border-none">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <Menu
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </button>
                            </div>
                            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                                <Popover className="relative">
                                    <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold outline-none cursor-pointer">
                                        Product
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="size-5 flex-none text-light-secondary-text dark:text-dark-secondary-text"
                                        />
                                    </PopoverButton>
                                    <PopoverPanel
                                        transition
                                        className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-light-surface dark:bg-dark-surface shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                                        <div className="p-4">
                                            {products.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-100 dark:hover:bg-dark-bg">
                                                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-bg group-hover:bg-white dark:group-hover:bg-dark-surface">
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className="size-6 text-light-secondary-text group-hover:text-light-primary dark:group-hover:text-dark-primary"
                                                        />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <a
                                                            href={item.href}
                                                            className="block font-semibold border-none">
                                                            {item.name}
                                                            <span className="absolute inset-0" />
                                                        </a>
                                                        <p className="mt-1 text-light-secondary-text dark:text-dark-secondary-text">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 divide-x">
                                            {callsToAction.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold border-none hover:bg-gray-100 dark:hover:bg-dark-bg">
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className="size-5 flex-none text-light-secondary-text dark:text-dark-secondary-text"
                                                    />
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </PopoverPanel>
                                </Popover>
                                <a href="#" className="text-sm/6 font-semibold">
                                    Features
                                </a>
                                <a href="#" className="text-sm/6 font-semibold">
                                    Marketplace
                                </a>
                                <a href="#" className="text-sm/6 font-semibold">
                                    Company
                                </a>
                            </PopoverGroup>
                            <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-8 items-center">
                                {theme ? (
                                    <Sun
                                        onClick={() => setTheme(!theme)}
                                        className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                                    />
                                ) : (
                                    <Moon
                                        onClick={() => setTheme(!theme)}
                                        className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text"
                                    />
                                )}
                                {isSignedIn ? (
                                    <div className="flex gap-3 items-center">
                                        <button
                                            className="text-sm/6 font-semibold"
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }>
                                            Dashboard
                                        </button>
                                        <UserButton />
                                    </div>
                                ) : (
                                    <div className="flex gap-8">
                                        <SignUpButton
                                            className="inline-block rounded-lg px-3 py-2.5 text-sm/6 font-semibold dark:text-light-primary-text text-dark-primary-text bg-light-primary dark:bg-dark-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover focus-visible:outline-offset-2 focus-visible:outline-light-primary"
                                            mode="modal"
                                            navigate="/sign-up">
                                            Login
                                        </SignUpButton>
                                    </div>
                                )}
                            </div>
                        </nav>
                        <Dialog
                            open={mobileMenuOpen}
                            onClose={setMobileMenuOpen}
                            className="lg:hidden">
                            <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-light-bg dark:bg-dark-bg px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                                <div className="flex items-center justify-between">
                                    <a href="#" className="-m-1.5 p-1.5">
                                        <span className="sr-only">
                                            Your Company
                                        </span>
                                        <img
                                            alt=""
                                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                            className="h-8 w-auto"
                                        />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-m-2.5 rounded-md p-2.5 text-light-secondary-text dark:text-dark-secondary-text">
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <X
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </button>
                                </div>
                                <div className="mt-6 flow-root">
                                    <div className="-my-6 divide-y dark:divide-dark-secondary-text/40 divide-light-secondary-text/40">
                                        <div className="space-y-2 py-6">
                                            <Disclosure
                                                as="div"
                                                className="-mx-3">
                                                <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold hover:bg-light-surface dark:hover:bg-dark-surface text-light-primary-text dark:text-dark-primary-text">
                                                    Product
                                                    <ChevronDown
                                                        aria-hidden="true"
                                                        className="size-5 flex-none group-data-open:rotate-180"
                                                    />
                                                </DisclosureButton>
                                                <DisclosurePanel className="mt-2 space-y-2">
                                                    {[
                                                        ...products,
                                                        ...callsToAction,
                                                    ].map((item) => (
                                                        <DisclosureButton
                                                            key={item.name}
                                                            as="a"
                                                            href={item.href}
                                                            className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-light-primary-text dark:text-dark-primary-text font-semibold hover:bg-light-surface dark:hover:bg-dark-surface">
                                                            {item.name}
                                                        </DisclosureButton>
                                                    ))}
                                                </DisclosurePanel>
                                            </Disclosure>
                                            <a
                                                href="#"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                                Features
                                            </a>
                                            <a
                                                href="#"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                                Marketplace
                                            </a>
                                            <a
                                                href="#"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                                Company
                                            </a>
                                        </div>
                                        <div className="py-4">
                                            {isSignedIn ? (
                                                <div className="flex gap-3 items-center flex-column">
                                                    <UserButton />
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                "/dashboard"
                                                            )
                                                        }
                                                        className="text-sm/6 font-semibold text-light-primary-text dark:text-dark-primary-text">
                                                        Dashboard
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-8">
                                                    <SignUpButton
                                                        className="inline-block rounded-lg px-3 py-2.5 text-sm/6 font-semibold dark:text-light-primary-text text-dark-primary-text bg-light-primary dark:bg-dark-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover focus-visible:outline-offset-2 focus-visible:outline-light-primary"
                                                        mode="modal"
                                                        navigate="/sign-up">
                                                        Login
                                                    </SignUpButton>
                                                </div>
                                            )}
                                        </div>
                                        <div className="py-4 flex">
                                            {theme ? (
                                                <div
                                                    className="flex items-center gap-3"
                                                    onClick={() =>
                                                        setTheme(!theme)
                                                    }>
                                                    <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                                        Light Mode
                                                    </p>
                                                    <Sun className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex items-center gap-3"
                                                    onClick={() =>
                                                        setTheme(!theme)
                                                    }>
                                                    <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-light-primary-text dark:text-dark-primary-text hover:bg-light-surface dark:hover:bg-dark-surface">
                                                        Dark Mode
                                                    </p>
                                                    <Moon className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </Dialog>
                    </header>

                    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-24 pb-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="z-10"
                            id="gradient">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                                Practice. Improve. Get Hired. <br /> With
                                Careerly.
                            </h1>
                            <p className="max-w-xl mx-auto text-lg md:text-2xl text-light-primary-text  dark:text-dark-primary-text mb-8">
                                Master interviews, track your growth, and join a
                                winning community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/signup"
                                    className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f4f4f9] to-[#ffffff] dark:from-[#181818] dark:to-[#262626] text-black dark:text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                                    Get Started Free
                                </a>
                            </div>
                        </motion.div>
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-emerald-400/10 rounded-full blur-3xl" />
                        </div>
                    </section>
                </div>
            </div>

            {/* Features Section */}
            <section
                className="
                relative py-20 px-4 md:px-0 flex justify-center items-center
                bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f4f4f9] dark:from-[#262626] dark:via-[#181818] dark:to-[#181818]
                overflow-hidden
              ">
                <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 items-center">
                    {/* Feature List */}
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl md:text-3xl font-bold text-light-primary dark:text-dark-primary mb-2">
                            Features
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-sm md:text-base text-light-secondary-text dark:text-dark-secondary-text mb-8 max-w-lg">
                            A powerful dashboard to help you manage and analyze
                            your interview progress, feedback, and growth—all in
                            one place.
                        </motion.p>
                        <motion.ul
                            variants={featureListVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="space-y-4">
                            {features.map((feature, idx) => (
                                <motion.li
                                    key={idx}
                                    variants={featureItemVariants}
                                    className=""
                                    whileHover={{
                                        scale: 1.01,
                                        boxShadow:
                                            "0 4px 20px rgba(0, 0, 0, 0.1)",
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        },
                                    }}>
                                    <div className="flex items-start gap-4 group p-4 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:shadow-md transition-all">
                                        {feature.icon}
                                        <div>
                                            <span
                                                className={`font-semibold text-light-primary-text dark:text-dark-primary-text transition group-hover:${
                                                    feature.icon.props.className.includes(
                                                        "emerald"
                                                    )
                                                        ? "text-emerald-400"
                                                        : feature.icon.props.className.includes(
                                                              "purple"
                                                          )
                                                        ? "text-purple-400"
                                                        : "text-blue-400"
                                                }`}>
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
                    ">
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

            {/* Why Choose Us Section */}
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
                                Careerly
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
                                {whyChooseUs.slice(0, 2).map((item, idx) => (
                                    <motion.div
                                        key={item.title}
                                        variants={whyChooseItemVariants}
                                        whileHover={{
                                            scale: 1.01,
                                            boxShadow:
                                                "0 8px 32px 0 rgba(0,0,0,0.10)",
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
                            className="bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary rounded-xl p-6 flex flex-col gap-4 shadow-md dark:text-dark-primary-text justify-between transition-all">
                            <div>{whyChooseUs[3].icon}</div>
                            <div>
                                <h3 className="font-semibold text-2xl">
                                    {whyChooseUs[3].title}
                                </h3>
                                <p className="text-blue-100 text-sm mt-3">
                                    {whyChooseUs[3].desc}
                                </p>
                            </div>
                            <motion.a
                                href="/signup"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-4 w-fit bg-gradient-to-br from-light-bg to-light-surface dark:from-dark-bg dark:to-dark-surface font-semibold px-5 py-2 flex gap-2 rounded-full transition">
                                <p>Start Free Trial</p>
                                <ArrowRight />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative w-full py-20 px-4 flex justify-center bg-gray-50 dark:bg-dark-bg overflow-hidden">
                {/* Simple subtle background pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                    {/* Concentric circles top center - blue, lighter to darker, transparent */}
                    <div className="absolute left-1/4 top-0 -translate-x-1/2">
                        <div className="w-96 h-96 rounded-full bg-blue-100/20 dark:bg-blue-900/20 blur-2xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-72 h-72 rounded-full bg-blue-200/50 dark:bg-blue-800/30 blur-sm" />
                            <div className="absolute w-48 h-48 rounded-full bg-blue-300/50 dark:bg-blue-700/40 blur-xs" />
                            <div className="absolute w-28 h-28 rounded-full bg-blue-400/50 dark:bg-blue-600/20" />
                        </div>
                    </div>
                    {/* Concentric circles bottom right - emerald, lighter to darker, transparent */}
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
                        className="text-2xl md:text-3xl font-bold text-center mb-2 text-light-primary-text dark:text-dark-primary-text">
                        How It Works
                    </motion.h2>
                    <p className="text-center text-light-secondary-text dark:text-dark-secondary-text text-sm mb-10 max-w-xl mx-auto">
                        Careerly makes your interview prep journey simple and
                        effective. Here’s how you can get started and grow with
                        us:
                    </p>
                    {/* Timeline */}
                    <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-10 px-2">
                        {/* Line */}
                        <div
                            className="hidden md:block absolute left-0 right-0 top-10 h-[6px] rounded-full bg-light-secondary-text/20 dark:bg-dark-secondary-text/20 opacity-60 z-0"
                            style={{ top: 60 }}
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
                                className="relative z-10 flex flex-col items-center md:w-1/5 w-full">
                                {/* Icon with subtle ring */}
                                <div className="text-xs font-semibold text-light-secondary-text dark:text-dark-secondary-text mb-2">
                                    {step.date}
                                </div>
                                <motion.div
                                    className="relative mb-3 rounded-full"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    }}
                                    whileTap={{ scale: 0.95 }}>
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
                            className="flex items-center gap-2 px-4 py-3 rounded-full bg-light-secondary dark:bg-dark-secondary shadow">
                            <span className="font-semibold text-white text-sm">
                                More features & updates coming soon!
                            </span>
                            <MoveRight className="w-6 h-6 text-white" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <Pricing />

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                    <span>
                        &copy; {new Date().getFullYear()} Careerly. All rights
                        reserved.
                    </span>
                    <a href="/privacy" className="hover:underline mx-2">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="hover:underline mx-2">
                        Terms of Service
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
