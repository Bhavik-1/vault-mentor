import { useState, useRef, useEffect, FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const suggestionPrompts = [
    "What is 2FA?",
    "How do I create a strong password?",
    "Tell me about phishing.",
    "Is it safe to use public Wi-Fi?"
];

// --- Main Chatbot Component ---

export default function CybersecurityChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm your personal cybersecurity mentor. Ask me anything about staying safe online, from creating strong passwords to spotting phishing scams.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Sends the user's query to the Google Gemini API and displays the response.
   * @param {string} userQuery The user's question.
   */
  const getGeminiResponse = async (userQuery: string) => {
    setIsLoading(true);

    const apiKey = "AIzaSyBQLoHseUcCzmr8qRAHDsMqCU6j2kLjTM8"; // API key is left empty; it will be provided by the environment.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a friendly and helpful cybersecurity mentor for college students. Your tone is encouraging, knowledgeable, and never alarming. Your primary goal is to teach good security practices.
        - Provide clear, concise, and actionable advice.
        - If asked about a security concept, explain it in simple terms with a relatable analogy.
        - If asked for an opinion, base it on widely accepted cybersecurity best practices.
        - Do not give legal, financial, or medical advice.
        - Keep responses to 2-4 sentences for readability in a chat format.
        - If a user mentions a specific breach or problem, guide them on the general steps to take (e.g., "change your password on that service immediately," "enable Multi-Factor Authentication") without asking for their personal information.
    `;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botResponse) {
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      } else {
        throw new Error("No response text from API.");
      }
    } catch (error) {
      console.error("Gemini API call failed:", error);
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        variant: "destructive",
      });
       setMessages((prev) => [...prev, { sender: "bot", text: "I seem to be having connection issues. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === "" || isLoading) return;
    
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    getGeminiResponse(input);
    setInput("");
  };
  
  const handleSuggestionClick = (prompt: string) => {
    if (isLoading) return;
    
    const userMessage: Message = { sender: "user", text: prompt };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    getGeminiResponse(prompt);
    setInput("");
  };


  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600"/>
                    Cybersecurity Mentor Chat
                </CardTitle>
                <CardDescription>Your personal AI guide to digital safety</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[500px] overflow-y-auto p-4 space-y-6 border rounded-lg bg-white dark:bg-gray-800">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && (
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback><User size={18} /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                             <Avatar className="w-8 h-8 border">
                                <AvatarFallback><Bot size={18} /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {messages.length <= 1 && !isLoading && (
                    <div className="p-4 grid grid-cols-2 gap-2">
                        {suggestionPrompts.map(prompt => (
                            <Button key={prompt} variant="outline" size="sm" onClick={() => handleSuggestionClick(prompt)}>
                                {prompt}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="mt-4 flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about cybersecurity..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
