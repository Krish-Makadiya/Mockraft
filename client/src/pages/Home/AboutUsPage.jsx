import React, { useState, useEffect } from "react";
import {
    Target,
    Bot,
    Building2,
    Play,
    ArrowRight,
    Users,
    Award,
    TrendingUp,
    Mic,
    MessageSquare,
    BarChart3,
} from "lucide-react";
import Navbar from "../../components/main/Navbar";

const AboutUsPage = () => {
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        const elements = document.querySelectorAll("[data-animate]");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <section className="min-h-screen py-16 px-4 bg-[var(--color-light-bg)] dark:bg-[var(--color-dark-bg)] text-[var(--color-light-primary-text)] dark:text-[var(--color-dark-primary-text)]">
                <div className="max-w-7xl mx-auto">
                    {/* Increased from max-w-6xl */}
                    {/* Header */}
                    <div
                        id="header"
                        data-animate
                        className={`text-center mb-16 transition-all duration-700 ${
                            isVisible.header
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--color-light-primary)] to-[var(--color-light-secondary)] dark:from-[var(--color-dark-primary)] dark:to-[var(--color-dark-secondary)] bg-clip-text text-transparent">
                            About MockMaster
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                            Revolutionizing placement preparation with
                            personalized mock interviews, AI-powered feedback,
                            and comprehensive aptitude training.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div
                        id="stats"
                        data-animate
                        className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-200 ${
                            isVisible.stats
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        {[
                            {
                                number: "10,000+",
                                label: "Students Placed",
                                icon: <Users className="w-8 h-8" />,
                            },
                            {
                                number: "500+",
                                label: "Company Partners",
                                icon: <Building2 className="w-8 h-8" />,
                            },
                            {
                                number: "95%",
                                label: "Success Rate",
                                icon: <Award className="w-8 h-8" />,
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="text-center bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] p-8 rounded-2xl border border-black/10 dark:border-white/10 hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                                <div className="flex justify-center mb-4 text-[var(--color-light-primary)] dark:text-[var(--color-dark-primary)]">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold mb-2 text-[var(--color-light-primary)] dark:text-[var(--color-dark-primary)]">
                                    {stat.number}
                                </div>
                                <p className="text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div
                        id="mainContent"
                        data-animate
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 transition-all duration-700 delay-300 ${
                            isVisible.mainContent
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">
                                    Personalized Mock Interview Experience
                                </h2>
                                <p className="text-lg mb-6 text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                                    Our AI-powered platform adapts to your
                                    unique profile, providing tailored interview
                                    questions based on your target companies and
                                    roles.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        {
                                            text: "Audio & Text-based interviews",
                                            icon: <Mic className="w-4 h-4" />,
                                        },
                                        {
                                            text: "Real-time feedback & scoring",
                                            icon: (
                                                <BarChart3 className="w-4 h-4" />
                                            ),
                                        },
                                        {
                                            text: "Industry-specific questions",
                                            icon: (
                                                <MessageSquare className="w-4 h-4" />
                                            ),
                                        },
                                    ].map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-light-success)] dark:bg-[var(--color-dark-success)] text-white">
                                                {feature.icon}
                                            </div>
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="px-8 py-4 rounded-xl font-semibold bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)] text-white hover:bg-[var(--color-light-primary-hover)] dark:hover:bg-[var(--color-dark-primary-hover)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-2">
                                <span>Start Mock Interview</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Right Content - Mockup Image */}
                        <div className="bg-gradient-to-br from-[var(--color-light-primary)] to-[var(--color-light-secondary)] dark:from-[var(--color-dark-primary)] dark:to-[var(--color-dark-secondary)] rounded-2xl aspect-video flex items-center justify-center text-white text-2xl font-semibold">
                            <div className="flex items-center space-x-3">
                                <MessageSquare className="w-8 h-8" />
                                <span>Interview Interface</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div
                        id="features"
                        data-animate
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-400 ${
                            isVisible.features
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        {[
                            {
                                icon: <Target className="w-8 h-8" />,
                                title: "Aptitude Training",
                                description:
                                    "Comprehensive aptitude tests covering logical reasoning, quantitative analysis, and verbal ability.",
                                bgColor:
                                    "bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)]",
                            },
                            {
                                icon: <Bot className="w-8 h-8" />,
                                title: "AI-Powered Analysis",
                                description:
                                    "Advanced AI analyzes your responses and provides detailed feedback on communication skills.",
                                bgColor:
                                    "bg-[var(--color-light-secondary)] dark:bg-[var(--color-dark-secondary)]",
                            },
                            {
                                icon: <Building2 className="w-8 h-8" />,
                                title: "Industry Connect",
                                description:
                                    "Direct connections with hiring managers and HR professionals from top companies.",
                                bgColor:
                                    "bg-[var(--color-light-success)] dark:bg-[var(--color-dark-success)]",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-[var(--color-light-surface)] dark:bg-[var(--color-dark-surface)] p-8 rounded-2xl text-center border border-black/10 dark:border-white/10 hover:transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                                <div
                                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white ${feature.bgColor}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Demo Section */}
                    <div
                        id="demo"
                        data-animate
                        className={`bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/20 dark:border-white/10 transition-all duration-700 delay-500 ${
                            isVisible.demo
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="bg-gradient-to-br from-[var(--color-light-primary)] to-[var(--color-light-secondary)] dark:from-[var(--color-dark-primary)] dark:to-[var(--color-dark-secondary)] rounded-2xl aspect-video flex items-center justify-center text-white text-2xl font-semibold">
                                <div className="flex items-center space-x-3">
                                    <Play className="w-8 h-8" />
                                    <span>Demo Video</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-4">
                                    See MockMaster in Action
                                </h3>
                                <p className="mb-6 text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                                    Watch how our platform transforms interview
                                    preparation with personalized questions,
                                    real-time feedback, and comprehensive
                                    analytics.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-3 rounded-lg font-medium bg-[var(--color-light-primary)] dark:bg-[var(--color-dark-primary)] text-white hover:bg-[var(--color-light-primary-hover)] dark:hover:bg-[var(--color-dark-primary-hover)] transition-all duration-300 flex items-center space-x-2">
                                        <Play className="w-4 h-4" />
                                        <span>Watch Demo</span>
                                    </button>
                                    <button className="px-6 py-3 rounded-lg font-medium border-2 border-[var(--color-light-primary)] dark:border-[var(--color-dark-primary)] text-[var(--color-light-primary)] dark:text-[var(--color-dark-primary)] hover:bg-[var(--color-light-primary)] dark:hover:bg-[var(--color-dark-primary)] hover:text-white transition-all duration-300 flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Learn More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div
                        id="cta"
                        data-animate
                        className={`text-center flex flex-col items-center transition-all duration-700 delay-600 ${
                            isVisible.cta
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}>
                        <h3 className="text-3xl font-bold mb-4">
                            Ready to Ace Your Next Interview?
                        </h3>
                        <p className="text-lg mb-8 max-w-2xl mx-auto text-[var(--color-light-secondary-text)] dark:text-[var(--color-dark-secondary-text)]">
                            Join thousands of students who have successfully
                            landed their dream jobs with MockMaster.
                        </p>
                        <button className="px-12 py-4 rounded-xl font-semibold text-xl bg-gradient-to-r from-[var(--color-light-primary)] to-[var(--color-light-secondary)] dark:from-[var(--color-dark-primary)] dark:to-[var(--color-dark-secondary)] text-white hover:transform hover:scale-105 transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2">
                            <span>Get Started Today</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutUsPage;
