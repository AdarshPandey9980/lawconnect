"use client";

import { Calculator, FileText, MessageSquare, Pen, Shield, Video } from 'lucide-react';
import Image from "next/image";

function ServiceCard({ title, icon: Icon, image, iconColor, description }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 " />
      </div>
      <div className="absolute left-6 top-6">
        <div className={`rounded-2xl ${
          iconColor === "green" 
            ? "bg-emerald-50/90 hover:bg-emerald-50" 
            : "bg-blue-50/90 hover:bg-blue-50"
        } p-3 backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}>
          <Icon className={`h-7 w-7 ${
            iconColor === "green" ? "text-purple-600" : "text-purple-600"
          }`} />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const services = [
    {
      title: "Legal Consultations",
      icon: Pen,
      image: "/images/b.svg",
      iconColor: "blue",
      description: "Connect with experienced lawyers for professional legal advice and personalized solutions."
    },
    {
      title: "Document Generation",
      icon: FileText,
      image: "/images/c.jpg",
      iconColor: "green",
      description: "AI-powered legal document creation and automation for faster, more accurate documentation."
    },
    {
      title: "Virtual Court",
      icon: Video,
      image: "/images/d.avif",
      iconColor: "blue",
      description: "Attend court sessions remotely with secure, high-quality video conferencing solutions."
    },
    {
      title: "CA Services",
      icon: Calculator,
      image: "/images/e.webp",
      iconColor: "green",
      description: "Comprehensive chartered accountant services for businesses of all sizes."
    },
    {
      title: "AI Assistant",
      icon: MessageSquare,
      image: "/images/f.avif",
      iconColor: "blue",
      description: "24/7 AI-powered legal assistance and guidance for immediate support."
    },
    {
      title: "Compliance",
      icon: Shield,
      image: "/images/g.png",
      iconColor: "green",
      description: "Stay compliant with automated legal updates and timely compliance reminders."
    }
  ];

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Know About Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Best Services
            </span>
          </h2>
          <div className="max-w-2xl">
            <p className="text-lg text-gray-600 sm:text-xl">
              We provide comprehensive legal solutions to help protect your rights and interests, 
              backed by cutting-edge technology and expert professionals.
            </p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              icon={service.icon}
              image={service.image}
              iconColor={service.iconColor}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;