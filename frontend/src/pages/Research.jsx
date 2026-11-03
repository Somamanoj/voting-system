import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAiResponse } from '../services/api';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Download,
  Copy,
  RotateCcw,
  Loader,
  Lightbulb,
  Award,
  Vote,
  FileText,
  Users
} from 'lucide-react';

export default function Research() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I can help you research candidates and elections. Ask me anything about the ongoing elections, candidate manifestos, or voting information!",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "Who supports better healthcare?",
    "Compare candidates on education policy",
    "Which candidate is best for environmental issues?",
    "Explain the main election issues"
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // Show loading
    setIsLoading(true);

    try {
      // Get AI response
      const response = await getAiResponse(input);

      // Add AI message with delay for better UX
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: Date.now(), text: response.response, sender: 'ai' }
        ]);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      // Show error message
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now(),
          text: "Sorry, I couldn't process your request. Please try again.",
          sender: 'ai',
          isError: true
        }
      ]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current.focus();
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I can help you research candidates and elections. Ask me anything about the ongoing elections, candidate manifestos, or voting information!",
        sender: 'ai'
      }
    ]);
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-gray-50 p-4 md:p-6 mt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm mb-4"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="text-indigo-500" size={24} />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Election Research Assistant</h1>
            <p className="text-sm text-gray-500">We are not promoting any candidate, this is solely for knowledge and research purposes.</p>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden bg-white rounded-lg shadow-sm p-4 mb-4">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pr-2">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className={`flex gap-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-700'
                    }`}>
                    {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>

                  <div>
                    <div className={`p-3 rounded-lg ${message.sender === 'ai'
                      ? message.isError
                        ? 'bg-red-50 text-red-700'
                        : 'bg-indigo-50 text-gray-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {message.sender === 'ai' && !message.isError && (
                      <motion.div
                        className="flex mt-1 gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          className="text-xs text-gray-500 hover:text-indigo-500 flex items-center gap-1"
                          onClick={() => handleCopyMessage(message.text)}
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading animation */}
            {isLoading && (
              <motion.div
                className="flex mb-4 justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex gap-3 max-w-3xl">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50">
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Loader className="animate-spin text-indigo-500" size={16} />
                      <span>Thinking...</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Quick suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
            <Lightbulb size={14} className="text-amber-500" />
            <span>Suggestions</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full px-3 py-1 text-gray-600 transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {index === 0 && <Award size={12} />}
                {index === 1 && <FileText size={12} />}
                {index === 2 && <Users size={12} />}
                {index === 3 && <Vote size={12} />}
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleSendMessage}
          className="flex gap-2 items-center mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={resetChat}
            className="p-2 rounded-full text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw size={18} />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about candidates or elections..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <motion.button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
          </motion.button>
        </motion.form>
      </div>

      {/* Feature Icons */}
      <motion.div
        className="flex justify-between items-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="flex items-center gap-1">
          <Sparkles size={14} className="text-indigo-500" />
          <span>Powered by AI</span>
        </span>

        <span className="text-xs">
          Research responsibly • Vote wisely
        </span>
      </motion.div>
    </motion.div>
  );
}