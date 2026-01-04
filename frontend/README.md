# HR Pro Chatbot - Frontend

Modern React application for the HR Pro Chatbot interface.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Simple authentication system
- 💬 Chatbot interface integrated with Flowise
- 🎤 Voice-enabled chat (V2) with speech-to-text and text-to-speech
- 📱 Mobile-friendly design
- 🚀 Fast and optimized

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Then edit `.env` and set your Flowise configuration:
```env
# Flowise Chat Widget URL (for text chat)
REACT_APP_FLOWISE_URL=http://localhost:3000

# Flowise API Configuration (for voice chat v2)
# Get these from Flowise: Deploy → API → Chatflow ID
REACT_APP_FLOWISE_API_URL=http://localhost:3000
REACT_APP_FLOWISE_CHATFLOW_ID=your-chatflow-id-here
REACT_APP_FLOWISE_API_KEY=your-api-key-here
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

### Required for Text Chat:
- `REACT_APP_FLOWISE_URL`: The URL of your Flowise chatbot instance (default: http://localhost:3000)

### Required for Voice Chat (V2):
- `REACT_APP_FLOWISE_API_URL`: The base URL of your Flowise instance (e.g., http://localhost:3000)
- `REACT_APP_FLOWISE_CHATFLOW_ID`: Your chatflow ID (found in Flowise: Deploy → API → Chatflow ID)
- `REACT_APP_FLOWISE_API_KEY`: Your API key (optional, if your Flowise instance requires authentication)

## Authentication

The current implementation uses localStorage for authentication. In production, you should integrate with a proper authentication service (e.g., JWT tokens, OAuth, etc.).

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Auth/
│   │   │   └── SignIn.jsx
│   │   └── Chat/
│   │       ├── ChatbotWidget.jsx
│   │       └── VoiceChat.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── SignInPage.jsx
│   │   ├── ChatPage.jsx
│   │   └── ChatV2Page.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)

## Voice Chat (V2)

The application includes a voice-enabled chat feature at `/chat-v2` that supports:

- 🎤 **Speech-to-Text**: Click the microphone button to speak your message
- 🔊 **Text-to-Speech**: Bot responses are automatically read aloud
- ⌨️ **Text Input**: You can still type messages normally
- 🎯 **Auto-send**: Voice input automatically sends after recognition

### Voice Chat Requirements:

1. **Browser Support**: Chrome, Edge, or Safari (Web Speech API support required)
2. **HTTPS in Production**: Microphone access requires a secure context (HTTPS)
3. **Flowise API Access**: Requires Flowise API configuration (API URL and Chatflow ID)
4. **Microphone Permission**: Browser will request microphone access on first use

### Getting Flowise API Configuration:

1. Open Flowise UI
2. Go to **Deploy → API**
3. Copy your **Chatflow ID**
4. Copy your **API URL** (base URL of your Flowise instance)
5. If authentication is enabled, copy your **API Key**

## Notes

- Make sure your Flowise instance is running and accessible
- Configure CORS on your Flowise server if needed
- The chatbot iframe requires proper security headers
- For voice chat, ensure your Flowise API is accessible and CORS is configured
- Voice features require HTTPS in production environments

