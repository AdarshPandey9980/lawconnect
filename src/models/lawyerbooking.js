// models/LawyerBooking.js
import mongoose from 'mongoose';

const lawyerBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  date: {
    type: Date,
    required: [true, 'Consultation date is required']
  },
  time: {
    type: String,
    required: [true, 'Consultation time is required']
  },
  caseDescription: {
    type: String,
    required: [true, 'Case description is required'],
    trim: true
  },
  lawyerId: {
    type: Number,
    required: [true, 'Lawyer ID is required']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  isPaymentVerified: {
    type: Boolean,
    default: false
  },
  paymentSessionId: {
    type: String
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  }
});

// Create indexes
lawyerBookingSchema.index({ email: 1 });
lawyerBookingSchema.index({ lawyerId: 1 });
lawyerBookingSchema.index({ date: 1, time: 1, lawyerId: 1 }, { unique: true });

const LawyerBooking = mongoose.models.LawyerBooking || 
  mongoose.model('LawyerBooking', lawyerBookingSchema);

export default LawyerBooking;