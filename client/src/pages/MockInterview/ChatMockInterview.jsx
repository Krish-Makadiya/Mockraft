import { doc, getDoc, updateDoc } from "@firebase/firestore";
import axios from "axios";
import {
    ChevronRight,
    Code2,
    HardHat,
    Info,
    Maximize2,
    Minimize2,
    Moon,
    Sparkles,
    Star,
    Sun,
    Users,
    WandSparkles
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/main/Loader";
import Drawer from "../../components/MockInterview/Drawer";
import { db } from "../../config/firebase";
import { useTheme } from "../../context/ThemeProvider";
import { useAlert } from "../../hooks/useAlert"; // adjust path as needed

const ChatMockInterview = () => {
    const { user_id, id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkInterviewStatus = async () => {
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

                const interviewData = interviewDoc.data();

                if (interviewData.isCompleted) {
                    toast.success("This interview is already completed!");
                    navigate("/dashboard");
                    return;
                }
            } catch (error) {
                console.error("Error checking interview status:", error);
                toast.error("Failed to check interview status");
                navigate("/dashboard");
            }
        };

        if (user_id && id) {
            checkInterviewStatus();
        }
    }, [user_id, id, navigate]);

    return <MockInterviewTest user_id={user_id} id={id} />;
};

const MockInterviewTest = ({ user_id, id }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [analyzedAnswers, setAnalyzedAnswers] = useState({});
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { showAlert, AlertComponent } = useAlert();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user_id || !id) {
            toast.error("Invalid interview URL");
            return;
        }
        fetchMockInterviewDetails();
    }, [user_id, id]);

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
                    // Reconstruct analysis object from stored data
                    const analysisData = {
                        evaluation: {
                            score: question.analysis.score,
                            feedback: {
                                improvements: question.analysis.improvements,
                                strengths: question.analysis.strengths,
                                suggestions: question.analysis.suggestions,
                            },
                        },
                        generated_ideal_keywords: question.analysis.keywords,
                    };

                    analyzed[index] = {
                        answer: question.answer,
                        analysis: analysisData,
                    };
                }
            });

            setAnalyzedAnswers(analyzed);

            // Set initial question's data if it exists
            if (analyzed[currentQuestionIndex]) {
                const currentAnalyzed = analyzed[currentQuestionIndex];
                setAnswer(currentAnalyzed.answer);
                setAnalysis(currentAnalyzed.analysis);
            } else {
                // Reset states if question hasn't been analyzed
                setAnswer("");
                setAnalysis(null);
            }
        }
    }, [interviewDetails, currentQuestionIndex]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    useEffect(() => {
        // Show the rule only once when interview starts
        if (currentQuestionIndex === 0) {
            showAlert({
                title: "Important Analysis Rule",
                message:
                    "You can only analyze each answer ONCE. Make sure your answers are complete before analysis as this action cannot be undone.",
                type: "info",
                onConfirm: () => {},
                onCancel: () => {},
                confirmText: "I Understand",
                cancelText: "Don't Show Again",
            });
        }
    }, []);

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
                updatedAt: new Date(),
            });

            if (!interviewDetails.questions) {
                console.log("Questions added successfully");
                toast.success("Questions generated successfully");
            }
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to save questions");
            throw error;
        }
    };

    const generateQuestions = async (interview) => {
        if (interview.questions) {
            setQuestions(interview.questions);
            addQuestionsToUser(interview.questions);
            setCurrentQuestion(interview.questions[0]);
            if (!document.fullscreenElement) {
                toggleFullscreen();
            }
            return;
        }

        try {
            if (!document.fullscreenElement) {
                toggleFullscreen();
            }
            const prompt = `Act as a senior technical interviewer. Conduct a professional interview using the following parameters:
-Primary Language: ${interview.programmingLanguage}
-Tech Stack: ${interview.technologyStack}
-Job Description: ${interview.jobDescription}
-Experience Level: ${interview.experienceLevel}

Output Requirements:
-Return ONLY a valid JSON object — no additional commentary, explanation, or text.
-Structure the interview as a realistic sequence of 8 questions in the following proportions:
-40% technical questions (specific to language/framework/tools)
-30% system design or applied scenario-based questions (avoid any "draw a diagram" or visual design questions; ask only those that can be answered in text)
-20% behavioral questions (STAR format: Situation, Task, Action, Result)
-10% curveball or creative thinking questions

Each question must include:
-"type" (one of: "technical", "system design", "behavioral", "curveball")
-"text" (the interview question)
-"difficulty" (integer from 1 to 5, increasing in order through the interview)
-"ideal_answer_keywords" (array of keywords expected in a good answer)
-"rationale" (why the question is being asked)

Additional Guidelines:
-Begin the sequence with a professional and conversational opener like “Tell me about yourself, your background, and what led you to apply for this role.”
-Avoid any questions that require drawing, whiteboarding, or designing interfaces/architectures visually. Only include questions that can be answered in text form.
-Ensure question difficulty increases from easy (1) to hard (5) across the 8 questions.
-Make the overall tone and content suitable for a real senior technical interview.`;

            const res = await axios.get(
                "http://localhost:4000/ai/generate-questions",
                {
                    params: { prompt },
                }
            );

            const response = res.data;
            console.log(response);
            const jsonString = response
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const data = JSON.parse(jsonString);
            console.log(data);

            if (data) {
                setQuestions(data);
                addQuestionsToUser(data);
                setCurrentQuestion(data[0]);
                console.log("Questions loaded:", data);
            }
        } catch (error) {
            console.error("Error generating questions:", error);
            toast.error("Failed to generate interview questions");
        }
    };

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

    const onHandlePermission = () => {
        handleAnalyze();
    };

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

    const nextQuestion = () => {
        if (answer && !analyzedAnswers[currentQuestionIndex]) {
            showAlert({
                title: "Analyze Answer First?",
                message:
                    "Moving forward without analysis will permanently lose your answer and feedback opportunity.",
                type: "warning",
                onConfirm: () => {
                    moveToNextQuestion();
                },
                confirmText: "Skip Analysis (Data will be lost)",
                cancelText: "Stay & Analyze",
            });
        } else {
            moveToNextQuestion();
        }
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);

            // Set answer and analysis from analyzedAnswers if available
            if (analyzedAnswers[nextIndex]) {
                setAnswer(analyzedAnswers[nextIndex].answer);
                setAnalysis(analyzedAnswers[nextIndex].analysis);
            } else {
                setAnswer("");
                setAnalysis(null);
            }
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);

            // Set answer and analysis from analyzedAnswers if available
            if (analyzedAnswers[prevIndex]) {
                setAnswer(analyzedAnswers[prevIndex].answer);
                setAnalysis(analyzedAnswers[prevIndex].analysis);
            } else {
                setAnswer("");
                setAnalysis(null);
            }
        }
    };

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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const interviewSubmitHandler = () => {
        const unanalyzedCount = questions.filter(
            (q, idx) => !analyzedAnswers[idx]
        ).length;
        console.log(unanalyzedCount);

        showAlert({
            title: "Submit Interview?",
            message: `
            ${
                unanalyzedCount > 0
                    ? `You have ${unanalyzedCount} unanalyzed answer${
                          unanalyzedCount > 1 ? "s" : ""
                      }. 
                   Submitting now will permanently lose this data and analysis won't be possible later.`
                    : "Are you sure you want to submit this interview? You won't be able to modify your answers after submission."
            }
        `,
            type: "warning",
            onConfirm: async () => {
                try {
                    const interviewRef = doc(
                        db,
                        "users",
                        user_id,
                        "mock-interviews",
                        id
                    );

                    // Update interview status in Firebase
                    await updateDoc(interviewRef, {
                        isCompleted: true,
                        completedAt: new Date(),
                        totalQuestions: questions.length,
                        analyzedQuestions: Object.keys(analyzedAnswers).length,
                    });

                    toast.success("Interview submitted successfully!");
                    document.exitFullscreen();
                    setIsFullscreen(false);
                    navigate(`/dashboard`);
                } catch (error) {
                    console.error("Error submitting interview:", error);
                    toast.error("Failed to submit interview");
                }
            },
            confirmText: "Submit Interview",
            cancelText: "Continue Interview",
        });
    };

    if (isLoading || !currentQuestion) {
        return <Loader />;
    }

    return (
        <div className="flex h-screen select-none bg-light-surface dark:bg-dark-surface">
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
                                    {/* Add this button */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="text-light-primary-text dark:text-dark-primary-text hover:text-light-primary dark:hover:text-dark-primary">
                                        {isFullscreen ? (
                                            <Minimize2 className="h-6 w-6" />
                                        ) : (
                                            <Maximize2 className="h-6 w-6" />
                                        )}
                                    </button>

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
                        </div>

                        {/* Question text */}
                        <div className="flex flex-col gap-1 mb-6 text-sm">
                            <h2 className="text-xl font-medium">
                                {currentQuestion.text}
                            </h2>
                            <p className="text-light-secondary dark:text-dark-secondary">
                                -{currentQuestion.rationale}
                            </p>
                        </div>

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
                                onClick={onHandlePermission}
                                disabled={
                                    !answer ||
                                    isAnalysing ||
                                    analyzedAnswers[currentQuestionIndex]
                                }
                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                    !answer ||
                                    isAnalysing ||
                                    analyzedAnswers[currentQuestionIndex]
                                        ? "bg-light-bg dark:bg-dark-bg/50 cursor-not-allowed"
                                        : "bg-light-primary hover:bg-light-primary-hover dark:bg-dark-primary dark:hover:bg-dark-primary-hover text-white"
                                }`}>
                                {isAnalysing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-1 h-4 w-4 text-light-primary dark:text-dark-primary"
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
                                ) : analyzedAnswers[currentQuestionIndex] ? (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Already Analyzed
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
                                            Important Keywords:{" "}
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {analysis.generated_ideal_keywords.map(
                                                (keyword) => (
                                                    <span
                                                        key={keyword}
                                                        className="px-3 py-2 bg-light-surface dark:bg-dark-surface text-dark-primary text-xs rounded-md">
                                                        {keyword}
                                                    </span>
                                                )
                                            )}
                                        </div>
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
                                            Strengths:{" "}
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

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={interviewSubmitHandler}
                                    className={
                                        "px-4 py-2 rounded-md flex items-center gap-2 text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                                    }>
                                    Submit
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
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
                            )}
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
            <AlertComponent />
        </div>
    );
};

export default ChatMockInterview;
