import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

const CallContent = ({ apiKey, assistantId }) => {
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    useEffect(() => {
        const vapiInstance = new Vapi(apiKey);
        setVapi(vapiInstance);
        // Event listeners
        vapiInstance.on("call-start", () => {
            console.log("Call started");
            setIsConnected(true);
        });
        vapiInstance.on("call-end", () => {
            console.log("Call ended");
            setIsConnected(false);
            setIsSpeaking(false);
        });
        vapiInstance.on("speech-start", () => {
            console.log("Assistant started speaking");
            setIsSpeaking(true);
        });
        vapiInstance.on("speech-end", () => {
            console.log("Assistant stopped speaking");
            setIsSpeaking(false);
        });
        vapiInstance.on("message", (message) => {
            if (message.type === "transcript") {
                if (
                    message.type === "transcript" &&
                    message.transcriptType == "final"
                ) {
                    setTranscript((prev) => [
                        ...prev,
                        {
                            role: message.role,
                            text: message.transcript,
                        },
                    ]);
                }
            }
        });
        vapiInstance.on("error", (error) => {
            console.error("Vapi error:", error);
        });
        return () => {
            vapiInstance?.stop();
        };
    }, [apiKey]);

    const startCall = () => {
        if (vapi) {
            vapi.start(assistantId);
        }
    };
    const endCall = () => {
        if (vapi) {
            vapi.stop();
            setTranscript([]);
        }
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

                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                    ⚠️ <strong>Note:</strong> This is an AI-powered assistant.
                    While it’s helpful for most queries, it may occasionally
                    give incorrect or incomplete answers. For urgent or
                    sensitive matters, please use our official contact channels
                    below.
                </div>

                {/* Call Interface */}
                <div className="bg-light-bg dark:bg-dark-bg rounded-lg flex justify-center shadow-lg p-6 mb-8">
                    {!isConnected ? (
                        <button
                            onClick={startCall}
                            style={{
                                background: "#12A594",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50px",
                                padding: "16px 24px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(18, 165, 148, 0.3)",
                                transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(18, 165, 148, 0.4)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(18, 165, 148, 0.3)";
                            }}>
                            🎤 Talk to Assistant
                        </button>
                    ) : (
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "12px",
                                padding: "20px",
                                width: "320px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                                border: "1px solid #e1e5e9",
                            }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "16px",
                                }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                    }}>
                                    <div
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            background: isSpeaking
                                                ? "#ff4444"
                                                : "#12A594",
                                            animation: isSpeaking
                                                ? "pulse 1s infinite"
                                                : "none",
                                        }}></div>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color: "#333",
                                        }}>
                                        {isSpeaking
                                            ? "Assistant Speaking..."
                                            : "Listening..."}
                                    </span>
                                </div>
                                <button
                                    onClick={endCall}
                                    style={{
                                        background: "#ff4444",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "6px 12px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                    }}>
                                    End Call
                                </button>
                            </div>

                            <div
                                ref={scrollRef}
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    marginBottom: "12px",
                                    padding: "8px",
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                }}>
                                {transcript.length === 0 ? (
                                    <p
                                        style={{
                                            color: "#666",
                                            fontSize: "14px",
                                            margin: 0,
                                        }}>
                                        Conversation will appear here...
                                    </p>
                                ) : (
                                    transcript.map((msg, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                marginBottom: "8px",
                                                textAlign:
                                                    msg.role === "user"
                                                        ? "right"
                                                        : "left",
                                            }}>
                                            <span
                                                style={{
                                                    background:
                                                        msg.role === "user"
                                                            ? "#12A594"
                                                            : "#333",
                                                    color: "#fff",
                                                    padding: "8px 12px",
                                                    borderRadius: "12px",
                                                    display: "inline-block",
                                                    fontSize: "14px",
                                                    maxWidth: "80%",
                                                }}>
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
                <div className="bg-light-bg dark:bg-dark-bg rounded-lg shadow-md p-6">
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
