import React, { useEffect, useRef } from 'react';

const ChatbotWidget = ({ flowiseUrl }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // If Flowise URL is provided, the iframe will load it
    // Make sure CORS is properly configured on Flowise side
  }, [flowiseUrl]);

  if (!flowiseUrl) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chatbot URL Not Configured
          </h3>
          <p className="text-gray-500 mb-4">
            Please set REACT_APP_FLOWISE_URL in your .env file
          </p>
          <p className="text-sm text-gray-400">
            Example: REACT_APP_FLOWISE_URL=http://localhost:3000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        ref={iframeRef}
        src={flowiseUrl}
        className="w-full h-full border-0"
        title="HR Pro Chatbot"
        allow="microphone; camera"
      />
    </div>
  );
};

export default ChatbotWidget;

