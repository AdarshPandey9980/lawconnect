"use client";
import Footer from "./footer";
import Navbar from "./header";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative h-[20rem] sm:h-[25rem] md:h-[35rem] overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
          <img
            src="/images/e.webp"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
        </div>

        {/* White background for mobile */}
        <div className="absolute inset-0 bg-white md:hidden" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20 h-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black text-center mb-2 md:mb-4">
              CONTACT
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">US</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <main className="flex-grow bg-gradient-to-br from-indigo-50 via-purple-200 to-pink-50">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Contact Information */}
            <div className="space-y-8 md:space-y-12">
              <div>
                <h3 className="text-indigo-600 text-base md:text-lg mb-2 md:mb-3">Professional Legal Services</h3>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">
                  Connect with 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"> Legal Experts</span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  LawConnect provides comprehensive legal and CA services including consultations, document automation, 
                  case tracking, financial compliance, and tax support. Our platform leverages AI and a network of 
                  professionals to deliver accessible, efficient, and accurate services.
                </p>
              </div>

              <div className="space-y-6 md:space-y-10">
                {[
                   { 
                    title: 'Phone',
                    content: '+91 98765 43210 / +91 98765 43211',
                    icon: '📞'
                  },
                  { 
                    title: 'Email',
                    content: 'info@lawconnect.com / support@lawconnect.com',
                    icon: '📧'
                  },
                  { 
                    title: 'Social Media',
                    content: 'Instagram: @lawconnect / Facebook: @LawConnectOfficial',
                    icon: '🌐'
                  }
                ].map(({ title, content, icon }) => (
                  <div key={title} className="flex items-start space-x-4 md:space-x-6">
                    <span className="text-2xl md:text-3xl">{icon}</span>
                    <div>
                      <h4 className="font-semibold mb-1 md:mb-2 text-indigo-600 text-base md:text-lg">{title}</h4>
                      <p className="text-gray-600 text-sm md:text-lg">{content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border border-indigo-100 mt-4 md:mt-7">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 text-sm md:text-base"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 text-sm md:text-base"
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Service Type (Legal/CA/Tax)"
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 text-sm md:text-base"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your legal or financial service needs"
                  rows="4"
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 resize-none text-sm md:text-base"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg text-base md:text-lg"
                >
                  Request Consultation
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-[300px] md:h-[400px] w-full mt-8 md:mt-16">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.0897485978728!2d72.96563837486543!3d19.234633982006723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b90f03e23585%3A0x1e7b2ded7eea66b!2sVijay%20Garden%2C%20Ghodbunder%20Rd%2C%20Thane%20West%2C%20Thane%2C%20Maharashtra%20400615!5e0!3m2!1sen!2sin!4v1705067287411!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
}