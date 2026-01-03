import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">HR Pro Chatbot</h3>
            <p className="text-sm">
              Intelligent HR assistant powered by AI to help you manage your workforce efficiently.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left text-gray-300"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left text-gray-300"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-left text-gray-300"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-sm">
              Email: support@hrprochatbot.com
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 HR Pro Chatbot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

