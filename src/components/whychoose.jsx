import React from 'react';
import { Scale, Calculator, FileText, Users } from 'lucide-react';
import Image from 'next/image';

export default function WhyChooseUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-200 to-pink-50 px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Why Choose LawConnect?</h1>
        <p className="text-gray-500 max-w-3xl mx-auto">
          We provide comprehensive legal and financial services through an integrated platform,
          connecting you with expert professionals and cutting-edge technology for seamless service delivery.
        </p>
      </div>

      {/* Modified Grid Layout */}
      <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* First Card - Full width image */}
        <div className="md:col-span-7 bg-gray-50 rounded-3xl overflow-hidden border border-gray-300">
          <div className="w-full h-64 relative">
            <Image 
              src="/images/a.avif" 
              alt="Legal Services" 
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
          <div className="p-11">
            <h3 className="text-2xl font-semibold mb-2">Legal Services Hub</h3>
            <p className="text-gray-500">
              Access a complete suite of legal services including consultations, document automation,
              case tracking, and e-court services. Our AI-powered platform streamlines legal processes
              for enhanced efficiency.
              Access a complete suite of legal services including consultations, document automation,
              case tracking, and e-court services. Our AI-powered platform streamlines legal processes
              for enhanced efficiency.
            </p>
          </div>
        </div>

        {/* Second Card - Properly spaced image */}
        <div className="md:col-span-5 bg-gray-50 rounded-3xl p-8 border border-gray-300">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <Calculator className="w-16 h-16 text-blue-600" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Explore Services
              </button>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2">CA & Financial Services</h3>
          <p className="text-gray-500 mb-8">
            Comprehensive chartered accountant services including business registration,
            financial compliance, and virtual CFO services for businesses of all sizes.
          </p>
          <div className="flex mt-2 px-2">
            <Image 
              src="/images/b.svg" 
              alt="Financial Services" 
              width={400} 
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Second Row - Asymmetric Cards */}
        <div className="md:col-span-4 bg-gray-50 rounded-3xl p-8 border border-gray-300">
          <div className="flex mb-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-sm">
                +50
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Expert Professional Network</h3>
          <p className="text-gray-500">
            Access our network of qualified legal and financial professionals providing
            personalized services tailored to your needs.
          </p>
        </div>

        <div className="md:col-span-8 bg-gray-50 rounded-3xl border border-gray-300 p-8">
          <div className="mb-6">
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-600">Document Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-600">Tax Services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-600">Audit Support</span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Comprehensive Service Suite</h3>
          <p className="text-gray-500">
            From taxation and GST services to public documentation support, we offer a complete
            range of services integrated into a single platform for your convenience.
          </p>
        </div>
      </div>
    </div>
  );
}