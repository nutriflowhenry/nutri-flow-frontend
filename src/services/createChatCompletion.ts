"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { ChatCompletionMessage } from "@/types/chat-completion-message.interface"; 

export default async function createChatCompletion(
messages: ChatCompletionMessage[], 
token: string 
) {
const response = await fetch(`${API_URL}/chatbot/chat-completion`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify({
    messages, 
    }),
});

if (!response.ok) {
    throw new Error('Error en la respuesta del servidor');
}

return response.json(); 
}
