"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/documents", text: "Documents" },
    { href: "/chatbot", text: "AI assistant" },
    { href: "/documentgeneration", text: "DocumentGeneration" },
    { href: "/lawyerpage", text: "LawyerServices" },
    { href: "/section", text: "CA compliance" }
  ]

  return (
    <motion.header 
      className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/main" className="text-2xl font-bold text-indigo-600 flex items-center">
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-poppins">LawConnect</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {link.text}
            </Link>
          ))}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link 
              href="/"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-all duration-300"
            >
              Logout
            </Link>
          </div>
        </nav>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="text-indigo-600" /> : <Menu className="text-indigo-600" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center py-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  {link.text}
                </Link>
              ))}
              <Link 
                href="/"
                className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-center"
              >
                Logout
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}