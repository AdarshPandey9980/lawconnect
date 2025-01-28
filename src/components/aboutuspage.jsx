"use client";
import Footer from '@/components/footer';
import Testimonial from '@/components/testimonial';
import Header from '@/components/header';
import { Scale, Users, Globe, Award, Gavel, BookOpen, Shield, Building2, BadgeDollarSign, FileCheck } from 'lucide-react';
import { useEffect, useState } from 'react';


export default function AboutUsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "2018", label: "Founded", icon: <Building2 className="h-6 w-6" /> },
    { number: "50+", label: "Legal Experts", icon: <Users className="h-6 w-6" /> },
    { number: "1000+", label: "Cases Handled", icon: <FileCheck className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Scale className="h-12 w-12" />,
      title: "Legal Excellence",
      description: "Committed to providing the highest quality legal services with expertise and dedication"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Client Protection",
      description: "Ensuring client confidentiality and protecting their interests is our top priority"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Professional Growth",
      description: "Continuous learning and adaptation to serve our clients better with latest legal knowledge"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[35rem] overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
          <img
            src="/images/d.avif"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
        </div>

        {/* White background for mobile */}
        <div className="absolute inset-0 bg-white md:hidden" />

        <div className="container mx-auto px-4 relative z-20 h-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black text-center mb-2 md:mb-4">
              ABOUT
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">US</span>
            </h1>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24  bg-gradient-to-br from-indigo-50 via-purple-200 to-pink-50 ">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden h-96">
                <img 
                  src="/images/d.avif"
                  alt="Legal Office"
                  className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-indigo-600 font-semibold tracking-wider uppercase">Who We Are</span>
              <h2 className="text-4xl font-bold text-gray-900">
                Comprehensive Legal & CA Services
              </h2>
              <p className="text-gray-600 text-lg">
                Founded in 2018, LawConnect has grown into a leading platform providing comprehensive legal and CA services. 
                We leverage AI and a network of professionals to deliver accessible, efficient, and accurate services including 
                legal consultations, document automation, case tracking, financial compliance, and tax support.
              </p>
              <div className="flex gap-4 pt-4">
                <Gavel className="text-indigo-600 h-6 w-6" />
                <div>
                  <h3 className="text-gray-900 font-semibold">Our Mission</h3>
                  <p className="text-gray-600">To make legal and financial services accessible to individuals and businesses through technology and expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                <div className="text-indigo-600 mb-4">{stat.icon}</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 mx-auto max-w-2xl">
              The principles that guide our legal and financial services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-indigo-600 mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <Testimonial />
      <Footer />
    </main>
  );
}