import { useUser } from "@clerk/clerk-react";
import { collection, doc, setDoc } from "firebase/firestore";
import { ChevronDown, CircleArrowLeft, Info } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../../config/firebase";
import { useAlert } from "../../hooks/useAlert";
import Loader from "../../components/main/Loader";

// Example types and subtypes (should be extracted from aptitude.json in real use)
const typeToSubtypes = {
    "Arithmetic Aptitude": [
        "Problem on Trains",
        "Time and Distance",
        "Time and Work",
        "Problems on Ages",
        "Calendar",
        "Clock",
    ],
    "Logical Reasoning": [
        "Series",
        "Analogies",
        "Blood Relations",
        "Directions",
        "Coding-Decoding",
    ],
    "Verbal Ability": [
        "Synonyms",
        "Antonyms",
        "Sentence Correction",
        "Reading Comprehension",
    ],
    "Data Interpretation": [
        "Bar Graphs",
        "Pie Charts",
        "Tables",
        "Line Graphs",
    ],
};
const majorTypes = Object.keys(typeToSubtypes);

const cancleHandler = (e) => {
    e.preventDefault();
    showAlert({
        title: "Wait! You have unsaved work",
        type: "warning",
        onConfirm: () => {
            setIsCreateModalOpen(false);
        },
        message:
            "The interview details you've entered will be permanently deleted if you leave this page.",
        confirmText: "Discard Changes",
        cancelText: "Keep Working",
    });
};

