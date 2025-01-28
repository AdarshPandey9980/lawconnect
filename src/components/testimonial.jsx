"use client";
import React from 'react';

const TestimonialsGrid = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      image: "/images/person_1.jpg",
      rating: 5,
      text: "LawConnect has transformed how I handle legal matters for my business. The AI document generator saves me hours of work."
    },
    {
      name: "Michael Chen",
      role: "Corporate Lawyer",
      image: "/images/person_2.jpg",
      rating: 5,
      text: "The platform streamlines my workflow and helps me serve clients more efficiently. The AI assistant is remarkably accurate."
    },
    {
      name: "Emily Rodriguez",
      role: "Startup Founder",
      image: "/images/person_3.jpg",
      rating: 5,
      text: "As a startup founder, having access to quick legal assistance and document generation has been invaluable."
    },
    {
      name: "David Wilson",
      role: "Legal Consultant",
      image: "/images/person_4.jpg",
      rating: 5,
      text: "An excellent tool that has revolutionized my legal practice. The document automation is outstanding."
    },
    {
      name: "Lisa Zhang",
      role: "Business Attorney",
      image: "/images/person_1.jpg",
      rating: 5,
      text: "Incredibly user-friendly interface with powerful features. Makes legal work much more efficient."
    },
    {
      name: "James Foster",
      role: "Solo Practitioner",
      image: "/images/person_2.jpg",
      rating: 5,
      text: "Perfect for independent lawyers. Helps me compete with larger firms through automation."
    },
    {
      name: "Maria Garcia",
      role: "Paralegal",
      image: "/images/person_3.jpg",
      rating: 5,
      text: "Streamlines document preparation and review processes. A real time-saver."
    },
    {
      name: "Robert Kim",
      role: "Contract Manager",
      image: "/images/person_4.jpg",
      rating: 5,
      text: "Excellent for contract management and review. The AI suggestions are very helpful."
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-200 to-pink-50 py-12 ">
      <div className="max-w-7xl mx-auto px-2">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
          <p className="text-gray-600 text-xl font-light">Trusted by professionals worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300 h-72 flex flex-col"
            >
              <div className="flex items-center mb-3 flex-shrink-0">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3 border-2 border-blue-100"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-900">{testimonial.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-2 space-x-1 flex-shrink-0">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed overflow-hidden line-clamp-5">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGrid;