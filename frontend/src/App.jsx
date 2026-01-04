import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import ChatV2Page from './pages/ChatV2Page';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat-v2" element={<ChatV2Page />} />
      </Routes>
    </Router>
  );
}

export default App;

