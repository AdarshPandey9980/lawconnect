"use client";
import React from 'react';
import { Users, Scale } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          {/* Left side content */}
          <div className="flex-1 max-w-2xl space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">LawConnect</span>
              </h2>
              
              <div className="prose max-w-none space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  LawConnect brings together legal expertise, chartered accountancy, and modern technology 
                  to provide accessible, efficient solutions for individuals and businesses alike. Our 
                  platform represents a revolutionary approach to legal and financial services, where 
                  traditional expertise meets cutting-edge innovation.
                </p>

                <div className="flex items-start gap-4 mt-8">
                  <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Our network comprises highly qualified legal professionals and chartered accountants, 
                      each bringing years of specialized experience to their respective fields. These experts 
                      work collaboratively
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mt-8">
                  <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                    <Scale className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Our legal services leverage advanced technology to streamline processes and enhance 
                      efficiency without compromising on quality. We understand that legal matters require 
                      both precision and timeliness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="flex-1 lg:ml-12">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/images/b.svg"
                alt="LawConnect Team"
                className="w-full h-auto md:h-96 lg:h-[32rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;