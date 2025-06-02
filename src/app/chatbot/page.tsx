'use client';
import { useState, useEffect, useRef } from "react";
import { ChatCompletionMessage } from "@/types/chat-completion-message.interface";
import createChatCompletion from "@/services/createChatCompletion";
import Cookies from "js-cookie";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";

const imagerobot = 'https://i.imgur.com/3CN3lJG.png';

export default function ChatbotPage() {
    const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4EAE0] to-[#e7e3d8] font-sora">
            {!token ? (
                <div className="flex items-center justify-center h-full">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
                        <h2 className="text-2xl font-bold text-[#5a5f52] mb-4">Acceso no autorizado</h2>
                        <p className="text-gray-700 mb-4">Debes iniciar sesión para usar el chatbot</p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-[#6b8f71] text-white px-6 py-2 rounded-lg hover:bg-[#5a7c62] transition-colors"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
                    {/* Header simplificado */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-[#5a5f52]">NutriBot</h1>
                        <p className="text-[#7A8B5C]">Tu asistente nutricional inteligente</p>
                    </div>

                    {/* Área de chat con robot */}
                    <div className="flex-1 flex bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Panel lateral con robot */}
                        <div className="hidden md:flex flex-col items-center justify-end w-48 bg-[#F4EAE0] p-4">
                            <div className="relative w-full h-64">
                                <img
                                    src={imagerobot}
                                    alt="NutriBot"
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <div className="text-center mt-2">
                                <p className="font-semibold text-[#5a5f52]">NutriBot</p>
                                <p className="text-sm text-[#7A8B5C]">Asistente virtual</p>
                            </div>
                        </div>

                        {/* Conversación */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="relative w-32 h-32 mb-4">
                                        <img
                                            src={imagerobot}
                                            alt="NutriBot"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#5a5f52] mb-2">¡Hola! Soy NutriBot</h3>
                                    <p className="text-gray-600 max-w-md">
                                        Estoy aquí para ayudarte con tus dudas sobre nutrición, dietas y hábitos saludables.
                                        ¿En qué puedo ayudarte hoy?
                                    </p>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex mb-6 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                                            {message.role === "assistant" && (
                                                <div className="flex-shrink-0 mt-1 mr-3">
                                                    <div className="bg-[#6b8f71] text-white p-2 rounded-full">
                                                        <FaRobot className="text-xl" />
                                                    </div>
                                                </div>
                                            )}
                                            <div
                                                className={`p-4 rounded-xl ${message.role === "user"
                                                    ? "bg-blue-100 text-gray-800 rounded-tr-none"
                                                    : "bg-[#E6F0D9] text-[#5a5f52] rounded-tl-none"
                                                    }`}
                                            >
                                                <p className="whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                            {message.role === "user" && (
                                                <div className="flex-shrink-0 mt-1 ml-3">
                                                    <div className="bg-blue-500 text-white p-2 rounded-full">
                                                        <FaUser className="text-xl" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="flex justify-start mb-6">
                                    <div className="flex max-w-[80%]">
                                        <div className="flex-shrink-0 mt-1 mr-3">
                                            <div className="bg-[#6b8f71] text-white p-2 rounded-full">
                                                <FaRobot className="text-xl" />
                                            </div>
                                        </div>
                                        <div className="bg-[#E6F0D9] text-[#5a5f52] p-4 rounded-xl rounded-tl-none">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-[#6b8f71] rounded-full animate-bounce"></div>
                                                <div className="w-3 h-3 bg-[#6b8f71] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-3 h-3 bg-[#6b8f71] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Input de mensaje */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
                        {error && (
                            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
                        )}
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
                                className="flex-1 p-3 border border-[#E7E3D8] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#CEB58D] text-gray-700"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleMessage}
                                disabled={!message.trim() || isLoading}
                                className={`p-3 rounded-r-lg ${!message.trim() || isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-[#6b8f71] hover:bg-[#5a7c62]'} text-white transition-colors`}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}