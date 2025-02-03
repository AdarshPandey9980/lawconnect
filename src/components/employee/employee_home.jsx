"use client";
import { ArrowRight, Coffee, Users, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 text-lg rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-indigo-50 rounded-lg p-8">
      <Icon className="w-10 h-10 text-indigo-600 mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function EmployeeLanding() {
  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay - hidden on mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        <img
          src="/images/i.jpeg"
          alt="Office Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 " />
      </div>

      {/* White background for mobile */}
      <div className="absolute inset-0 bg-white md:hidden" />

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
                Welcome to Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 inline-block ml-2">
                  Workspace
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl mb-12 text-gray-600 max-w-lg">
                Join our vibrant community of professionals where innovation meets collaboration. 
                Discover resources, connect with colleagues, and achieve your career goals 
                in a supportive environment designed for your success.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4 max-w-md">
                  <Coffee className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Engaging work culture with regular team activities and social events
                  </p>
                </div>
                <div className="flex items-start gap-4 max-w-md">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Collaborative teams and mentorship opportunities for career growth
                  </p>
                </div>
                <div className="flex items-start gap-4 max-w-md">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Clear career paths with professional development programs
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                
                <Button  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:bg-indigo-700 flex items-center justify-center">
                <Link href="/employee_login">
                  View Documents
                </Link>
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
                
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}