import mongoose from 'mongoose';

const foodLicenseSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minLength: [2, 'Business name must be at least 2 characters long']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    minLength: [2, 'Owner name must be at least 2 characters long']
  },
  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true,
    minLength: [5, 'Business address must be at least 5 characters long']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    trim: true,
    lowercase: true
  },
  idProofType: {
    type: String,
    required: [true, 'ID proof type is required'],
    enum: ['aadhar', 'pan', 'voter']
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  photo: {
    data: {
      type: String,
      required: [true, 'Photo is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  idProof: {
    data: {
      type: String,
      required: [true, 'ID proof is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  addressProof: {
    data: {
      type: String,
      required: [true, 'Address proof is required']
    },
    contentType: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
foodLicenseSchema.index({ email: 1 });
foodLicenseSchema.index({ phoneNumber: 1 });
foodLicenseSchema.index({ applicationDate: 1 });
foodLicenseSchema.index({ status: 1 });

const FoodLicenseApplication = mongoose.models.FoodLicenseApplication || 
  mongoose.model('FoodLicenseApplication', foodLicenseSchema);

export default FoodLicenseApplication;