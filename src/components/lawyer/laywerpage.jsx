"use client";
import React, { useState } from 'react';
import BookingForm from './lawyerbooking';

// Reusable components with proper exports
const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    ref={ref}
    {...props}
  />
));
Button.displayName = "Button";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-white text-gray-900 shadow-sm hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1 ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={`p-6 ${className}`} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

// Icon Components
const Star = React.forwardRef(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
));
Star.displayName = "Star";

const Clock = React.forwardRef(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
));
Clock.displayName = "Clock";

const Award = React.forwardRef(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
));
Award.displayName = "Award";

const lawyers = [
  {
    id: 1,
    name: "Adv. Rajesh Kumar",
    specialization: "Criminal Law",
    icon: "⚖️",
    rating: 4.8,
    fees: "5,000/hr",
    experience: "15 years",
    bio: "Expert in handling criminal cases with a strong track record in the Supreme Court.",
    successRate: "92%",
    availableTime: "Next available: Today, 4:00 PM"
  },
  {
    id: 2,
    name: "Adv. Priya Singh",
    specialization: "Corporate Law",
    icon: "🏢",
    rating: 4.9,
    fees: "8,000/hr",
    experience: "18 years",
    bio: "Specialized in corporate law with expertise in mergers and acquisitions.",
    successRate: "95%",
    availableTime: "Next available: Tomorrow, 11:00 AM"
  },
  {
    id: 3,
    name: "Adv. Arun Mehta",
    specialization: "Family Law",
    icon: "👨‍👩‍👧‍👦",
    rating: 4.7,
    fees: "4,000/hr",
    experience: "20 years",
    bio: "Compassionate family law attorney with expertise in divorce and custody matters.",
    successRate: "89%",
    availableTime: "Next available: Today, 2:30 PM"
  }
];

const FilterButton = React.forwardRef(({ active, onClick, children }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-gray-100 text-gray-900 font-medium shadow-sm'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {children}
  </button>
));
FilterButton.displayName = "FilterButton";

const LawyerDashboard = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const domains = ["Criminal Law", "Corporate Law", "Family Law"];
  
  const filteredLawyers = selectedDomain
    ? lawyers.filter(lawyer => lawyer.specialization === selectedDomain)
    : lawyers;

  const handleBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Find Your Legal Expert
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Connect with top-rated lawyers specialized in various domains
        </p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal Domains</h2>
              <div className="space-y-2">
                {domains.map(domain => (
                  <FilterButton
                    key={domain}
                    active={selectedDomain === domain}
                    onClick={() => setSelectedDomain(domain === selectedDomain ? null : domain)}
                  >
                    {domain}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLawyers.map((lawyer) => (
                <Card key={lawyer.id}>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full text-2xl">
                        {lawyer.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
                        <p className="text-gray-600">{lawyer.specialization}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span>{lawyer.rating} ({lawyer.successRate} success)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>{lawyer.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">{lawyer.fees}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">
                      {lawyer.bio}
                    </p>

                    <div className="text-sm text-gray-500 mb-4">
                      {lawyer.availableTime}
                    </div>

                    <Button 
                      className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 py-3 px-4 rounded-lg font-medium shadow-sm hover:shadow group"
                      onClick={() => handleBooking(lawyer)}
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        Book Consultation →
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingForm 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedLawyer={selectedLawyer}
      />
    </div>
  );
};

export default LawyerDashboard;