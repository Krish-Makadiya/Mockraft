import { doc, getDoc } from "firebase/firestore";
import {
    ChevronDown,
    ChevronUp,
    CircleArrowLeft,
    Info,
    Moon,
    Star,
    Sun,
    Award,
    Trophy,
    CheckCircle,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/main/Loader";
import Drawer from "../../components/MockInterview/Drawer";
import { db } from "../../config/firebase";
import { useTheme } from "../../context/ThemeProvider";
import { useAlert } from "../../hooks/useAlert";
import { useUser } from "@clerk/clerk-react";

const GetAllQuestionInfo = () => {
    const [analysisState, setAnalysisState] = useState({
        questions: [],
        expandedQuestions: {},
        isLoading: true,
        error: null,
        details: null,
        filters: {
            type: "all",
            difficulty: "all",
        },
    });
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const { questions, expandedQuestions, isLoading } = analysisState;

    const { theme, setTheme } = useTheme();
    const { showAlert, AlertComponent } = useAlert();

    const navigate = useNavigate();

    const { user_id, id } = useParams();
    const {user} = useUser();

    useEffect(() => {
        fetchMockInterviewDetails();
    }, []);

    const fetchMockInterviewDetails = async () => {
        try {
            const interviewRef = doc(
                db,
                "users",
                user.id,
                "mock-interviews",
                id
            );
            const interviewDoc = await getDoc(interviewRef);

            if (!interviewDoc.exists()) {
                toast.error("Interview not found!");
                navigate("/dashboard");
                return;
            }

            const interviewData = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
            };

            setAnalysisState((prev) => ({
                ...prev,
                details: interviewData,
                questions: interviewData.questions,
                isLoading: false,
            }));
        } catch (error) {
            console.error("Error fetching interview:", error);
            toast.error("Failed to fetch interview details");
            setAnalysisState((prev) => ({ ...prev, isLoading: false, error }));
        }
    };

    const calculateAverageScore = () => {
        if (!analysisState.details?.questions) return 0;

        const analyzedQuestions = analysisState.details.questions.filter(
            (q) => q.isAnalyzed
        );
        if (analyzedQuestions.length === 0) return 0;

        const totalScore = analyzedQuestions.reduce(
            (sum, q) => sum + q.analysis.score,
            0
        );
        return Math.round(totalScore / analyzedQuestions.length);
    };

    const getPerformanceStatus = (score) => {
        if (score >= 90) return { text: "Excellent", color: "text-green-500" };
        if (score >= 75) return { text: "Good", color: "text-blue-500" };
        if (score >= 60) return { text: "Fair", color: "text-yellow-500" };
        return { text: "Needs Improvement", color: "text-red-500" };
    };

    const toggleQuestionExpand = (index) => {
        setAnalysisState((prev) => ({
            ...prev,
            expandedQuestions: {
                ...prev.expandedQuestions,
                [index]: !prev.expandedQuestions[index],
            },
        }));
    };

    const calculateQuestionPoints = (difficulty, score) => {
        const basePoints = difficulty * 20; // Max points possible based on difficulty
        return Math.round((score / 100) * basePoints);
    };

    const calculatePointsEarned = () => {
        if (!analysisState.details?.questions) return 0;

        // Calculate total score earned
        const totalScoreEarned = analysisState.details.questions.reduce(
            (total, question) => {
                if (question.answer && question.answer.trim() !== "") {
                    return total + question.analysis.score;
                }
                return total;
            },
            0
        );

        // Calculate maximum possible score
        const maxPossibleScore = analysisState.details.questions.length * 100; // Each question can score up to 100

        // Calculate percentage
        const percentage = (totalScoreEarned / maxPossibleScore) * 100;

        return Number(percentage.toFixed(1)); // Return with one decimal place
    };

    if (isLoading) return <Loader />;

    const toggleDrawerHandler = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    const cancleHandler = (e) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen  select-none bg-light-surface dark:bg-dark-surface md:p-6 py-4 px-3 ">
            <div className="max-w-6xl mx-auto md:space-y-6 space-y-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex md:gap-5 gap-2 items-center">
                        <CircleArrowLeft
                            onClick={cancleHandler}
                            className="size-8 text-light-fail dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                        />
                        <h1 className="md:text-2xl text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Mock Interview Analysis
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Info
                            onClick={toggleDrawerHandler}
                            className="h-6 w-6  hover:text-light-primary dark:hover:text-dark-primary"
                        />
                        {theme ? (
                            <Sun
                                onClick={() => setTheme(!theme)}
                                className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text hover:text-light-primary dark:hover:text-dark-primary"
                            />
                        ) : (
                            <Moon
                                onClick={() => setTheme(!theme)}
                                className="h-6 w-6 text-light-primary-text dark:text-dark-primary-text hover:text-light-primary dark:hover:text-dark-primary"
                            />
                        )}
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Average Score
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                                {analysisState.details.analysis.overallScore}%
                            </div>
                            <div
                                className={`text-sm ${
                                    getPerformanceStatus(
                                        analysisState.details.analysis
                                            .overallScore
                                    ).color
                                }`}>
                                {
                                    getPerformanceStatus(
                                        analysisState.details.analysis
                                            .overallScore
                                    ).text
                                }
                            </div>
                        </div>
                    </div>

                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Questions Answered
                        </h3>
                        <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                            {
                                analysisState.details.questions.filter(
                                    (q) => q.answer && q.answer.trim() !== ""
                                ).length
                            }{" "}
                            / {analysisState.details.questions.length}
                        </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-200 dark:from-emerald-900 dark:to-emerald-700 rounded-lg p-4 border-2 border-emerald-200 dark:border-emerald-700 shadow-md transform hover:scale-101 transition-transform duration-200">
                        {/* Award Icon */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
                                Points Earned
                            </h3>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                {analysisState.details.analysis.overallScore}
                            </div>

                            {/* Achievement Badge */}
                            <div className="bg-emerald-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                Earned!
                            </div>
                        </div>

                        {/* Reward message */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4" />
                            Added to your profile
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="md:space-y-4 space-y-3 md:mt-0 mt-5">
                    <h2 className="md:text-xl text-lg font-semibold text-light-primary-text dark:text-dark-primary-text">
                        Question Analysis
                    </h2>

                    {questions.map((question, index) => (
                        <div
                            key={index}
                            className="bg-light-bg dark:bg-dark-bg rounded-lg md:p-4 p-3 transition-all duration-300 hover:shadow-lg">
                            <div
                                onClick={() => toggleQuestionExpand(index)}
                                className="cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <div className="md:text-2xl text-xl font-bold text-emerald-500">
                                                {calculateQuestionPoints(
                                                    question.difficulty,
                                                    question.analysis.score
                                                )}
                                                <span className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                                    /{question.difficulty * 20}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[
                                                    ...Array(
                                                        question.difficulty
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={
                                                            "text-amber-400 fill-amber-400"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`md:text-sm text-xs font-medium px-2 py-1 rounded-full ${
                                                    question.type ===
                                                    "technical"
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                        : question.type ===
                                                          "system"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                                        : question.type ===
                                                          "behavioral"
                                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                }`}>
                                                {question.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`md:text-sm text-xs font-medium px-3 py-1 rounded-full ${
                                                question.analysis.score >= 90
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                                    : question.analysis.score >=
                                                      75
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                    : question.analysis.score >=
                                                      60
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                            }`}>
                                            Score: {question.analysis.score}%
                                        </div>
                                        {expandedQuestions[index] ? (
                                            <ChevronUp className="w-5 h-5 text-light-secondary-text dark:text-dark-secondary-text" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-light-secondary-text dark:text-dark-secondary-text" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="md:text-lg text-sm font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    {question.text}
                                </h3>
                            </div>

                            {expandedQuestions[index] && (
                                <div className="mt-4 space-y-4 animate-fadeIn">
                                    <>
                                        <div className="bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg p-3 md:p-4">
                                            <h4 className="md:text-sm text-xs font-medium text-light-secondary-text dark:text-dark-secondary-text mb-2">
                                                Your Answer
                                            </h4>
                                            <p className="text-light-primary-text dark:text-dark-primary-text/80 text-sm">
                                                {question.answer ? (
                                                    question.answer
                                                ) : (
                                                    <p className="text-red-500 dark:text-red-400">
                                                        No answer provided
                                                    </p>
                                                )}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-2">
                                            <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded-lg p-3 md:p-4">
                                                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    Strengths
                                                </h4>
                                                <p className="text-emerald-600 dark:text-emerald-200/80 text-sm">
                                                    {
                                                        question.analysis
                                                            .feedback.strengths
                                                    }
                                                </p>
                                            </div>

                                            <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-3 md:p-4">
                                                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                                        />
                                                    </svg>
                                                    Areas for Improvement
                                                </h4>
                                                <p className="text-amber-600 dark:text-amber-200/80 text-sm">
                                                    {
                                                        question.analysis
                                                            .feedback
                                                            .improvements
                                                    }
                                                </p>
                                            </div>

                                            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-3 md:p-4">
                                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                        />
                                                    </svg>
                                                    Key Concepts
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {question.analysis.keyword_analysis.missing_keywords.map(
                                                        (keyword, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs text-blue-700 dark:text-blue-200">
                                                                {keyword}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg p-3 md:p-4">
                                                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    Suggestions for Improvement
                                                </h4>
                                                <p className="text-purple-600 dark:text-purple-200/80 text-sm">
                                                    {
                                                        question.analysis
                                                            .feedback
                                                            .suggestions
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Drawer
                interviewDetails={analysisState.details}
                isInfoOpen={isInfoOpen}
                setIsInfoOpen={setIsInfoOpen}
            />
            <AlertComponent />
        </div>
    );
};

export default GetAllQuestionInfo;
