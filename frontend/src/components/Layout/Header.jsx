import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, LogOut } from 'lucide-react';

const Header = ({ showChatLink = false }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">HR Pro Chatbot</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {showChatLink && isAuthenticated && (
              <Link
                to="/chat"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Chat
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

