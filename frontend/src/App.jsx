import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/signin" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

