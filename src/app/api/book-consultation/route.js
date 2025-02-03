import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { IndividualConsultation, FirmConsultation } from '@/models/caconsultation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// [Previous validation helper functions remain the same]
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

const isValidGST = (gst) => {
  return !gst || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
};

const isValidPAN = (pan) => {
  return !pan || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

const validateField = (value, field, validationRules = {}) => {
  if (validationRules.required && !value) {
    return `${field} is required`;
  }

  if (value) {
    if (validationRules.minLength && value.length < validationRules.minLength) {
      return `${field} must be at least ${validationRules.minLength} characters`;
    }

    if (field === 'email' && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    if (field === 'phone' && !isValidPhone(value)) {
      return 'Please enter a valid 10-digit phone number';
    }

    if (field === 'gstNumber' && !isValidGST(value)) {
      return 'Please enter a valid GST number';
    }

    if (field === 'panNumber' && !isValidPAN(value)) {
      return 'Please enter a valid PAN number';
    }

    if (field === 'preferredDate') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Please enter a valid date';
      }
      
      if (date < new Date()) {
        return 'Preferred date must be in the future';
      }
    }
  }

  return null;
};

// Validation schemas remain the same
const individualValidation = {
  name: { required: true, minLength: 2 },
  email: { required: true },
  phone: { required: true },
  preferredDate: { required: true },
  consultationType: { required: true },
  panNumber: { required: false },
  occupation: { required: false }
};

const firmValidation = {
  firmName: { required: true, minLength: 2 },
  contactPerson: { required: true, minLength: 2 },
  email: { required: true },
  phone: { required: true },
  preferredDate: { required: true },
  consultationType: { required: true },
  companySize: { required: true },
  gstNumber: { required: false },
  registrationNumber: { required: false }
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { clientType, sessionId } = body;

    console.log(body);
    

    // First verify payment status with Stripe
    // if (!sessionId) {
    //   return NextResponse.json(
    //     { successca: false, message: 'Payment session ID is required' },
    //     { status: 400 }
    //   );
    // }

    // Verify payment status
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // if (session.payment_status !== 'paid') {
    //   return NextResponse.json(
    //     { successca: false, message: 'Payment not completed' },
    //     { status: 400 }
    //   );
    // }

    // Validate based on client type
    const validationSchema = clientType === 'Individual' 
      ? individualValidation 
      : firmValidation;

    const errors = [];

    // Validate fields
    for (const [field, rules] of Object.entries(validationSchema)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { successca: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    // Check for existing consultation
    const ConsultationModel = clientType === 'Individual' 
      ? IndividualConsultation 
      : FirmConsultation;

    const existingConsultation = await ConsultationModel.findOne({ 
      email: body.email,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingConsultation) {
      return NextResponse.json(
        { successca: false, message: 'A consultation request already exists' },
        { status: 409 }
      );
    }

    // Create new consultation with payment details
    const consultation = new ConsultationModel({
      ...body,
      status: 'pending',
      paymentVerified: true,
      // paymentDetails: {
      //   sessionId: sessionId,
      //   amount: session.amount_total,
      //   currency: session.currency,
      //   paymentStatus: session.payment_status,
      //   paymentMethod: session.payment_method_types[0]
      // },
      createdAt: new Date()
    });

    // Save to MongoDB
    await consultation.save();

    return NextResponse.json({
      successca: true,
      message: 'Consultation request submitted successfully',
      consultationId: consultation._id,
      scheduledDate: consultation.preferredDate
    });

  } catch (error) {
    console.error('Submission error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { successca: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { successca: false, message: `A consultation with this ${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { successca: false, message: 'Error submitting consultation request. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET endpoint remains the same
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const consultationId = searchParams.get('id');
    const clientType = searchParams.get('type');

    if (!consultationId || !clientType) {
      return NextResponse.json(
        { successca: false, message: 'Consultation ID and type are required' },
        { status: 400 }
      );
    }

    const ConsultationModel = clientType === 'Individual' 
      ? IndividualConsultation 
      : FirmConsultation;

    const consultation = await ConsultationModel.findById(consultationId).select('-__v');

    if (!consultation) {
      return NextResponse.json(
        { successca: false, message: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      successca: true,
      consultation
    });

  } catch (error) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { successca: false, message: 'Error fetching consultation details' },
      { status: 500 }
    );
  }
}