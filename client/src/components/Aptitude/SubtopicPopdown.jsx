import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const SubtopicPopdown = ({ subtopics, selected, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

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
