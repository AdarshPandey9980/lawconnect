import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-700 to-purple-700">
      {/* Decorative Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <svg className="w-10 h-10 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold text-white">
                  LawConnect
                </h3>
                <span className="text-sm text-white font-medium">Legal Solutions Simplified</span>
              </div>
            </div>
            <p className="text-white">Your comprehensive platform for legal and CA services, making professional services accessible to all.</p>
            <div className="flex items-center space-x-5">
              <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300">
                <Facebook size={22} className="hover:scale-110 transform transition-transform" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300">
                <Twitter size={22} className="hover:scale-110 transform transition-transform" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300">
                <Linkedin size={22} className="hover:scale-110 transform transition-transform" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300">
                <Instagram size={22} className="hover:scale-110 transform transition-transform" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white border-b border-purple-700 pb-2">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Legal Services
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>CA Services
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Taxation & GST
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Audit Services
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Document Support
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white border-b border-purple-700 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-200 transition-colors duration-300 flex items-center">
                  <span className="mr-2">→</span>FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white border-b border-purple-700 pb-2">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white group">
                <Phone size={18} className="group-hover:text-gray-200" />
                <span className="group-hover:text-gray-200 transition-colors duration-300">+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-3 text-white group">
                <Mail size={18} className="group-hover:text-gray-200" />
                <span className="group-hover:text-gray-200 transition-colors duration-300">contact@lawconnect.com</span>
              </div>
              <div className="flex items-start space-x-3 text-white group">
                <MapPin size={18} className="group-hover:text-gray-200 mt-1 flex-shrink-0" />
                <span className="group-hover:text-gray-200 transition-colors duration-300">
                  123 Legal Avenue, Tech Park,<br />
                  Bangalore - 560001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white text-sm">
              © {currentYear} LawConnect. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors duration-300">Terms of Use</a>
              <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;