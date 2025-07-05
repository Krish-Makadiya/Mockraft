import { doc, getDoc, updateDoc } from "@firebase/firestore";
import axios from "axios";
import {
    ChevronRight,
    Code2,
    HardHat,
    Info,
    Maximize2,
    Mic,
    MicOff,
    Minimize2,
    Moon,
    Sparkles,
    Star,
    Sun,
    Users,
    WandSparkles,
} from "lucide-react";
import React, { useEffect, useState, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/main/Loader";
import Drawer from "../../components/MockInterview/Drawer";
import { db } from "../../config/firebase";
import { useTheme } from "../../context/ThemeProvider";
import { useAlert } from "../../hooks/useAlert";
import { useUser } from "@clerk/clerk-react";
import useSpeechToText from "react-hook-speech-to-text";
import { motion } from "framer-motion";

const ChatMockInterview = () => {
    const { user_id, id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const checkInterviewStatus = async () => {
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
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    const [interviewState, setInterviewState] = useState({
        currentIndex: 0,
        answers: [],
        questions: [],
        currentQuestion: null,
        isLoading: true,
        details: null,
        isInfoOpen: true,
        isFullscreen: false,
        isAnalysing: false,
        analysis: null,
    });

    const { showAlert, AlertComponent } = useAlert();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (!user_id || !id) {
            toast.error("Invalid interview URL");
            return;
        }
        fetchMockInterviewDetails();
    }, [user_id, id]);

    useEffect(() => {
        if (interviewState.details) {
            generateQuestions(interviewState.details);
        }
    }, [interviewState.details]);

    useEffect(() => {
        if (interviewState.questions.length > 0) {
            setInterviewState((prev) => ({
                ...prev,
                currentQuestion:
                    interviewState.questions[interviewState.currentIndex],
                answer:
                    interviewState.questions[interviewState.currentIndex]
                        ?.answer || "",
            }));
        }
    }, [interviewState.questions, interviewState.currentIndex]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setInterviewState((prev) => ({
                ...prev,
                isFullscreen: !!document.fullscreenElement,
            }));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    const lastProcessedTimestamp = useRef(null);
    useEffect(() => {
        if (results.length === 0) return;

        const last = results[results.length - 1];

        // Avoid processing the same result again
        if (last.timestamp === lastProcessedTimestamp.current) return;

        lastProcessedTimestamp.current = last.timestamp;

        const lastTranscript = last.transcript;

        setInterviewState((prevState) => {
            const updatedAnswers = [...prevState.answers];
            const currentIndex = prevState.currentIndex;

            const existing = updatedAnswers[currentIndex] || "";
            const updatedText = (existing + " " + lastTranscript)
                .trim()
                .slice(0, 500);

            updatedAnswers[currentIndex] = updatedText;

            return {
                ...prevState,
                answers: updatedAnswers,
                answer: updatedText, // 👈 keeps it synced
            };
        });
    }, [results]);

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
                return;
            }

            const interviewData = {
                id: interviewDoc.id,
                ...interviewDoc.data(),
            };
            setInterviewState((prev) => ({
                ...prev,
                details: interviewData,
            }));
        } catch (error) {
            console.error("Error fetching interview:", error);
            toast.error(error.message || "Failed to fetch interview details");
        } finally {
            setInterviewState((prev) => ({
                ...prev,
                isLoading: false,
            }));
        }
    };

    const handleAnswerChange = (e) => {
        const value = e.target.value;
        setInterviewState((prev) => {
            // Update answers array
            const updatedAnswers = [...prev.answers];
            updatedAnswers[prev.currentIndex] = value;

            // Update questions array
            const updatedQuestions = [...prev.questions];
            if (updatedQuestions[prev.currentIndex]) {
                updatedQuestions[prev.currentIndex] = {
                    ...updatedQuestions[prev.currentIndex],
                    answer: value,
                };
            }

            return {
                ...prev,
                answers: updatedAnswers,
                questions: updatedQuestions,
            };
        });
    };

    const addQuestionsToUser = async (questions) => {
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
                console.error("Interview document not found");
                toast.error("Interview not found");
                return;
            }

            await updateDoc(interviewRef, {
                questions: questions,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error("Error updating interview:", error);
            toast.error("Failed to save questions");
            throw error;
        }
    };

    const generateQuestions = async (interview) => {
        if (interview.questions) {
            setInterviewState((prev) => ({
                ...prev,
                questions: interview.questions,
                currentQuestion: interview.questions[0],
            }));
            addQuestionsToUser(interview.questions);
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
-Structure the interview as a realistic sequence of 5 questions in the following proportions:
-40% technical questions (specific to language/framework/tools)
-30% system design or applied scenario-based questions (avoid any "draw a diagram" or visual design questions; ask only those that can be answered in text)
-20% behavioral questions (STAR format: Situation, Task, Action, Result)
-10% curveball or creative thinking questions

Each question must include:
-"type" (one of: "technical", "system design", "behavioral", "curveball")
-"text" (the interview question)
-"difficulty" (integer from 1 to 5, increasing in order through the interview)
-"rationale" (why the question is being asked)

Additional Guidelines:
-Begin the sequence with a professional and conversational opener like "Tell me about yourself, your background, and what led you to apply for this role."
-Avoid any questions that require drawing, whiteboarding, or designing interfaces/architectures visually. Only include questions that can be answered in text form.
-Ensure question difficulty increases from easy (1) to hard (5) across the 8 questions.
-Make the overall tone and content suitable for a real senior technical interview.`;

            await toast.promise(
                (async () => {
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

                    if (data) {
                        setInterviewState((prev) => ({
                            ...prev,
                            questions: data.interview,
                            currentQuestion: data.interview[0],
                        }));
                        addQuestionsToUser(data.interview);
                    }
                })(),
                {
                    loading: "Generating your interview questions...",
                    success: "Interview questions generated successfully!",
                    error: "Failed to generate interview questions",
                }
            );
        } catch (error) {
            console.error("Error generating questions:", error);
            toast.error("Failed to generate interview questions");
        }
    };

    const nextQuestion = () => {
        if (interviewState.currentIndex < interviewState.questions.length - 1) {
            const updatedQuestions = [...interviewState.questions];

            const currentAnswer =
                interviewState.answers[interviewState.currentIndex] ||
                interviewState.answer ||
                "";

            updatedQuestions[interviewState.currentIndex] = {
                ...updatedQuestions[interviewState.currentIndex],
                answer: currentAnswer,
            };

            setInterviewState((prev) => ({
                ...prev,
                questions: updatedQuestions,
                currentIndex: prev.currentIndex + 1,
                currentQuestion: updatedQuestions[prev.currentIndex + 1],
                answer: interviewState.answers[prev.currentIndex + 1] || "", // Use stored answer
            }));
        }
    };

    const prevQuestion = () => {
        if (interviewState.currentIndex > 0) {
            // Update the current question's answer
            const updatedQuestions = [...interviewState.questions];
            updatedQuestions[interviewState.currentIndex] = {
                ...updatedQuestions[interviewState.currentIndex],
                answer: interviewState.answer,
            };
            setInterviewState((prev) => ({
                ...prev,
                questions: updatedQuestions,
                currentIndex: prev.currentIndex - 1,
                currentQuestion: updatedQuestions[prev.currentIndex - 1],
                answer: updatedQuestions[prev.currentIndex - 1]?.answer || "",
            }));
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

    const questionTypeIcons = useMemo(
        () => ({
            technical: <Code2 className="w-6 h-6 text-blue-500" />,
            system_design: <HardHat className="w-6 h-6 text-green-500" />,
            behavioral: <Users className="w-6 h-6 text-purple-500" />,
            default: <Sparkles className="w-6 h-6 text-gray-500" />,
        }),
        []
    ); // Empty dependency array as icons don't change

    const toggleDrawerHandler = () => {
        setInterviewState((prev) => ({
            ...prev,
            isInfoOpen: !prev.isInfoOpen,
        }));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setInterviewState((prev) => ({
                ...prev,
                isFullscreen: true,
            }));
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setInterviewState((prev) => ({
                    ...prev,
                    isFullscreen: false,
                }));
            }
        }
    };

    const interviewSubmitHandler = () => {
        // Update the current question's answer before submitting
        const updatedQuestions = [...interviewState.questions];
        updatedQuestions[interviewState.currentIndex] = {
            ...updatedQuestions[interviewState.currentIndex],
            answer: interviewState.answers[interviewState.currentIndex] || "",
        };
        setInterviewState((prev) => ({
            ...prev,
            questions: updatedQuestions,
        }));

        // Build the answers array for submission
        console.log("updated questions: ", updatedQuestions);
        const questionsWithAnswers = updatedQuestions.map((q, i) => ({
            ...q,
            answer: interviewState.answers[i] || "",
        }));

        showAlert({
            title: "Submit Interview?",
            message:
                "Are you sure you want to submit this interview? You won't be able to modify your answers after submission.",
            type: "warning",
            onConfirm: async () => {
                try {
                    const interviewRef = doc(
                        db,
                        "users",
                        user.id,
                        "mock-interviews",
                        id
                    );

                    // Show promise toast while analyzing
                    await toast.promise(
                        (async () => {
                            // Generate analysis prompt
                            const analysisPrompt = {
                                prompt: "Analyze a full technical interview by evaluating each question-answer pair in parallel. The input consists of two arrays: 'questions' and 'answers', where the index alignment represents the corresponding Q&A pair. For each pair, return a structured evaluation object in the specified format. Return a JSON array, one object per question-answer pair.",
                                input_format: {
                                    questions: updatedQuestions.map(
                                        (q) => q.text
                                    ),
                                    answers: questionsWithAnswers.map(
                                        (q) => q.answer
                                    ),
                                },
                                response_schema_per_pair: {
                                    evaluation: {
                                        score: {
                                            description:
                                                "0-100 scale (10=no answer provided, 50=minimal pass, 70=good, 90=expert)",
                                            type: "integer",
                                        },
                                        feedback: {
                                            strengths: "string",
                                            improvements: "string",
                                            suggestions: "string",
                                        },
                                        keyword_analysis: {
                                            matched_count: "integer",
                                            missing_keywords: "string[]",
                                        },
                                    },
                                },
                            };

                            // Get analysis from AI
                            const analysisRes = await axios.get(
                                "http://localhost:4000/ai/generate-questions",
                                {
                                    params: {
                                        prompt: JSON.stringify(analysisPrompt),
                                    },
                                }
                            );

                            const analysisResponse = analysisRes.data;
                            const analysisJsonString = analysisResponse
                                .replace(/```json/g, "")
                                .replace(/```/g, "")
                                .trim();
                            const analysisData = JSON.parse(analysisJsonString);

                            // Calculate overall score
                            const overallScore =
                                analysisData.reduce(
                                    (acc, curr) => acc + curr.evaluation.score,
                                    0
                                ) / analysisData.length;

                            // Add analysis to each question
                            const questionsWithAnalysis = updatedQuestions.map(
                                (question, index) => ({
                                    ...question,
                                    analysis: analysisData[index].evaluation,
                                })
                            );

                            await updateDoc(interviewRef, {
                                isCompleted: true,
                                completedAt: new Date(),
                                totalQuestions: questionsWithAnswers.length,
                                questions: questionsWithAnalysis,
                                analysis: {
                                    overallScore: Math.round(overallScore),
                                    completedAt: new Date(),
                                },
                            });

                            // --- Add this block to update the user's overall score ---
                            const userRef = doc(db, "users", user.id);
                            const userSnap = await getDoc(userRef);
                            if (userSnap.exists()) {
                                const userData = userSnap.data();
                                const prevScore = userData.points || 0;
                                const newScore =
                                    prevScore + Math.round(overallScore);
                                await updateDoc(userRef, {
                                    points: newScore,
                                });
                            }
                        })(),
                        {
                            loading: "Analyzing your answers...",
                            success:
                                "Interview submitted and analyzed successfully!",
                            error: "Failed to analyze and submit interview.",
                        }
                    );

                    document.exitFullscreen();
                    setInterviewState((prev) => ({
                        ...prev,
                        isFullscreen: false,
                    }));
                    navigate(`/dashboard`);
                } catch (error) {
                    console.error("Error submitting interview:", error);
                    // toast.error is not needed here, handled by toast.promise
                }
            },
            confirmText: "Submit Interview",
            cancelText: "Continue Interview",
        });
    };

    if (interviewState.isLoading || !interviewState.currentQuestion) {
        return <Loader />;
    }

    if (error)
        return <p>Web Speech API is not available in this browser 🤷‍</p>;

    const parentVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
            },
        },
    };
    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 },
        },
    };

    return (
        <div className="flex h-screen  bg-light-surface dark:bg-dark-surface">
            {/* Main Content */}
            <motion.div
                variants={parentVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col overflow-hidden">
                {/* Question area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Question header */}
                        <motion.div variants={childVariants} className="flex items-center justify-between w-full mb-8">
                            <div className="flex md:gap-3 gap-2 items-center">
                                {questionTypeIcons[
                                    interviewState.currentQuestion?.type.replace(
                                        " ",
                                        "_"
                                    )
                                ] || questionTypeIcons.default}
                                <span className="text-sm font-medium px-2 py-1 bg-light-bg dark:bg-dark-bg rounded-md">
                                    {interviewState.currentQuestion?.type}
                                </span>
                                <span className="text-xs text-yellow-500 dark:text-yellow-400">
                                    <span className="flex items-center">
                                        {getDifficultyStars(
                                            interviewState.currentQuestion
                                                .difficulty
                                        )}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleFullscreen}
                                    className="text-light-primary-text dark:text-dark-primary-text hover:text-light-primary dark:hover:text-dark-primary">
                                    {interviewState.isFullscreen ? (
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
                        </motion.div>

                        {/* Question text */}
                        <motion.div variants={childVariants} className="flex flex-col gap-1 mb-6 text-sm">
                            <h2 className="text-xl font-medium">
                                {interviewState.currentQuestion.text}
                            </h2>
                            <p className="text-light-secondary dark:text-dark-secondary text-sm">
                                -{interviewState.currentQuestion.rationale}
                            </p>
                        </motion.div>

                        {/* Answer textarea */}
                        <motion.div variants={childVariants} className="mb-6 relative">
                            <label
                                htmlFor="answer"
                                className="block text-sm text-light-secondary-text dark:text-dark-secondary-text font-medium mb-1">
                                Your Answer
                            </label>
                            <textarea
                                id="answer"
                                rows={8}
                                maxLength={500}
                                className="w-full min-h-[80px] max-h-[300px] rounded-md bg-light-bg dark:bg-dark-bg py-2 px-3 text-base resize-none"
                                value={
                                    (interviewState.answers[
                                        interviewState.currentIndex
                                    ] || "") +
                                    (isRecording && interimResult
                                        ? " " + interimResult
                                        : "")
                                }
                                onChange={handleAnswerChange}
                                placeholder="Type your answer here (max 500 characters)..."
                            />
                            <div className="text-xs text-right mt-1 text-gray-500">
                                {
                                    (
                                        interviewState.answers[
                                            interviewState.currentIndex
                                        ] || ""
                                    ).length
                                }{" "}
                                / 500 characters
                            </div>
                            <button
                                onClick={
                                    isRecording
                                        ? stopSpeechToText
                                        : startSpeechToText
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-white shadow-md 
    ${
        isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
    }
  `}>
                                {isRecording ? (
                                    <>
                                        <Mic className="animate-pulse w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            Recording...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <MicOff className="w-5 h-5 opacity-80" />
                                        <span className="text-sm font-medium">
                                            Start Voice Input
                                        </span>
                                    </>
                                )}
                            </button>
                        </motion.div>

                        {/* Question navigation */}
                        <motion.div variants={childVariants} className="flex justify-between mt-8 pt-4 border-t border-neitral-500 dark:border-neutral-600">
                            <button
                                onClick={prevQuestion}
                                disabled={interviewState.currentIndex === 0}
                                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                    interviewState.currentIndex === 0
                                        ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                                        : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                                }`}>
                                <ChevronRight className="w-4 h-4 transform rotate-180" />
                                Previous
                            </button>

                            {interviewState.currentIndex ===
                            interviewState.questions.length - 1 ? (
                                <button
                                    onClick={interviewSubmitHandler}
                                    className="px-4 py-2 rounded-md flex items-center gap-2 text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text">
                                    Submit
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    disabled={
                                        interviewState.currentIndex ===
                                        interviewState.questions.length - 1
                                    }
                                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                                        interviewState.currentIndex ===
                                        interviewState.questions.length - 1
                                            ? "text-light-secondary-text dark:text-dark-secondary-text cursor-not-allowed"
                                            : "text-light-secondary-text dark:text-dark-secondary-text hover:bg-light-primary dark:hover:bg-dark-primary  hover:text-dark-primary-text"
                                    }`}>
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    </div>
                </main>

                {/* Progress indicator */}
                <footer className="p-4 bg-light-bg dark:bg-dark-bg">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-light-secondary-text dark:text-dark-secondary-text">
                                Question {interviewState.currentIndex + 1} of{" "}
                                {interviewState.questions.length}
                            </span>
                            <div className="w-1/2 bg-light-surface dark:bg-dark-surface rounded-full h-2">
                                <div
                                    className="bg-light-primary dark:bg-dark-primary h-2 rounded-full"
                                    style={{
                                        width: `${
                                            ((interviewState.currentIndex + 1) /
                                                interviewState.questions
                                                    .length) *
                                            100
                                        }%`,
                                    }}></div>
                            </div>
                        </div>
                    </div>
                </footer>
            </motion.div>
            <Drawer
                interviewDetails={interviewState.details}
                isInfoOpen={interviewState.isInfoOpen}
                setIsInfoOpen={(val) =>
                    setInterviewState((prev) => ({
                        ...prev,
                        isInfoOpen: val,
                    }))
                }
            />
            <AlertComponent />
        </div>
    );
};

export default ChatMockInterview;
