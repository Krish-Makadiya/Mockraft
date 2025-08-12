import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

const CallContent = ({ apiKey, assistantId }) => {
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);

    useEffect(() => {
        const vapiInstance = new Vapi({ apiKey });
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            console.log("Call started");
            setIsConnected(true);
        });
        vapiInstance.on("call-end", () => {
            console.log("Call ended");
            setIsConnected(false);
            setIsSpeaking(false);
        });
        vapiInstance.on("speech-start", () => setIsSpeaking(true));
        vapiInstance.on("speech-end", () => setIsSpeaking(false));

        vapiInstance.on("message", (message) => {
            if (message.role == "user") {
                console.log(message);
            }
            if (message.type === "transcript" && message.transcriptType == 'final') {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role: message.role,
                        text: message.transcript,
                    },
                ]);
            }
        });

        vapiInstance.on("error", (error) =>
            console.error("Vapi error:", error)
        );

        return () => {
            vapiInstance?.stop();
        };
    }, [apiKey]);

    const startCall = () => {
        if (vapi) vapi.start(assistantId);
    };

    const endCall = () => {
        if (vapi) vapi.stop();
    };

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <div className="">
                <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We’re here to help! You can talk to our AI assistant, or
                    contact us directly through other channels.
                </p>

                {/* AI Assistant Warning */}
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                    ⚠️ <strong>Note:</strong> This is an AI-powered assistant.
                    While it’s helpful for most queries, it may occasionally
                    give incorrect or incomplete answers. For urgent or
                    sensitive matters, please use our official contact channels
                    below.
                </div>

                {/* Call Interface */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    {!isConnected ? (
                        <div className="text-center">
                            <button
                                onClick={startCall}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105">
                                🎤 Talk to Support AI
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            isSpeaking
                                                ? "bg-red-500 animate-pulse"
                                                : "bg-green-500"
                                        }`}></div>
                                    <span className="font-semibold">
                                        {isSpeaking
                                            ? "Assistant Speaking..."
                                            : "Listening..."}
                                    </span>
                                </div>
                                <button
                                    onClick={endCall}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold">
                                    End Call
                                </button>
                            </div>

                            <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-700 rounded-md p-4">
                                {transcript.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        Conversation will appear here...
                                    </p>
                                ) : (
                                    transcript.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`mb-2 ${
                                                msg.role === "user"
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}>
                                            <span
                                                className={`inline-block px-3 py-2 rounded-lg text-sm text-white ${
                                                    msg.role === "user"
                                                        ? "bg-green-600"
                                                        : "bg-gray-800"
                                                }`}>
                                                {msg.text}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Other Contact Details */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">
                        Other Ways to Contact Us
                    </h2>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                            📞 Phone:{" "}
                            <a
                                href="tel:+1800123456"
                                className="text-green-600 font-semibold">
                                +1 800 123 456
                            </a>
                        </li>
                        <li>
                            📧 Email:{" "}
                            <a
                                href="mailto:support@example.com"
                                className="text-green-600 font-semibold">
                                support@example.com
                            </a>
                        </li>
                        <li>💬 Live Chat: Available 9 AM – 6 PM</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CallContent;
