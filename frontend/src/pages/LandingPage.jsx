import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { 
  MessageSquare, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight 
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'AI-Powered Chat',
      description: 'Get instant answers to your HR questions with our intelligent chatbot.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Employee Management',
      description: 'Access employee data, performance metrics, and organizational insights.',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Analytics & Insights',
      description: 'Make data-driven decisions with comprehensive HR analytics.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  const benefits = [
    'Real-time employee information access',
    'Performance tracking and analytics',
    'Remuneration and compensation insights',
    'Leave and attendance management',
    'Recruitment and onboarding data',
    'Compliance and risk monitoring',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Your Intelligent HR Assistant
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Streamline your HR operations with AI-powered insights and instant access to employee data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signin"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your workforce efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your HR Operations
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access comprehensive HR data and insights through natural language conversations. 
                Get instant answers about employees, performance, compensation, and more.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-lg text-white">
                <Zap className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Ask Anything</h3>
                <p className="text-primary-100">
                  Our AI understands natural language and provides accurate, 
                  context-aware responses from your HR database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Sign in now and experience the future of HR management
          </p>
          <Link
            to="/signin"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>Sign In Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

