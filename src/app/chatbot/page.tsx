"use client";

import { useState } from "react";
import { ChatCompletionMessage } from "@/types/chat-completion-message.interface"; 
import createChatCompletion from "@/services/createChatCompletion"; 
import Cookies from "js-cookie"; 

export default function Home() {
const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
const [message, setMessage] = useState("");
const [error, setError] = useState<string | null>(null);

const token = Cookies.get("token");  

if (!token) {
    return <div>Error: No token found.</div>; 
}

const handleMessage = async () => {
    const updatedMessages = [
    ...messages,
    {
        role: "user",
        content: message,
    },
    ];
    setMessages(updatedMessages);
    setMessage("");
    setError(null);  

    try {
    const response = await createChatCompletion(updatedMessages, token);

    if (response && response.choices && response.choices[0]?.message) {
        setMessages([...updatedMessages, response.choices[0].message]);
    } else {
        setError("No se pudo obtener una respuesta del servidor.");
    }
    } catch (err) {
    setError("Error al contactar con el servidor.");
    console.error(err);
    }
};

return (
    <div className="h-screen flex items-center justify-center flex-col gap-10 container mx-auto pl-4 pt-6 pr-4">
    <div className="flex flex-col gap-3 h-[75%] overflow-scroll w-full">
        {messages.map((message, index) => (
        <div
            key={index} 
            className={message.role === "user" ? "chat chat-start" : "chat chat-end"}
        >
            <div className="chat-bubble">
            <p>{message.content}</p>
            </div>
        </div>
        ))}
    </div>
      {error && <div className="text-red-500">{error}</div>} {/* Mostrar mensaje de error si existe */}
    <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={async (event) => {
        if (event.key === "Enter") {
            await handleMessage();
        }
        }}
        className="input input-bordered w-full m-10"
    />
    </div>
);
}
