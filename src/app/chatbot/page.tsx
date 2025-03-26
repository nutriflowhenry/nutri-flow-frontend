
"use client";

import { useState, useEffect, useRef } from "react";
import { ChatCompletionMessage } from "@/types/chat-completion-message.interface"; 
import createChatCompletion from "@/services/createChatCompletion"; 
import Cookies from "js-cookie"; 
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa"; 

export default function Home() {
const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
const [message, setMessage] = useState("");
const [error, setError] = useState<string | null>(null);
const chatEndRef = useRef<HTMLDivElement>(null);

const token = Cookies.get("token");

useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

const handleMessage = async () => {
    if (!message.trim()) return;
    const updatedMessages = [
    ...messages,
    { role: "user", content: message },
    ];
    setMessages(updatedMessages);
    setMessage("");
    setError(null);  

    try {
    const response = await createChatCompletion(updatedMessages, token!);

    if (response) {
        setMessages([...updatedMessages, response]);
    } else {
        setError("No se pudo obtener una respuesta del servidor.");
    }
    } catch (err) {
    setError("Error al contactar con el servidor.");
    console.error(err);
    }
};

return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r  to-gray-900 text-white p-6">
    {!token ? (
        <div className="text-red-500 text-center text-lg font-semibold">Error: No token found.</div>
    ) : (
        <>
        <div className="w-full max-w-2xl h-[75%] bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col overflow-y-auto">
            {messages.map((message, index) => (
            <div 
                key={index} 
                className={`flex items-start gap-3 mb-3 animate-fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
                {message.role === "assistant" && <FaRobot className="text-green-400 text-2xl" />}
                <div 
                className={`p-3 rounded-lg shadow-md max-w-xs ${
                    message.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-green-600 text-white rounded-bl-none"
                }`}
                >
                {message.content}
                </div>
                {message.role === "user" && <FaUser className="text-blue-400 text-2xl" />}
            </div>
            ))}
            <div ref={chatEndRef} />
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="w-full max-w-2xl mt-4 flex items-center">
            <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleMessage()}
            className="flex-1 p-3 rounded-l-lg border-none outline-none focus:ring-4 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400"
            />
            <button
            onClick={handleMessage}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-lg transition-all flex items-center justify-center"
            >
            <FaPaperPlane className="text-white text-xl" />
            </button>
        </div>
        </>
    )}
    </div>
);
}
