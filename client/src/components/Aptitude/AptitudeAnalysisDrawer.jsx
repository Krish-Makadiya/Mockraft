import { Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = 20;

const AptitudeAnalysisDrawer = ({ currentQuestions, isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    return (
        <div
            className={`fixed inset-0 overflow-hidden z-10 ${
                !isOpen ? "pointer-events-none" : ""
            }`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-light-secondary-text/90 dark:bg-gray-500/90 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div
                    className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    {/* Close button */}
                    <div
                        className={`absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4 ${
                            !isOpen ? "hidden" : ""
                        }`}>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="relative rounded-md text-light-fail hover:text-light-fail-hover dark:text-dark-fail dark:hover:text-dark-fail-hover focus:outline-none">
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-8 w-8" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        className="flex h-full flex-col overflow-y-auto bg-light-bg dark:bg-dark-bg shadow-xl custom-scrollbar"
                        style={{
                            "--scrollbar-thumb": "var(--light-surface)",
                            "--scrollbar-thumb-hover": "var(--light-primary)",
                        }}>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text pr-8">
                                    Demo Aptitude Test
                                </h2>
                                <Star
                                    size={25}
                                    className="text-yellow-500 dark:text-yellow-400 cursor-pointer transition-all duration-200"
                                />
                            </div>

                            {/* Question Navigation Blocks */}
                            <div className="mt-6 mb-8">
                                <h4 className="text-sm font-semibold mb-2 text-light-primary-text dark:text-dark-primary-text">
                                    Answers
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentQuestions.map((ques, idx) => {
                                        const isCorrect =
                                            ques.userAnswer === ques.ans;
                                        const isAttempted = !!ques.userAnswer;
                                        return (
                                            <button
                                                key={idx}
                                                className={`w-18 h-18 rounded flex items-center justify-center font-bold text-lg border transition-colors
                                                    ${
                                                        isCorrect
                                                            ? "bg-green-500 text-white border-green-600"
                                                            : "bg-red-500 text-white border-red-600"
                                                    }
                                                    hover:scale-110 focus:outline-none`}
                                                title={`Go to question ${
                                                    idx + 1
                                                }`}>
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AptitudeAnalysisDrawer;
