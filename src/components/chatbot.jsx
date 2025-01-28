"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2, Scale, Send, Trash2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const INITIAL_MESSAGE = {
  type: 'bot',
  content: `Hello!
 
I am LawConnect Assistant, an AI legal information provider. I can help explain legal concepts and provide general information about legal processes.

How may I assist you with legal information today?`
};

const ChatMessage = ({ message, type }) => (
  <div className="flex gap-3 bg-black/5 p-4 rounded-lg">
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-black">
      {type === 'bot' ? (
        <Scale className="w-5 h-5 text-white" />
      ) : (
        <User className="w-5 h-5 text-white" />
      )}
    </div>
    <div className="flex-1">
      <p className="text-sm mb-1 font-medium text-black">
        {type === 'bot' ? 'LawConnect Assistant' : 'You'}
      </p>
      <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-gray-800 whitespace-pre-wrap">
        {message}
      </div>
    </div>
  </div>
);

const ChatBot = () => {
  const STORAGE_KEY = 'lawconnect_chat_history';
  
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isClient]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setChatHistory([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([INITIAL_MESSAGE]));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Update chat history
    const newHistory = [...chatHistory, { role: 'user', content: input.trim() }];
    setChatHistory(newHistory);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Missing Gemini API key");
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are LawConnect Assistant, a professional AI legal information provider.

RESPONSE GUIDELINES:
1. Format your responses in clear, natural language
2. Use bullet points (•) for lists
3. Break content into clear sections with proper spacing
4. Present legal terms in context within sentences
5. Never use markdown symbols or formatting characters
6. Maintain a formal yet accessible tone
7. Include relevant examples where appropriate

CONTENT REQUIREMENTS:
• Start each response with a brief, clear disclaimer
• Provide educational information about legal concepts
• Explain legal processes and terminology clearly
• Reference general legal principles when relevant
• Recommend consulting attorneys for specific advice
• Stay focused on providing general legal information
• Never offer specific legal advice or predictions
• Be transparent about legal complexities

Keep responses clear, professional, and properly formatted without any special characters or markdown.

Previous conversation context:
${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current user query: ${input}`;

      const result = await model.generateContentStream(systemPrompt);
      let fullResponse = '';
      
      for await (const chunk of result.stream) {
        fullResponse += chunk.text();
        setMessages(prev => [
          ...prev.slice(0, -1),
          { type: 'bot', content: fullResponse }
        ]);
      }

      // Update chat history with assistant's response
      setChatHistory([...newHistory, { role: 'assistant', content: fullResponse }]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message.includes("API key")
        ? "Configuration error: Missing API key"
        : error.message.includes("quota")
        ? "API quota exceeded. Please try again later."
        : "I apologize, but I encountered an error. Please try your query again.";
        
      setMessages(prev => [...prev, {
        type: 'bot',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4 bg-white mb-26">
      {/* Header with Clear Chat button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">LawConnect Assistant</h1>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto rounded-lg shadow-lg border border-black/10 mb-4">
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              type={message.type}
            />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-6 h-6 text-black animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your legal question..."
          className="flex-1 rounded-lg border-2 border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-black text-white rounded-lg px-6 py-2 hover:bg-gray-900 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                   flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatBot;