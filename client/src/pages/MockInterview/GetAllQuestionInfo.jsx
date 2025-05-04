import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
    Star,
    ChevronUp,
    ChevronDown,
    WandSparkles,
    Info,
    Sun,
    Moon,
    CircleArrowLeft,
} from "lucide-react";
import Loader from "../../components/main/Loader";
import { useTheme } from "../../context/ThemeProvider";
import Drawer from "../../components/MockInterview/Drawer";
import { useAlert } from "../../hooks/useAlert";

const GetAllQuestionInfo = () => {
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [analyzingQuestions, setAnalyzingQuestions] = useState({});
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const { theme, setTheme } = useTheme();
    const { showAlert, AlertComponent } = useAlert();

    const navigate = useNavigate();

    const { user_id, id } = useParams();

    useEffect(() => {
        fetchMockInterviewDetails();
    }, []);

    const fetchMockInterviewDetails = async () => {
        try {
            const interviewRef = doc(
                db,
                "users",
                user_id,
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

            setInterviewDetails(interviewData);
        } catch (error) {
            console.error("Error fetching interview:", error);
            toast.error("Failed to fetch interview details");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAverageScore = () => {
        if (!interviewDetails?.questions) return 0;

        const analyzedQuestions = interviewDetails.questions.filter(
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
        setExpandedQuestions((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const calculateQuestionPoints = (difficulty, score) => {
        const basePoints = difficulty * 20; // Max points possible based on difficulty
        return Math.round((score / 100) * basePoints);
    };

    const handleAnalyzeQuestion = async (question, index) => {
        try {
            setAnalyzingQuestions((prev) => ({
                ...prev,
                [index]: true,
            }));

            const prompt = `"Analyze this interview Q&A pair and generate both ideal keywords and evaluation in one response. Return strictly in this JSON format:",
    "response_schema": {
            "analysis": {
                "generated_ideal_keywords": {
                "description": "Extract 3-5 most important technical concepts this question should cover",
                "type": "string[]"
            },
            "evaluation": {
                "score": {
                    "description": "0-100 scale (50=minimum, 70=good, 100=expert)",
                    "type": "integer"
                },
                "feedback": {
                    "strengths": "string",
                    "improvements": "string",
                    "suggestions": "string"
                },
                "keyword_analysis": {
                    "matched_count": "integer",
                    "missing_keywords": "string[]"
                }
            }
        }
    },
  "processing_steps": [
    "1. First extract core concepts to create ideal_keywords",
    "2. Then evaluate answer against these generated keywords",
    "3. Finally provide comprehensive feedback"
  ],
  "input": {
    "question": ${question.text},
    "candidate_answer": ${question.answer}
  }
            }`;

            const res = await axios.get(
                "http://localhost:4000/ai/generate-questions",
                {
                    params: { prompt },
                }
            );

            const response = res.data;
            const jsonString = response.replace(/```json\n|```/g, "").trim();
            const data = JSON.parse(jsonString);

            if (data?.analysis) {
                // Update Firebase
                const interviewRef = doc(
                    db,
                    "users",
                    user_id,
                    "mock-interviews",
                    id
                );
                const currentQuestions = [...interviewDetails.questions];

                currentQuestions[index] = {
                    ...currentQuestions[index],
                    isAnalyzed: true,
                    analysis: {
                        score: data.analysis.evaluation.score,
                        improvements:
                            data.analysis.evaluation.feedback.improvements,
                        strengths: data.analysis.evaluation.feedback.strengths,
                        suggestions:
                            data.analysis.evaluation.feedback.suggestions,
                        keywords: data.analysis.generated_ideal_keywords,
                    },
                };

                await updateDoc(interviewRef, {
                    questions: currentQuestions,
                    updatedAt: new Date(),
                });

                // Update local state
                setInterviewDetails((prev) => ({
                    ...prev,
                    questions: currentQuestions,
                }));

                toast.success("Analysis completed successfully");
            }
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error("Failed to analyze answer");
        } finally {
            setAnalyzingQuestions((prev) => ({
                ...prev,
                [index]: false,
            }));
        }
    };

    const areAllQuestionsAnalyzed = () => {
        if (!interviewDetails?.questions) return false;
        return interviewDetails.questions.every(
            (question) => question.isAnalyzed
        );
    };

    if (isLoading) return <Loader />;

    const toggleDrawerHandler = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    const cancleHandler = (e) => {
        e.preventDefault();
        navigate("/dashboard")
    };

    return (
        <div className="min-h-screen  select-none bg-light-surface dark:bg-dark-surface p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-5">
                        <CircleArrowLeft
                            onClick={cancleHandler}
                            className="size-8 text-light-fail dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                        />
                        <h1 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Average Score
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                                {calculateAverageScore()}%
                            </div>
                            <div
                                className={`text-sm ${
                                    getPerformanceStatus(
                                        calculateAverageScore()
                                    ).color
                                }`}>
                                {
                                    getPerformanceStatus(
                                        calculateAverageScore()
                                    ).text
                                }
                            </div>
                        </div>
                    </div>

                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Questions Analyzed
                        </h3>
                        <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                            {
                                interviewDetails.questions.filter(
                                    (q) => q.isAnalyzed
                                ).length
                            }{" "}
                            / {interviewDetails.questions.length}
                        </div>
                    </div>

                    {/* Update the status display section */}
                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Interview Status
                        </h3>
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-2 w-2 rounded-full ${
                                    interviewDetails.isCompleted &&
                                    areAllQuestionsAnalyzed()
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                }`}></div>
                            <div className="text-light-primary-text dark:text-dark-primary-text">
                                {interviewDetails.isCompleted &&
                                areAllQuestionsAnalyzed()
                                    ? "Completed"
                                    : "In Progress"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-light-primary-text dark:text-dark-primary-text">
                        Question Analysis
                    </h2>

                    {interviewDetails.questions.map((question, index) => (
                        <div
                            key={index}
                            className="bg-light-bg dark:bg-dark-bg rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
                            <div
                                onClick={() => toggleQuestionExpand(index)}
                                className="cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            {question.isAnalyzed && (
                                                <div className="text-2xl font-bold text-emerald-500">
                                                    {calculateQuestionPoints(
                                                        question.difficulty,
                                                        question.analysis.score
                                                    )}
                                                    <span className="text-xs text-light-secondary-text dark:text-dark-secondary-text">
                                                        /
                                                        {question.difficulty *
                                                            20}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                {[
                                                    ...Array(
                                                        question.difficulty
                                                    ),
                                                ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={`${
                                                            question.isAnalyzed
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`text-sm font-medium px-2 py-1 rounded-full ${
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
                                        {question.isAnalyzed && (
                                            <div
                                                className={`text-sm font-medium px-3 py-1 rounded-full ${
                                                    question.analysis.score >=
                                                    90
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                                        : question.analysis
                                                              .score >= 75
                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                                        : question.analysis
                                                              .score >= 60
                                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                                }`}>
                                                Score: {question.analysis.score}
                                                %
                                            </div>
                                        )}
                                        {expandedQuestions[index] ? (
                                            <ChevronUp className="w-5 h-5 text-light-secondary-text dark:text-dark-secondary-text" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-light-secondary-text dark:text-dark-secondary-text" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text mb-2">
                                    {question.text}
                                </h3>
                            </div>

                            {expandedQuestions[index] && (
                                <div className="mt-4 space-y-4 animate-fadeIn">
                                    {question.isAnalyzed ? (
                                        <>
                                            <div className="bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-light-secondary-text dark:text-dark-secondary-text mb-2">
                                                    Your Answer
                                                </h4>
                                                <p className="text-light-primary-text dark:text-dark-primary-text/80 text-sm">
                                                    {question.answer}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                                                        Strengths
                                                    </h4>
                                                    <p className="text-emerald-600 dark:text-emerald-200/80 text-sm">
                                                        {
                                                            question.analysis
                                                                .strengths
                                                        }
                                                    </p>
                                                </div>
                                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                                                        Improvements
                                                    </h4>
                                                    <p className="text-amber-600 dark:text-amber-200/80 text-sm">
                                                        {
                                                            question.analysis
                                                                .improvements
                                                        }
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                                                        Keywords
                                                    </h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {question.analysis.keywords.map(
                                                            (keyword, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs text-blue-700 dark:text-blue-200">
                                                                    {keyword}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-4 space-y-4">
                                            <div className="bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-light-secondary-text dark:text-dark-secondary-text mb-2">
                                                    Answer
                                                </h4>
                                                <p className="text-light-primary-text dark:text-dark-primary-text/80 text-sm mb-4">
                                                    {question.answer}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        handleAnalyzeQuestion(
                                                            question,
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        analyzingQuestions[
                                                            index
                                                        ]
                                                    }
                                                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                                        analyzingQuestions[
                                                            index
                                                        ]
                                                            ? "bg-light-bg dark:bg-dark-bg/50 cursor-not-allowed"
                                                            : "bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover text-white"
                                                    }`}>
                                                    {analyzingQuestions[
                                                        index
                                                    ] ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24">
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                />
                                                            </svg>
                                                            Analyzing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <WandSparkles className="w-4 h-4" />
                                                            Analyze Answer
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Drawer
                interviewDetails={interviewDetails}
                isInfoOpen={isInfoOpen}
                setIsInfoOpen={setIsInfoOpen}
            />
            <AlertComponent/>
        </div>
    );
};

export default GetAllQuestionInfo;