// SubtopicPopdown component
function SubtopicPopdown({ subtopics, selected, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    // Close popdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Remove a subtopic
    const removeSubtopic = (sub) => {
        onChange(selected.filter((s) => s !== sub));
    };

    // Toggle a subtopic
    const toggleSubtopic = (sub) => {
        if (selected.includes(sub)) {
            onChange(selected.filter((s) => s !== sub));
        } else {
            onChange([...selected, sub]);
        }
    };

    selected = Array.isArray(selected) ? selected : [];

    return (
        <div className="relative" ref={ref}>
            <div
                className="w-full flex flex-wrap items-center gap-2 rounded-md bg-light-surface dark:bg-dark-bg border dark:border-neutral-600 border-neutral-300 p-2 text-left text-base outline-none focus:ring-2 focus:ring-light-secondary dark:focus:ring-dark-secondary"
                onClick={() => setOpen((v) => !v)}>
                <div className="flex flex-wrap gap-1 items-center">
                    {selected.slice(0, 3).map((sub) => (
                        <span
                            key={sub}
                            className="flex items-center bg-light-secondary/10 dark:bg-dark-secondary/20 text-light-secondary dark:text-dark-secondary rounded px-2 py-1 text-xs">
                            {sub}
                            <button
                                type="button"
                                className="ml-[6px] text-xs text-light-fail dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSubtopic(sub);
                                }}
                                aria-label={`Remove ${sub}`}>
                                ×
                            </button>
                        </span>
                    ))}
                    {selected.length > 3 && (
                        <span className="text-xs text-gray-500">
                            +{selected.length - 3} more
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`ml-auto size-5 text-gray-400 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </div>
            {open && (
                <div className="absolute z-10 mt-2 w-full min-w-[220px] max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface shadow-lg p-3">
                    <div className="flex flex-col gap-2">
                        {subtopics.map((sub) => (
                            <label
                                key={sub}
                                className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(sub)}
                                    onChange={() => toggleSubtopic(sub)}
                                    className="accent-light-secondary dark:accent-dark-secondary"
                                />
                                <span className="text-sm">{sub}</span>
                            </label>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="mt-3 text-xs text-light-fail dark:text-dark-fail hover:underline"
                        onClick={() => onChange([])}>
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

const AptitudeForm = ({ IsCreateModalOpen, setIsCreateModalOpen }) => {
    const [form, setForm] = useState({
        testName: "",
        majorType: majorTypes, // all selected by default
        subtopic: [],
        numQuestions: "",
    });
    const [questionsPerType, setQuestionsPerType] = useState(() => {
        // Initialize with all major types set to 1
        const obj = {};
        majorTypes.forEach((type) => {
            obj[type] = 1;
        });
        return obj;
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { showAlert, AlertComponent } = useAlert();
    const { user } = useUser();

    const subtopics = useMemo(() => {
        return form.majorType
            .flatMap((type) => typeToSubtypes[type] || [])
            .filter((v, i, arr) => arr.indexOf(v) === i); // unique
    }, [form.majorType, typeToSubtypes]);

    useEffect(() => {
        // When majorType changes, update subtopic to include all subtopics from selected types
        const allSubs = form.majorType
            .flatMap((type) => typeToSubtypes[type] || [])
            .filter((v, i, arr) => arr.indexOf(v) === i); // unique

        const prevSubs = Array.isArray(form.subtopic) ? form.subtopic : [];
        setForm((prev) => ({
            ...prev,
            subtopic: prevSubs.length
                ? prevSubs
                      .filter((s) => allSubs.includes(s))
                      .concat(allSubs.filter((s) => !prevSubs.includes(s)))
                : allSubs,
        }));
        // eslint-disable-next-line
    }, [form.majorType]);

    // Sync questionsPerType with majorType selection
    useEffect(() => {
        setQuestionsPerType((prev) => {
            const updated = { ...prev };
            // Add new types with default 1
            form.majorType.forEach((type) => {
                if (!(type in updated)) updated[type] = 1;
            });
            // Remove types that are no longer selected
            Object.keys(updated).forEach((type) => {
                if (!form.majorType.includes(type)) delete updated[type];
            });
            return updated;
        });
    }, [form.majorType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "majorType") {
            setForm((prev) => ({ ...prev, subtopic: "" }));
        }
    };

    const setAptitudeInfo = async () => {
        setLoading(true);
        try {
            // 1. Fetch questions from aptitude.json
            const res = await fetch("/aptitude.json");
            const data = await res.json();
            const allQuestions = data.questions || [];

            // 2. Filter questions by selected majorType and subtopic
            let selectedQuestions = [];
            form.majorType.forEach((type) => {
                // Get subtopics for this type that are selected
                const subtopicsForType = form.subtopic.filter((sub) => {
                    // Only include subtopics that belong to this type
                    return (typeToSubtypes[type] || []).includes(sub);
                });
                // Filter questions for this type and selected subtopics
                let filtered = allQuestions.filter(
                    (q) =>
                        q.type === type &&
                        q.tier === "free" &&
                        subtopicsForType.includes(q.subtype)
                );
                // Shuffle filtered questions
                filtered = filtered.sort(() => Math.random() - 0.5);
                // Pick the number of questions as per questionsPerType
                selectedQuestions.push(
                    ...filtered.slice(0, questionsPerType[type] || 1)
                );
            });

            // 3. Log selected questions
            console.log("Selected Questions:", selectedQuestions);

            // 4. Save to Firestore at users/{user.id}/aptitude-test
            if (!user?.id) throw new Error("User not found");
            const testDocRef = doc(
                collection(db, `users/${user.id}/aptitude-test`)
            );
            await setDoc(testDocRef, {
                config: {
                    ...form,
                    questionsPerType,
                },
                questions: selectedQuestions,
                createdAt: new Date().toISOString(),
            });
            // Optionally, show a success alert or close modal
            showAlert({
                title: "Test Created!",
                message: "Your aptitude test has been saved.",
                type: "success",
                onConfirm: () => setIsCreateModalOpen(false),
                confirmText: "OK",
            });
        } catch (err) {
            console.error(err);
            showAlert({
                title: "Error",
                message: err.message || "Failed to create test.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted", form);

        showAlert({
            title: "Ready to Practice?",
            message:
                "This will generate a random Aptitude Test based on your provided details.",
            type: "info",
            onConfirm: () => {
                setAptitudeInfo();
            },
            confirmText: "Create Interview",
            cancelText: "Review Details",
        });
    };

    const cancleHandler = (e) => {
        e.preventDefault();
        showAlert({
            title: "Wait! You have unsaved work",
            type: "warning",
            onConfirm: () => {
                setIsCreateModalOpen(false);
            },
            message:
                "The Aptitude details you've entered will be permanently deleted if you leave this page.",
            confirmText: "Discard Changes",
            cancelText: "Keep Working",
        });
    };

    if(loading){
        return <Loader/>
    }

    const totalTime = form.numQuestions * 1;

    return (
        <form
            onSubmit={handleSubmit}
            className="md:w-3/5 w-[90vw] mx-auto rounded-xl">
            <div className="flex items-center md:gap-5 gap-2 md:ml-0 ml-12">
                <CircleArrowLeft
                    onClick={cancleHandler}
                    className="size-8 text-light-fail md:block hidden dark:text-dark-fail hover:text-light-fail-hover dark:hover:text-dark-fail-hover"
                />
                <div>
                    <h2 className="md:text-3xl text-xl font-semibold">
                        Create Aptitude
                    </h2>
                    <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                        This information will be only displayed to you.
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {/* Test Name */}
                <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12 mt-10 flex flex-col">
                    <label
                        htmlFor="testName"
                        className="block text-sm font-medium">
                        Mock-Interview Name
                    </label>

                    <input
                        id="testName"
                        name="testName"
                        type="text"
                        placeholder="Enter the name of the Aptitude"
                        value={form.testName}
                        onChange={handleChange}
                        className="block w-full rounded-md bg-light-surface dark:bg-dark-bg px-3 md:py-2 py-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-light-secondary dark:focus:outline-dark-secondary md:text-base text-sm dark:text-dark-primary-text text-light-primary-text"
                        required
                    />
                    <div className="flex gap-1 mt-1.5 items-center">
                        <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                        <p className="text-xs text-light-secondary dark:text-dark-secondary">
                            It will be displayed on your dashboard profile.
                        </p>
                    </div>
                </div>
                {/* Major Types - Custom Checkbox Group */}
                <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12 flex flex-col gap-8">
                <div>
                        <h2 className="md:text-xl text-[18px] font-semibold">
                            Select Major & Minor Types
                        </h2>
                        <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                            Choose one or more categories to include in your
                            custom aptitude test.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        {Object.keys(typeToSubtypes).map((type) => (
                            <label
                                key={type}
                                className="flex items-center gap-2 cursor-pointer select-none">
                                <div className="group grid size-5 grid-cols-1">
                                    <input
                                        type="checkbox"
                                        value={type}
                                        checked={form.majorType.includes(type)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setForm((prev) => {
                                                let newTypes;
                                                if (checked) {
                                                    newTypes = [
                                                        ...prev.majorType,
                                                        type,
                                                    ];
                                                } else {
                                                    // Prevent removing last major type
                                                    if (
                                                        prev.majorType
                                                            .length === 1
                                                    )
                                                        return prev;
                                                    newTypes =
                                                        prev.majorType.filter(
                                                            (t) => t !== type
                                                        );
                                                }
                                                return {
                                                    ...prev,
                                                    majorType: newTypes,
                                                    subtopic:
                                                        prev.subtopic.filter(
                                                            (s) =>
                                                                newTypes
                                                                    .flatMap(
                                                                        (t) =>
                                                                            typeToSubtypes[
                                                                                t
                                                                            ] ||
                                                                            []
                                                                    )
                                                                    .includes(s)
                                                        ),
                                                };
                                            });
                                        }}
                                        disabled={
                                            form.majorType.length === 1 &&
                                            form.majorType.includes(type)
                                        }
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-light-surface dark:bg-dark-bg checked:border-light-secondary checked:bg-light-secondary indeterminate:border-light-secondary indeterminate:bg-light-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary  "
                                    />
                                    <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-4 self-center justify-self-center stroke-white ">
                                        <path
                                            d="M3 8L6 11L11 3.5"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-checked:opacity-100"
                                        />
                                        <path
                                            d="M3 7H11"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium">
                                    {type}
                                </span>
                            </label>
                            ))}
                </div>
                {/* Subtopic */}
                <div>
                        <label className="block text-base font-medium">
                            Subtopics
                    </label>
                        <SubtopicPopdown
                            subtopics={subtopics}
                            selected={form.subtopic}
                            onChange={(newSubs) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subtopic: newSubs,
                                }))
                            }
                        />
                        <div className="flex gap-1 mt-1 items-center">
                            <Info className="md:size-5 size-4 text-light-secondary dark:text-dark-secondary" />
                            <p className="text-xs text-light-secondary dark:text-dark-secondary">
                                Uncheck any subtopic you want to exclude from
                                your test. You can also remove them from the
                                chips above.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-300 dark:border-neutral-600 pb-12 mt-10 flex flex-col gap-4">
                <div>
                    <h2 className="md:text-xl text-[18px] font-semibold">
                        Test Breakdown
                    </h2>
                    <p className="md:text-sm text-xs text-light-secondary dark:text-dark-secondary">
                        Set the number of questions for each section. Use the
                        quick buttons to set all at once.
                    </p>
                </div>
                <div className="flex gap-4 mb-2 mt-4">
                    {[10, 20, 30].map((val) => (
                        <button
                            key={val}
                            type="button"
                            className="rounded bg-light-secondary dark:bg-dark-secondary text-white px-3 py-1 text-xs font-semibold hover:bg-light-secondary-hover dark:hover:bg-dark-secondary-hover"
                            onClick={() =>
                                setQuestionsPerType((prev) => {
                                    const updated = { ...prev };
                                    form.majorType.forEach((type) => {
                                        updated[type] = val;
                                    });
                                    return updated;
                                })
                            }>
                            Set all to {val}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {form.majorType.map((type) => (
                        <div key={type} className="flex items-center gap-3">
                            <span className="w-40">{type}</span>
                    <input
                        type="number"
                        min={1}
                                max={30}
                                value={questionsPerType[type] || 1}
                                onChange={(e) => {
                                    const val = Math.max(
                                        1,
                                        parseInt(e.target.value, 10) || 1
                                    );
                                    setQuestionsPerType((prev) => ({
                                        ...prev,
                                        [type]: val,
                                    }));
                                }}
                                className="w-20 rounded-md bg-light-bg dark:bg-dark-surface px-2 py-1 border border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-xs text-gray-500">
                                questions
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2 bg-light-secondary/10 dark:bg-dark-secondary/20 rounded px-4 py-2">
                        <span className="font-semibold text-base text-light-secondary dark:text-dark-secondary">
                            Total Questions:
                        </span>
                        <span className="font-bold text-lg text-light-secondary dark:text-dark-secondary">
                            {Object.values(questionsPerType).reduce(
                                (a, b) => a + b,
                                0
                            )}
                        </span>
            </div>
                    <div className="flex items-center gap-2 bg-light-success/10 dark:bg-dark-success/20 rounded px-4 py-2">
                        <span className="font-semibold text-base text-light-success dark:text-dark-success">
                            Total Time:
                </span>
                        <span className="font-bold text-lg text-light-success dark:text-dark-success">
                            {Object.values(questionsPerType).reduce(
                                (a, b) => a + b,
                                0
                            ) * 1}{" "}
                            min
                </span>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={cancleHandler}
                    className="rounded-md bg-light-fail dark:bg-dark-fail px-3 py-2 text-white text-sm font-semibold shadow-xs hover:bg-light-fail-hover dark:hover:bg-dark-fail-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-fail dark:focus-visible:outline-dark-fail">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-light-secondary dark:bg-dark-secondary px-3 py-2 text-sm font-semibold text-white shadow-xs dark:hover:bg-dark-secondary-hover hover:bg-light-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-secondary dark:focus-visible:outline-dark-secondary">
                    Save
                </button>
            </div>
            <AlertComponent />
        </form>
    );
};

export default AptitudeForm;
