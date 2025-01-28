"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Mail, Phone, MessageSquare } from 'lucide-react';
import Footer from './footer';
import Navbar from './header';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'legal', name: 'Legal Services' },
    { id: 'ca', name: 'CA Services' },
    { id: 'tax', name: 'Taxation' },
    { id: 'doc', name: 'Documentation' }
  ];

  const faqs = [
    {
      category: 'legal',
      question: "What legal services does LawConnect provide?",
      answer: "LawConnect offers comprehensive legal services including direct consultations with legal professionals, AI-assisted legal support, document creation with customizable templates, case tracking with real-time updates, and e-court services for electronic filing and virtual hearings."
    },
    {
      category: 'ca',
      question: "What CA services are available on LawConnect?",
      answer: "Our CA services include business registration and structuring, comprehensive accounting services (bookkeeping, financial statements, payroll processing), Management Information System (MIS) reporting, and Virtual CFO services for SMEs. We provide cost-effective solutions with access to expert financial guidance."
    },
    {
      category: 'tax',
      question: "How does LawConnect handle taxation services?",
      answer: "We offer complete taxation services including GST registration and advisory, corporate tax compliance, personal tax planning and filing, and representation before tax authorities. Our services cover salary structuring, tax planning strategies, and income tax return filing with status tracking."
    },
    {
      category: 'doc',
      question: "What document management features are available?",
      answer: "LawConnect provides a centralized document hub with secure online access, metadata management, paperless office solutions, and document comparison tools. We ensure security measures protect sensitive information while maintaining easy accessibility."
    },
    {
      category: 'legal',
      question: "How does the AI-assisted legal support work?",
      answer: "Our AI engine offers automated responses to frequently asked questions, preliminary legal advice, and assistance in drafting simple legal documents. It's integrated with our legal knowledge base containing Indian legal statutes, cases, and procedures."
    },
    {
      category: 'ca',
      question: "What are the benefits of Virtual CFO services?",
      answer: "Virtual CFO services are cost-effective as you only pay for what you use, provide access to seasoned financial experts' experience, and offer flexible integration into existing teams without disrupting workflows, making it ideal for SMEs."
    },
    {
      category: 'tax',
      question: "How do you support GST compliance?",
      answer: "We provide comprehensive GST support including registration assistance, compliance guidance on Reverse Charge Mechanism, goods/services segregation, filing reminders, and assistance with GST return filing to help avoid penalties."
    },
    {
      category: 'doc',
      question: "What types of documentation services do you support?",
      answer: "We assist with various certificates including Police Clearance, MSME, Udyog Aadhaar, PAN, passport services, senior citizen and marriage certificates, name changes through e-Gazette, and health card applications."
    }
  ];

  useEffect(() => {
    const filtered = faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredFaqs(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Image Background */}
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

        <div className="relative z-10 h-[35rem] container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold text-black text-center mb-4">
              Help &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"> Support</span>
            </h1>
            
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your question..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"> Questions</span>
            </h2>
           
          </div>

          <div className="grid gap-8 max-w-3xl mx-auto">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-indigo-400/30 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-indigo-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-indigo-400" />
                  )}
                </button>
                <div
                  className={`px-6 transition-all duration-300 ${
                    openIndex === index ? 'pb-6 opacity-100' : 'h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Still Have
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"> Questions?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our legal and financial experts are here to help you 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:border-indigo-400/30 transition-all shadow-sm">
              <Mail className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@lawconnect.com</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:border-indigo-400/30 transition-all shadow-sm">
              <Phone className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:border-indigo-400/30 transition-all shadow-sm">
              <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Consultation</h3>
              <p className="text-gray-600">Schedule Now</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}