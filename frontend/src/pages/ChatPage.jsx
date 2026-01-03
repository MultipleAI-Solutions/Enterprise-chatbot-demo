import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import ChatbotWidget from '../components/Chat/ChatbotWidget';
import { MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const [flowiseUrl, setFlowiseUrl] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/signin');
    }

    // Get Flowise URL from environment variable or use default
    // In production, you should store this in .env file
    const url = process.env.REACT_APP_FLOWISE_URL || 'http://localhost:3000';
    setFlowiseUrl(url);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showChatLink={true} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">HR Pro Chatbot</h1>
                <p className="text-primary-100 text-sm">
                  Ask me anything about your HR data
                </p>
              </div>
            </div>
          </div>

          {/* Chat Widget */}
          <div className="chat-container">
            <ChatbotWidget flowiseUrl={flowiseUrl} />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Ask about employee information, performance, or remuneration</li>
            <li>Query specific departments or employees by ID</li>
            <li>Get insights on organizational structure and analytics</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;

