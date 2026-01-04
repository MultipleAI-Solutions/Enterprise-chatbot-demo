import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader } from 'lucide-react';

const VoiceChat = ({ flowiseApiUrl, chatflowId, apiKey }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);
  const sendMessageRef = useRef(null);

  // Define speakText first so it can be used in sendMessage
  const speakText = (text) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Define sendMessage first so it can be used in recognition callback
  const sendMessage = useCallback(async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      type: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = `${flowiseApiUrl}/api/v1/prediction/${chatflowId}`;
      console.log('Sending to Flowise API:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        },
        body: JSON.stringify({
          question: text,
          // History may not be supported by all Flowise instances
          // history: messages.filter(m => m.type !== 'error').map(m => ({
          //   type: m.type === 'user' ? 'humanMessage' : 'aiMessage',
          //   message: m.content,
          // })),
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      console.log('Response content-type:', contentType);
      console.log('Response preview:', responseText.substring(0, 200));

      // If response is HTML, it's likely an error page
      if (!contentType || !contentType.includes('application/json')) {
        // Check if it's HTML (starts with <)
        if (responseText.trim().startsWith('<')) {
          let errorMessage = 'Flowise API returned HTML instead of JSON. ';
          
          // Try to extract error from HTML
          if (responseText.includes('404') || responseText.includes('Not Found')) {
            errorMessage += `The API endpoint might be incorrect. Please verify your chatflow ID: ${chatflowId}`;
          } else if (responseText.includes('403') || responseText.includes('Forbidden')) {
            errorMessage += 'Access forbidden. Please check your API key.';
          } else if (responseText.includes('401') || responseText.includes('Unauthorized')) {
            errorMessage += 'Unauthorized. Please check your API key.';
          } else if (responseText.includes('CORS')) {
            errorMessage += 'CORS error. Flowise Cloud might not allow requests from your domain.';
          } else {
            errorMessage += `Unexpected response. Status: ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON:', responseText.substring(0, 500));
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(`Flowise API Error: ${data.message || data.error || `HTTP ${response.status}`}`);
      }

      console.log('Flowise API Success Response:', data);
      const botMessage = {
        type: 'bot',
        content: data.text || data.answer || 'Sorry, I could not process that request.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      
      // Speak the response
      if (isVoiceEnabled) {
        speakText(botMessage.content);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please check your Flowise API configuration.');
      setMessages((prev) => [...prev, {
        type: 'error',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, flowiseApiUrl, chatflowId, apiKey, messages, isVoiceEnabled]);

  // Store sendMessage in ref for use in recognition callback
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setIsVoiceEnabled(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      // Auto-send after voice recognition
      setTimeout(() => {
        if (sendMessageRef.current) {
          sendMessageRef.current(transcript);
        }
      }, 100);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please enable microphone access.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    setError('');
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">👋 Start a conversation</p>
            <p className="text-sm">Click the microphone to speak or type your message</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message or click the microphone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={1}
              disabled={isLoading}
            />
            {isListening && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-1 text-red-500">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Listening...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {/* Voice Input Button */}
            {isVoiceEnabled && (
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`p-3 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}

            {/* TTS Toggle */}
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                title="Stop speaking"
              >
                <VolumeX className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const lastBotMessage = [...messages].reverse().find(m => m.type === 'bot');
                  if (lastBotMessage) {
                    speakText(lastBotMessage.content);
                  }
                }}
                disabled={!messages.some(m => m.type === 'bot') || isLoading}
                className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Repeat last response"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-2 text-center">
          {isListening ? '🎤 Listening... Speak now' : 'Press Enter to send, Shift+Enter for new line'}
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;

