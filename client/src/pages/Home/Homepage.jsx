import Navbar from "../../components/main/Navbar";
import LandingPage from "../../components/Homepage/LandingPage";
import FeatureSection from "../../components/Homepage/FeatureSection";
import WhyChooseUsSection from "../../components/Homepage/WhyChooseUsSection";
import HowItWorksSection from "../../components/Homepage/HowItWorksSection";
import Pricing from "../../components/Homepage/Pricing";
import FAQSection from "../../components/Homepage/FAQSection";
import CTASection from "../../components/Homepage/CTASection";
import Footer from "../../components/main/Footer";
import LightGradient from "../../config/HomepageGradient/LightGradient";
import DarkGradient from "../../config/HomepageGradient/DarkGradient";
import { useTheme } from "../../context/ThemeProvider";

const Homepage = () => {
    const { theme } = useTheme();

    return (
        <div className="relative min-h-screen bg-light-bg dark:bg-dark-bg w-full text-gray-900 dark:text-gray-100">
            <div className="sticky top-0 z-0">
                {/* {theme ? (
                    <DarkGradient className="absolute inset-0 w-full h-full" />
                ) : (
                    <LightGradient className="absolute inset-0 w-full h-full" />
                )} */}
                <div className="relative z-10">
                    <Navbar />
                    <LandingPage />
                </div>
            </div>

            <FeatureSection />
            <WhyChooseUsSection />
            <HowItWorksSection />
            <Pricing />
            <FAQSection />
            <CTASection />

            <Footer />
        </div>
    );
};

export default Homepage;