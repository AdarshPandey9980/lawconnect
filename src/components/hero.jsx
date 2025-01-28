"use client";
import React, { useState, useEffect } from 'react';
import Company from "./company";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users, FileText, Award } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const endValue = parseInt(value);
    const stepTime = Math.abs(Math.floor(duration * 1000 / endValue));
    
    const timer = setInterval(() => {
      startValue += 1;
      setCount(startValue);
      if (startValue === endValue) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

const Button = ({ children, size = "md", variant = "default", className = "", ...props }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm",
    md: "px-3 py-1.5 sm:px-4 sm:py-2",
    lg: "px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg"
  };

  const variantClasses = {
    default: "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    outline: "border border-2 bg-transparent hover:bg-opacity-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const FloatingElement = ({ delay = 0, duration = 4, children }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

const StatsCard = () => {
  const stats = [
    { 
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      value: "50K",
      label: "Active Users"
    },
    {
      icon: <FileText className="w-6 h-6 sm:w-8 sm:h-8" />,
      value: "1M",
      label: "Documents Processed"
    },
    {
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      value: "99.9",
      label: "Success Rate",
      suffix: "%"
    },
    {
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      value: "4.9",
      label: "Client Satisfaction",
      suffix: "/5"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.7 }}
      className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 max-w-5xl mx-auto relative z-10"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="relative group"
          >
                          <div className="text-center p-3 sm:p-4 md:p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 
                          group-hover:from-gray-100 group-hover:to-gray-200 
                          transition-all duration-300 transform group-hover:scale-105">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center 
                           bg-gray-100 text-gray-600"
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                           bg-clip-text text-transparent mb-2"
              >
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </motion.div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.2, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r 
                     from-purple-300/30 to-indigo-300/30 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r 
                     from-pink-300/30 to-purple-300/30 rounded-full filter blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-left relative"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                Revolutionizing
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r 
                           from-indigo-600 via-purple-600 to-pink-600 block mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  Legal & Financial Services
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                LawConnect brings together legal expertise, chartered accountancy, and public services 
                in one powerful platform. Experience the future of professional services.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                           text-white shadow-lg group w-full sm:w-auto"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:border-gray-400 
                           hover:bg-white/50 shadow-lg backdrop-blur-sm w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative mt-8 lg:mt-0"
            >
              <FloatingElement delay={0} duration={5}>
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src="/images/a.avif"
                        alt="Legal & Financial Services"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="absolute -z-10 top-4 right-4 w-full h-full 
                              bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl" />
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats and Logos sections */}
      <div className="relative -mt-2">
        <div className="container mx-auto px-4">
          <StatsCard />
        </div>
        <Company/>
      </div>
    </div>
  );
}