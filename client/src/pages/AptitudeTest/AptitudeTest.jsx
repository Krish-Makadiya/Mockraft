import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, increment, updateDoc, setDoc, doc as firestoreDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Loader from "../../components/main/Loader";
import AptitudeDrawer from "../../components/Aptitude/AptitudeDrawer";
import { Check, Info, Trash } from "lucide-react";

function Timer({ initialSeconds, onTimeUp }) {
    const [display, setDisplay] = useState(initialSeconds);
    const timerRef = useRef();

    useEffect(() => {
        setDisplay(initialSeconds); // Only on mount
        timerRef.current = initialSeconds;
        const interval = setInterval(() => {
            timerRef.current -= 1;
            setDisplay(timerRef.current);
            if (timerRef.current <= 0) {
                clearInterval(interval);
                if (onTimeUp) onTimeUp();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []); // <--- Only run on mount

    const minutes = Math.floor(display / 60);
    const seconds = display % 60;

    return (
        <span className="font-mono">
            {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
    );
}

const AptitudeTest = () => {
    const { user_id, testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const initialDurationRef = useRef(0);
    const [isOpen, setIsOpen] = useState(true);
    const [isCompleted, setIsCompleted] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            try {
                console.log(testId);
                const testRef = doc(
                    db,
                    `users/${user_id}/aptitude-test`,
                    testId
                );
                const testSnap = await getDoc(testRef);
                if (!testSnap.exists()) {
                    setTest(null);
                    setLoading(false);
                    return;
                }
                const data = testSnap.data();
                setTest(data.questions);
                setIsCompleted(data.isCompleted);
                setAnswers(Array(data.questions.length).fill(""));
                const duration =
                    data.config?.testDuration || data.questions.length;
                initialDurationRef.current = duration * 60; // Store in ref
            } catch (err) {
                setTest(null);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [user_id, testId]);

    if (loading) return <Loader />;
    if (!test)
        return (
            <div className="text-center py-10 text-gray-400">
                Test not found.
            </div>
        );

    const handleSaveAnswer = (idx, value) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[idx] = value;
            return updated;
        });
    };

    const handleClearAnswer = (idx) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[idx] = "";
            return updated;
        });
    };


const handleSubmit = async () => {
    setSubmitted(true);

    // 1. Map answers to questions
    const results = test.map((q, idx) => ({
        ...q,
        userAnswer: answers[idx] || "",
    }));

    // 2. Calculate correct answers
    const correctAnswers = results.filter(q => q.userAnswer === q.ans).length;
    console.log(correctAnswers);

    try {
        // 3. Update the test document
        const testRef = doc(db, "users", user_id, "aptitude-test", testId);
        await updateDoc(testRef, {
            questions: results,
            isCompleted: true,
            submittedAt: new Date().toISOString(),
            point: correctAnswers,
        });

        // 3.1. Mark each question as completed in aptitude-questions ONLY if correct
        for (let i = 0; i < results.length; i++) {
            const q = results[i];
            if (q.userAnswer === q.ans) {
                const qRef = firestoreDoc(db, `users/${user_id}/aptitude-questions/${q.id}`);
                await setDoc(qRef, {
                    correct: true,
                    completed: true,
                    userAnswer: q.userAnswer,
                    questionId: q.id,
                }, { merge: true });
            }
        }

        // 4. Increment user's total points
        const userRef = doc(db, "users", user_id);
        await updateDoc(userRef, {
            points: increment(correctAnswers),
        });
    } catch (error) {
        console.error("Error updating test or user points:", error);
    }

    // 5. Navigate to /aptitude
    navigate("/aptitude");
};

    return (
        <div className="w-full h-full">
            <div className="max-w-5xl mx-auto px-2 md:px-0">
                {/* Timer and progress */}
                <div className="sticky top-0 bg-light-bg dark:bg-dark-bg z-10 flex p-4 items-center justify-between mb-6">
                    <div className="text-lg font-semibold">
                        Time Left:{" "}
                        <Timer
                            initialSeconds={initialDurationRef.current}
                            onTimeUp={handleSubmit}
                        />
                    </div>
                    <div>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <Info />
                        </button>
                    </div>
                </div>
                {/* Questions List */}
                <div className="flex max-w-4xl mx-auto flex-col gap-8">
                    {test.map((q, idx) => (
                        <div
                            key={q.id || idx}
                            id={q.id}
                            className="p-4 rounded-lg border bg-white dark:bg-dark-bg border-light-surface dark:border-dark-surface shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div className="flex items-center w-[80%] gap-2">
                                    <span className="text-xs self-baseline font-semibold text-white bg-dark-primary p-2 rounded-md flex items-center gap-2">
                                        Q{idx + 1}.
                                    </span>
                                    <span className="font-medium text-base ml-1">
                                        {q.ques}
                                    </span>
                                </div>
                                <span className="text-[12px] bg-dark-surface/60 self-baseline rounded-sm px-2 py-1">
                                    {q.type}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 mt-2 ml-10 ">
                                {q.options &&
                                    q.options.map((opt, oidx) => (
                                        <label
                                            key={oidx}
                                            className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`q${idx}`}
                                                value={opt}
                                                checked={answers[idx] === opt}
                                                onChange={() =>
                                                    handleSaveAnswer(idx, opt)
                                                }
                                                disabled={submitted}
                                                className="accent-light-secondary dark:accent-dark-secondary"
                                            />
                                            <span className="text-sm">
                                                {opt}
                                            </span>
                                        </label>
                                    ))}
                                <div className="flex justify-end w-full gap-2">
                                    <button
                                        type="button"
                                        className="mt-1 p-1 rounded-md dark:disabled:bg-dark-surface disabled:bg-light-bg disabled:text-gray-500 bg-light-bg dark:bg-dark-surface text-xs text-black/50 dark:text-white/60 hover:bg-light-bg/60 dark:hover:bg-dark-surface/60 cursor-pointer  border border-gray-200 dark:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        onClick={() =>
                                            handleClearAnswer(idx, "")
                                        }
                                        disabled={submitted || !answers[idx]}>
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination and submit */}
                <div className="flex items-center justify-center py-8 gap-4">
                    {submitted ? (
                        <div className="text-green-600 dark:text-green-400 font-semibold">
                            Test submitted! (Analysis coming soon)
                        </div>
                    ) : (
                        <button
                            className="px-4 py-2 rounded bg-green-600 text-sm text-white font-semibold hover:bg-green-700"
                            onClick={handleSubmit}>
                            Submit Test
                        </button>
                    )}
                </div>
                <AptitudeDrawer
                    currentQuestions={test}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </div>
        </div>
    );
};

export default AptitudeTest;
