// app/api/submit-lawyer-booking/route.js
import connectDB from '@/lib/mongodb';
import LawyerBooking from '@/models/lawyerbooking';
import { NextResponse } from 'next/server';

// Validation helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

const validateField = (value, field, validationRules = {}) => {
  if (!value) {
    return `${field} is required`;
  }

  if (validationRules.minLength && value.length < validationRules.minLength) {
    return `${field} must be at least ${validationRules.minLength} characters`;
  }

  if (field === 'email' && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }

  if (field === 'phone' && !isValidPhone(value)) {
    return 'Please enter a valid 10-digit phone number';
  }

  if (field === 'consultationFee') {
    const fee = Number(value);
    if (isNaN(fee) || fee <= 0) {
      return 'Please enter a valid consultation fee';
    }
  }

  return null;
};

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the JSON body
    const body = await req.json();

    console.log("lawyer",body);
    

    // Validate required fields
    const fieldValidations = {
      name: {  },
      email: {},
      phone: {},
      date: {},
      time: {},
      caseDescription: { },
      lawyerId: {},
      consultationFee: {}
    };

    const errors = [];

    // Validate form fields
    for (const [field, rules] of Object.entries(fieldValidations)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    // Create new booking document
    const booking = new LawyerBooking({
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: new Date(body.date),
      time: body.time,
      caseDescription: body.caseDescription,
      lawyerId: body.lawyerId,
      consultationFee: Number(body.consultationFee),
      bookingDate: new Date(),
      status: 'pending',
      caseType: body.caseType || 'general',
      priority: body.priority || 'normal',
      notes: body.notes || ''
    });

    console.log(booking);
    

    // Save to MongoDB
    await booking.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking submitted successfully',
      bookingId: booking._id,
      bookingDate: booking.bookingDate
    });

  } catch (error) {
    console.error('Booking submission error:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error submitting booking. Please try again later.' 
      },
      { status: 500 }
    );
  }
}