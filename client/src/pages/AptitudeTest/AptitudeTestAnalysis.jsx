import { doc, getDoc } from "firebase/firestore";
import {
    Award,
    Check,
    CheckCircle,
    CircleArrowLeft,
    Info,
    Moon,
    Sun,
    Trophy,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AptitudeAnalysisDrawer from "../../components/Aptitude/AptitudeAnalysisDrawer";
import Loader from "../../components/main/Loader";
import { db } from "../../config/firebase"; // adjust path as needed
import { useTheme } from "../../context/ThemeProvider";

const AptitudeTestAnalysis = () => {
    const { user_id, testId } = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            setLoading(true);
            const testRef = doc(db, "users", user_id, "aptitude-test", testId);
            const testSnap = await getDoc(testRef);
            console.log(testSnap.data());
            if (testSnap.exists()) {
                setTest(testSnap.data().questions);
            }
            setLoading(false);
        };
        fetchTest();
    }, [user_id, testId]);

    if (loading) return <Loader />;
    if (!test) return <div>Test not found.</div>;

    const toggleDrawerHandler = () => {
        setIsOpen(!isOpen);
    };

    const cancleHandler = (e) => {
        e.preventDefault();
        navigate("/aptitude");
    };

    const getPerformanceStatus = (score) => {
        if (score >= 90) return { text: "Excellent", color: "text-green-500" };
        if (score >= 70) return { text: "Good", color: "text-blue-500" };
        if (score >= 50) return { text: "Fair", color: "text-yellow-500" };
        return { text: "Needs Improvement", color: "text-red-500" };
    };

    const totalQuestions = test.length;
    const correctAnswers = test.filter((q) => q.userAnswer === q.ans).length;
    const accuracy =
        totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;

    return (
        <div className="w-full h-full">
            <div className="max-w-5xl mx-auto px-2 md:px-0">
                <div className="sticky top-0 bg-light-bg dark:bg-dark-bg flex justify-between items-center py-5">
                    <div className="flex md:gap-5 gap-2 items-center">
                        <CircleArrowLeft
                            onClick={cancleHandler}
                            className="size-8 text-light-fail dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                        />
                        <h1 className="md:text-2xl text-xl font-bold text-light-primary-text dark:text-dark-primary-text">
                            Aptitude Test Analysis
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Average Score
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                                {accuracy}%
                            </div>
                            <div
                                className={`text-sm ${
                                    getPerformanceStatus(accuracy).color
                                }`}>
                                {getPerformanceStatus(accuracy).text}
                            </div>
                        </div>
                    </div>

                    <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-4">
                        <h3 className="text-sm text-light-secondary-text dark:text-dark-secondary-text mb-2">
                            Correct Answers
                        </h3>
                        <div className="text-3xl font-bold text-light-primary dark:text-dark-primary">
                            {correctAnswers} / {totalQuestions}
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
                                {correctAnswers}
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
                <div className="flex max-w-4xl mx-auto flex-col gap-4 py-8">
                    {/* <p>Answers</p> */}
                    {test.map((q, idx) => {
                        const isCorrect = q.userAnswer === q.ans;
                        return (
                            <div
                                key={q.id || idx}
                                className={`p-4 rounded-lg border shadow-sm bg-white dark:bg-dark-bg border-light-surface dark:border-dark-surface`}>
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <div className="flex items-center md:w-[80%] w-full gap-2">
                                        <span
                                            className={`text-xs self-baseline font-semibold text-white p-2 rounded-md flex items-center gap-2 ${
                                                isCorrect
                                                    ? "bg-light-success dark:bg-dark-success"
                                                    : "bg-light-fail dark:bg-dark-fail"
                                            } `}>
                                            Q{idx + 1}.
                                        </span>
                                        <span className="font-medium text-base ml-1">
                                            {q.ques}
                                        </span>
                                    </div>
                                    <span className="text-[12px] md:block hidden bg-light-bg dark:bg-dark-surface/60 self-baseline rounded-sm px-2 py-1">
                                        {q.type}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 mt-2 ml-10">
                                    {q.options &&
                                        q.options.map((opt, oidx) => {
                                            const isUser = q.userAnswer === opt;
                                            const isRight = q.ans === opt;
                                            return (
                                                <div
                                                    key={oidx}
                                                    className={`flex items-center gap-2 rounded px-2 py-1 ${
                                                        isUser
                                                            ? isRight
                                                                ? "dark:bg-dark-success/60 bg-light-success/50"
                                                                : "dark:bg-dark-fail/60 bg-light-fail/50"
                                                            : isRight
                                                            ? "bg-dark-success/60"
                                                            : ""
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name={`q${idx}`}
                                                        value={opt}
                                                        checked={isUser}
                                                        readOnly
                                                        disabled
                                                        className="accent-light-secondary dark:accent-dark-secondary"
                                                    />
                                                    <span className="text-sm">
                                                        {opt}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    <div className="w-full gap-2 mt-3">
                                        {isCorrect ? (
                                            <span className="text-dark-success font-semibold flex items-center">
                                                <Check />
                                                <p>Correct</p>
                                            </span>
                                        ) : (
                                            <span className="text-dark-fail font-semibold flex items-center">
                                                <X />
                                                <p>Wrong</p>
                                            </span>
                                        )}
                                    </div>
                                    {q.explanation && (
                                        <div className="mt-2 text-xs dark:text-white text-black dark:bg-dark-surface bg-light-bg rounded-md px-2 py-3 ">
                                            <b>Explanation:</b> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <AptitudeAnalysisDrawer
                    currentQuestions={test}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </div>
        </div>
    );
};

export default AptitudeTestAnalysis;
