import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import VoiceChat from '../components/Chat/VoiceChat';
import { MessageSquare, Mic } from 'lucide-react';

const ChatV2Page = () => {
  const navigate = useNavigate();
  const [flowiseApiUrl, setFlowiseApiUrl] = useState('');
  const [chatflowId, setChatflowId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Get Flowise configuration from environment variables
    const apiUrl = process.env.REACT_APP_FLOWISE_API_URL || '';
    const id = process.env.REACT_APP_FLOWISE_CHATFLOW_ID || '';
    const key = process.env.REACT_APP_FLOWISE_API_KEY || '';

    setFlowiseApiUrl(apiUrl);
    setChatflowId(id);
    setApiKey(key);

    // Check if configured (at least API URL and chatflow ID needed)
    if (apiUrl && id) {
      setIsConfigured(true);
    }
  }, [navigate]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header showChatLink={true} />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <Mic className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Voice Chat Configuration Required
              </h2>
              <p className="text-gray-600 mb-6">
                To use the voice-enabled chat, please configure the following environment variables:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left max-w-2xl mx-auto mb-4">
                <code className="text-sm block space-y-2 text-gray-800">
                  <div>REACT_APP_FLOWISE_API_URL=http://localhost:3000</div>
                  <div>REACT_APP_FLOWISE_CHATFLOW_ID=your-chatflow-id</div>
                  <div>REACT_APP_FLOWISE_API_KEY=your-api-key (optional)</div>
                </code>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                You can find your chatflow ID in Flowise under <strong>Deploy → API → Chatflow ID</strong>
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Text Chat Instead
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showChatLink={true} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mic className="h-8 w-8" />
                <div>
                  <h1 className="text-2xl font-bold">Voice Chat (V2)</h1>
                  <p className="text-primary-100 text-sm">
                    Speak or type to interact with the HR chatbot
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="text-white hover:text-primary-100 text-sm underline"
              >
                Switch to Text Chat
              </button>
            </div>
          </div>

          {/* Voice Chat Widget */}
          <div className="chat-container">
            <VoiceChat
              flowiseApiUrl={flowiseApiUrl}
              chatflowId={chatflowId}
              apiKey={apiKey}
            />
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Voice Chat Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click the microphone button to start voice input</li>
            <li>Speak clearly and wait for the "Listening..." indicator</li>
            <li>Responses will be read aloud automatically</li>
            <li>Click the speaker icon to repeat the last response</li>
            <li>You can also type messages normally</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ChatV2Page;

