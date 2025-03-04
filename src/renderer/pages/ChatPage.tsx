import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Chat with AI</h1>
        <p className="text-gray-600">Powered by Ollama (deepseek-r1:8b)</p>
      </div>
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
