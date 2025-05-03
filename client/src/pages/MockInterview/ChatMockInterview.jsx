/**
 * ChatMockInterview Component
 * 
 * A comprehensive interview interface that:
 * - Loads and displays interview questions
 * - Handles user answers and analysis
 * - Manages question navigation
 * - Provides real-time AI feedback
 * - Persists interview progress
 */

// Import necessary dependencies
import { useUser } from "@clerk/clerk-react";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import axios from "axios";
import {
    Briefcase,
    Calendar,
    ChevronRight,
    Code,
    Code2,
    Gauge,
    HardHat,
    Info,
    Layers,
    Moon,
    Sparkles,
    Star,
    Sun,
    User,
    Users,
    WandSparkles,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loader from "../../components/main/Loader";
import { db } from "../../config/firebase";
import { useTheme } from "../../context/ThemeProvider";

/**
 * Drawer Component
 * Displays interview details and settings in a slide-out panel
 * 
 * @param {Object} interviewDetails - Contains interview configuration and metadata
 * @param {boolean} isInfoOpen - Controls drawer visibility
 * @param {Function} setIsInfoOpen - Toggle drawer state
 */
const Drawer = ({ interviewDetails, isInfoOpen, setIsInfoOpen }) => {
    const [isBookmarked, setIsBookmarked] = useState(
        interviewDetails.isBookmarked
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useUser();

    // if (!isInfoOpen) return null;

    const bookmarkHandler = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);
            const interviewRef = doc(
                db,
                `users/${user.id}/mock-interviews`,
                interviewDetails.id
            );

            await updateDoc(interviewRef, {
                isBookmarked: !isBookmarked,
            });
            setIsBookmarked(!isBookmarked);

            toast.success(
                !isBookmarked ? "Added to favorites" : "Removed from favorites"
            );
        } catch (error) {
            console.error("Error updating bookmark:", error);
            toast.error("Failed to update bookmark. Please try again.");

            setIsBookmarked(isBookmarked);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 overflow-hidden z-10 ${
                !isInfoOpen && "pointer-events-none"
            }`}>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-light-secondary-text/50 dark:bg-gray-500/50 transition-opacity duration-300 ${
                    isInfoOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsInfoOpen(false)}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div
                    className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
                        isInfoOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    {/* Close button */}
                    <div
                        className={`absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4 ${
                            !isInfoOpen && "hidden"
                        }`}>
                        <button
                            type="button"
                            onClick={() => setIsInfoOpen(false)}
                            className="relative rounded-md text-light-fail hover:text-light-fail-hover dark:text-dark-fail dark:hover:text-dark-fail-hover focus:outline-none">
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <X className="h-8 w-8" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex h-full flex-col overflow-y-auto bg-light-bg dark:bg-dark-bg shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-light-primary-text dark:text-dark-primary-text">
                                    {interviewDetails.interviewName}
                                </h2>

                                <Star
                                    onClick={bookmarkHandler}
                                    size={25}
                                    className={`text-yellow-500 dark:text-yellow-400 cursor-pointer transition-all duration-200 ${
                                        isUpdating
                                            ? "opacity-50"
                                            : "hover:scale-110"
                                    } ${
                                        isBookmarked &&
                                        "fill-yellow-500 dark:fill-yellow-400 opacity-100"
                                    }`}
                                />
                            </div>

                            <div className="mt-8 space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Briefcase className="h-5 w-5 mr-2 text-light-primary dark:text-dark-primary" />
                                        Position Details
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Experience Level
                                            </p>
                                            <p className="mt-1 text-sm  capitalize">
                                                {interviewDetails.experienceLevel.toLowerCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Primary Language
                                            </p>
                                            <p className="mt-1 text-sm  capitalize">
                                                {
                                                    interviewDetails.programmingLanguage
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Technology Stack
                                            </p>
                                            <p className="mt-1 text-sm capitalize">
                                                {
                                                    interviewDetails.technologyStack
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-light-secondary-text dark:text-dark-primary-text/80">
                                                Created On
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {interviewDetails.createdAt
                                                    ?.seconds
                                                    ? new Date(
                                                          interviewDetails
                                                              .createdAt
                                                              .seconds * 1000
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : "recently"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-light-surface dark:border-dark-surface my-6" />

                                {/* Job Description */}
                                <div>
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Gauge className="h-5 w-5 mr-2 text-green-500" />
                                        Job Description
                                    </h3>
                                    <p className="mt-2 text-sm text-light-secondary-text dark:text-dark-secondary-text/80  whitespace-pre-line">
                                        {interviewDetails.jobDescription}
                                    </p>
                                </div>

                                <div className="border-t border-light-surface dark:border-dark-surface my-6" />

                                {/* Notifications */}
                                <div>
                                    <h3 className="text-lg font-medium text-light-primary-text dark:text-dark-primary-text flex items-center">
                                        <Layers className="h-5 w-5 mr-2 text-purple-500" />
                                        Notification Settings
                                    </h3>
                                    <div className="mt-4 space-y-3">
                                        <NotificationItem
                                            icon={<User className="h-4 w-4" />}
                                            label="Candidates"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.candidates
                                            }
                                        />
                                        <NotificationItem
                                            icon={<Code className="h-4 w-4" />}
                                            label="Comments"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.comments
                                            }
                                        />
                                        <NotificationItem
                                            icon={
                                                <Calendar className="h-4 w-4" />
                                            }
                                            label="Offers"
                                            enabled={
                                                interviewDetails.notifications
                                                    ?.offers
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * NotificationItem Component
 * Renders individual notification settings with icons and status
 * 
 * @param {ReactNode} icon - Icon component to display
 * @param {string} label - Notification category name
 * @param {boolean} enabled - Current notification state
 */
const NotificationItem = ({ icon, label, enabled }) => (
    <div className="flex items-center">
        <span
            className={`h-4 w-4 mr-2 ${
                enabled
                    ? "text-light-success dark:text-dark-success"
                    : "text-light-secondary-text dark:text-dark-secondary-text"
            }`}>
            {icon}
        </span>
        <span className="text-sm font-medium text-light-primary-text dark:text-dark-primary-text/80">
            {label}
        </span>
        <span className="ml-auto text-sm text-light-secondary-text dark:text-dark-secondary-text/80">
            {enabled ? "Enabled" : "Disabled"}
        </span>
    </div>
);

/**
 * Main ChatMockInterview Component
 * Manages the entire interview process including:
 * - Question generation and management
 * - Answer analysis
 * - Progress tracking
 * - State persistence
 */
const ChatMockInterview = () => {
    // State Management
    const { user_id, id } = useParams();
    
    /**
     * Core States:
     * - currentQuestionIndex: Tracks current question position
     * - answer: Current user's answer
     * - analysis: AI-generated analysis of current answer
     * - questions: Array of all interview questions
     * - analyzedAnswers: Map of analyzed questions and their results
     */
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [analyzedAnswers, setAnalyzedAnswers] = useState({});
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    /**
     * Effect Hooks:
     * 1. Initial data fetch
     * 2. Question generation when interview details load
     * 3. Current question updates
     * 4. Analysis state restoration
     */
    useEffect(() => {
        fetchMockInterviewDetails();
    }, []);

    useEffect(() => {
        if (interviewDetails) {
            generateQuestions(interviewDetails);
        }
    }, [interviewDetails]);

    useEffect(() => {
        if (questions.length > 0) {
            setCurrentQuestion(questions[currentQuestionIndex]);
        }
    }, [questions, currentQuestionIndex]);

    useEffect(() => {
        if (interviewDetails?.questions) {
            const analyzed = {};
            interviewDetails.questions.forEach((question, index) => {
                if (question.isAnalyzed) {
                    analyzed[index] = {
                        answer: question.answer,
                        analysis: question.analysis,
                    };
                }
            });
            setAnalyzedAnswers(analyzed);

            // Set initial question's answer and analysis if available
            if (analyzed[0]) {
                setAnswer(analyzed[0].answer);
                setAnalysis(analyzed[0].analysis);
            }
        }
    }, [interviewDetails]);

    /**
     * Fetches interview details from Firebase
     * Initializes the interview session with metadata
     */
    const fetchMockInterviewDetails = async () => {
        if (!user_id || !id) {
            console.error("Missing userId or interviewId");
            return;
        }

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
                return;
            }

            const interviewData = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
            };

            setInterviewDetails(interviewData);
        } catch (error) {
            console.error("Error fetching interview:", error);
            toast.error(error.message || "Failed to fetch interview details");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Persists generated questions to Firebase
     * Updates interview completion status
     * 
     * @param {Array} questions - Array of generated interview questions
     */
    const addQuestionsToUser = async (questions) => {
        console.log(questions);
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
                console.error("Interview document not found");
                toast.error("Interview not found");
                return;
            }

            // Update the document with questions
            await updateDoc(interviewRef, {
                questions: questions,
                isComplete: true,
                updatedAt: new Date(),
            });

            console.log("Questions added successfully");
            toast.success("Questions generated successfully");
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to save questions");
            throw error;
        }
    };

    /**
     * Generates interview questions using AI
     * Questions are based on job requirements and experience level
     * 
     * @param {Object} interview - Interview configuration details
     */
    const generateQuestions = async (interview) => {
        if (interview.isComplete) {
            setQuestions(interview.questions);
            addQuestionsToUser(interview.questions);
            setCurrentQuestion(interview.questions[0]);
            return;
        }

        try {
            const prompt = `Act as a senior technical interviewer. Generate exactly 10 interview    questions based on these parameters:

- Primary Language: ${interview.programmingLanguage}
- Tech Stack: ${interview.technologyStack}
- Job Description: ${interview.jobDescription}
- Experience Level: ${interview.experienceLevel}

Structure the output as valid JSON with:
- 40% technical questions (language/framework specific)
- 30% system design/scenario questions
- 20% behavioral questions (STAR format)
- 10% curveball/creative thinking questions

Format requirements:
1. Return ONLY the JSON output with no additional text or explanation
2. Questions should progress from easy to hard
3. Each question must include:
   - "type" (technical/system design/behavioral/curveball)
   - "text" (the question itself)
   - "difficulty" (1-5)
   - "ideal_answer_keywords" (array of strings)
   - "rationale" (why this question was chosen)

Example of the exact output format you must use:
{
  "questions": [
    {
      "type": "technical",
      "text": "Explain React's component lifecycle methods",
      "difficulty": 3,
      "ideal_answer_keywords": ["mounting", "updating", "unmounting", "useEffect equivalents"],
      "rationale": "This question tests core React knowledge essential for a mid-level frontend developer."
    }
  ]
            }`;

            const res = await axios.get(
                "http://localhost:4000/ai/generate-questions",
                {
                    params: { prompt },
                }
            );

            const response = res.data;
            const jsonString = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const data = JSON.parse(jsonString);

            if (data && data.questions) {
                setQuestions(data.questions);
                addQuestionsToUser(data.questions);
                setCurrentQuestion(data.questions[0]);
                console.log("Questions loaded:", data.questions);
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            toast.error("Failed to generate interview questions");
        }
    };

    /**
     * Saves answer analysis to Firebase and local state
     * Updates question status and analysis results
     * 
     * @param {Object} analysis - AI-generated analysis results
     */
    const addAnalyzeQuestions = async (analysis) => {
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
                toast.error("Interview not found");
                return;
            }

            const currentQuestions = interviewDoc.data().questions;

            // Update the specific question with analysis
            currentQuestions[currentQuestionIndex] = {
                ...currentQuestions[currentQuestionIndex],
                isAnalyzed: true,
                answer, // Store the user's answer
                analysis: {
                    score: analysis.evaluation.score,
                    improvements: analysis.evaluation.feedback.improvements,
                    strengths: analysis.evaluation.feedback.strengths,
                    suggestions: analysis.evaluation.feedback.suggestions,
                    keywords: analysis.generated_ideal_keywords,
                },
            };

            // Update Firebase
            await updateDoc(interviewRef, {
                questions: currentQuestions,
                updatedAt: new Date(),
            });

            // Update local state
            setAnalyzedAnswers((prev) => ({
                ...prev,
                [currentQuestionIndex]: {
                    answer,
                    analysis: analysis,
                },
            }));

            toast.success("Analysis saved successfully");
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to save analysis");
        }
    };

    /**
     * Handles answer analysis using AI
     * Processes the current answer and updates analysis state
     */
    const handleAnalyze = async () => {
        try {
            setIsAnalysing(true);

            const prompt = `"Analyze this interview Q&A pair and generate both ideal keywords and evaluation in one response. Return strictly in this JSON format:",
    "response_schema": {
            "analysis": {
                "generated_ideal_keywords": {
                "description": "Extract 3-5 most important technical concepts this question should cover",
                "type": "string[]"
            },
            "evaluation": {
                "score": {
                    "description": "0-100 scale (50=minimal pass, 70=good, 90=expert)",
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
    "question": ${currentQuestion.text},
    "candidate_answer": ${answer}
  }
            }`;

            const res = await axios.get(
                "http://localhost:4000/ai/generate-questions",
                {
                    params: { prompt },
                }
            );

            const response = res.data;
            const jsonString = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const data = JSON.parse(jsonString);

            console.log(data.analysis);
            setAnalysis(data.analysis);

            addAnalyzeQuestions(data.analysis);
            setIsAnalysing(false);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Navigation Handlers:
     * Manage question transitions and state updates
     */
    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            const nextAnalyzed = analyzedAnswers[currentQuestionIndex + 1];
            if (nextAnalyzed) {
                setAnswer(nextAnalyzed.answer);
                setAnalysis(nextAnalyzed.analysis);
            } else {
                setAnswer("");
                setAnalysis(null);
            }
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            const prevAnalyzed = analyzedAnswers[currentQuestionIndex - 1];
            if (prevAnalyzed) {
                setAnswer(prevAnalyzed.answer);
                setAnalysis(prevAnalyzed.analysis);
            } else {
                setAnswer("");
                setAnalysis(null);
            }
        }
    };

    /**
     * UI Helper Functions:
     * Generate consistent UI elements
     */
    const getDifficultyStars = (difficulty) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        size={18}
                        className={`${
                            index < difficulty
                                ? "text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400"
                                : "text-gray-400"
                        }`}
                    />
                ))}
            </div>
        );
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "technical":
                return <Code2 className="w-6 h-6 text-blue-500" />;
            case "system":
                return <HardHat className="w-6 h-6 text-green-500" />;
            case "behavioral":
                return <Users className="w-6 h-6 text-purple-500" />;
            default:
                return <Sparkles className="w-6 h-6" />;
        }
    };

    const toggleDrawerHandler = () => {
        setIsInfoOpen(!isInfoOpen);
    };

    // Main render
    if (isLoading || !currentQuestion) {
        return <Loader />;
    }

    return (
        <div className="flex h-screen bg-light-surface dark:bg-dark-surface">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Question area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Question header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex gap-3 items-center">
                                    {getTypeIcon(currentQuestion.type)}
                                    <span className="text-sm font-medium px-2 py-1 bg-light-bg dark:bg-dark-bg rounded-md">
                                        {currentQuestion.type}
                                    </span>
                                    <span className="text-xs text-yellow-500 dark:text-yellow-400">
                                        <span className="flex items-center">
                                            {getDifficultyStars(
                                                currentQuestion.difficulty
                                            )}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {
                                        <Info
                                            onClick={toggleDrawerHandler}
                                            className="h-6 w-6"
                                        />
                                    }
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
                                </div>
                            </div>
                        </div>

                        {/* Question text */}
                        <h2 className="text-xl font-medium mb-6">
                            {currentQuestion.text}
                        </h2>

                        {/* Answer textarea */}
                        <div className="mb-6 relative">
                            <label
                                htmlFor="answer"
                                className="block text-sm text-light-secondary-text dark:text-dark-secondary-text font-medium mb-1">
                                Your Answer
                                {analyzedAnswers[currentQuestionIndex] && (
                                    <span className="ml-2 text-green-500 text-xs">
                                        ✓ Analyzed
                                    </span>
                                )}
                            </label>
                            <textarea
                                id="answer"
                                rows={8}
                                className={`w-full min-h-[80px] max-h-[300px] appearance-none rounded-md ${
                                    analyzedAnswers[currentQuestionIndex]
                                        ? "bg-light-bg/50 dark:bg-dark-bg/50"
                                        : "bg-light-bg dark:bg-dark-bg"
                                } py-2 px-3 text-base outline-1 outline-light-surface dark:outline-dark-surface focus:outline-1 focus:-outline-offset-2 focus:outline-light-primary dark:focus:outline-dark-primary/50 sm:text-sm/6 resize-none`}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                            />
                        </div>

                        {/* Analyze button */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAnalyze}
                                disabled={!answer || isAnalysing}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                    !answer || isAnalysing
                                        ? "bg-light-bg dark:bg-dark-bg/50 cursor-not-allowed"
                                        : "bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover text-white"
                                }`}>
                                {isAnalysing ? (
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
                                                strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <WandSparkles className="w-4 h-4" />
                                        Analyze
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Analysis results */}
                        {analysis && (
                            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4 mb-8">
                                <h3 className="font-medium text-dark-primary mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> Analysis
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-light-primary dark:text-dark-primary">
                                            Score:{" "}
                                        </span>
                                        <span className="font-medium">
                                            {analysis.evaluation.score}/100
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-light-primary dark:text-dark-primary">
                                            Improvements:{" "}
                                        </span>
                                        <p className="text-light-primary-text dark:text-dark-primary-text/60">
                                            {
                                                analysis.evaluation.feedback
                                                    .improvements
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-light-primary dark:text-dark-primary">
                                            Strength:{" "}
                                        </span>
                                        <p className="text-light-primary-text dark:text-dark-primary-text/60">
                                            {
                                                analysis.evaluation.feedback
                                                    .strengths
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-light-primary dark:text-dark-primary">
                                            Suggestions:{" "}
                                        </span>
                                        <p className="text-light-primary-text dark:text-dark-primary-text/60">
                                            {
                                                analysis.evaluation.feedback
                                                    .suggestions
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-light-primary dark:text-dark-primary">
                                            Important Keywords:{" "}
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {analysis.generated_ideal_keywords.map(
                                                (keyword) => (
                                                    <span
                                                        key={keyword}
                                                        className="px-3 py-2 bg-surface-surface dark:bg-dark-surface text-dark-primary text-xs rounded-md">
                                                        {keyword}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Question navigation */}
                        <div className="flex justify-between mt-8 pt-4 border-t border-neitral-500 dark:border-neutral-600">
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                    currentQuestionIndex === 0
                                        ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                                        : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                                }`}>
                                <ChevronRight className="w-4 h-4 transform rotate-180" />
                                Previous
                            </button>
                            <button
                                onClick={nextQuestion}
                                disabled={
                                    currentQuestionIndex ===
                                    questions.length - 1
                                }
                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                    currentQuestionIndex ===
                                    questions.length - 1
                                        ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                                        : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                                }`}>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Progress indicator */}
                <footer className="p-4 bg-light-bg dark:bg-dark-bg">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-light-secondary-text dark:text-dark-secondary-text">
                                Question {currentQuestionIndex + 1} of{" "}
                                {questions.length}
                            </span>
                            <div className="w-1/2 bg-light-surface dark:bg-dark-surface rounded-full h-2">
                                <div
                                    className="bg-light-primary dark:bg-dark-primary h-2 rounded-full"
                                    style={{
                                        width: `${
                                            ((currentQuestionIndex + 1) /
                                                questions.length) *
                                            100
                                        }%`,
                                    }}></div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            <Drawer
                interviewDetails={interviewDetails}
                isInfoOpen={isInfoOpen}
                setIsInfoOpen={setIsInfoOpen}
            />
        </div>
    );
};

export default ChatMockInterview;
