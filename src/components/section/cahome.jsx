"use client";
import { ArrowRight, Calculator, BookOpen, ChartBar, Calendar } from 'lucide-react';
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
    <div className="bg-blue-50 rounded-lg p-8">
      <Icon className="w-10 h-10 text-blue-600 mb-6" />
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function CAConsultantLanding() {
  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay - hidden on mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        <img
          src="/images/i.jpeg"
          alt="Professional Office Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" />
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
                Expert CA
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 inline-block ml-2">
                  Consulting
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl mb-12 text-gray-600 max-w-lg">
                Join our network of certified chartered accountants providing expert financial 
                consulting services. Access premium resources, collaborate with industry leaders, 
                and deliver exceptional value to your clients.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4 max-w-md">
                  <Calculator className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Comprehensive tax planning and financial advisory tools
                  </p>
                </div>
                <div className="flex items-start gap-4 max-w-md">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Regular updates on tax laws, compliance, and industry best practices
                  </p>
                </div>
                <div className="flex items-start gap-4 max-w-md">
                  <ChartBar className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-sm md:text-base text-gray-600">
                    Advanced analytics and reporting capabilities for client portfolios
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:bg-blue-700 flex items-center justify-center">
                  <Link href="/calogin">
                    Access Portal
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