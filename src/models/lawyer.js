

// models/Lawyer.js
import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  barCouncilNumber: {
    type: String,
    required: [true, 'Bar Council Number is required'],
    unique: true,
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  },
  fees: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }],
  chamberAddress: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    }
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  practiceAreas: [{
    type: String,
    required: true
  }],
  languages: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalCases: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true
  },
  achievements: [{
    title: String,
    year: Number,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
lawyerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
lawyerSchema.index({ email: 1 }, { unique: true });
lawyerSchema.index({ barCouncilNumber: 1 }, { unique: true });
lawyerSchema.index({ specialization: 1 });
lawyerSchema.index({ practiceAreas: 1 });
lawyerSchema.index({ 'chamberAddress.city': 1 });
lawyerSchema.index({ rating: -1 });
lawyerSchema.index({ winRate: -1 });

const Lawyer = mongoose.models.Lawyer || mongoose.model('Lawyer', lawyerSchema);

export default Lawyer;