"use server";

import { ChatCompletionMessage } from "@/types/chat-completion-message.interface"; 

export default async function createChatCompletion(
messages: ChatCompletionMessage[], 
token: string 
) {
const response = await fetch(`${process.env.API_URL}/chatbot/chat-completion`, {
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
