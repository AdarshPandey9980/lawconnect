// models/GazetteApplication.js

import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  data: {
    type: String,
    required: [true, 'File data is required']
  },
  contentType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image/jpeg', 'image/png', 'application/pdf']
  }
}, { _id: false });

const gazetteApplicationSchema = new mongoose.Schema({
  currentName: {
    type: String,
    required: [true, 'Current name is required'],
    trim: true,
    minlength: [2, 'Current name must be at least 2 characters']
  },
  
  proposedName: {
    type: String,
    required: [true, 'Proposed name is required'],
    trim: true,
    minlength: [2, 'Proposed name must be at least 2 characters']
  },

  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [5, 'Address must be at least 5 characters']
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

  reason: {
    type: String,
    required: [true, 'Reason for application is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters']
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

  // Required Documents
  affidavit: {
    type: fileSchema,
    required: [true, 'Notarized affidavit is required']
  },

  idProof: {
    type: fileSchema,
    required: [true, 'ID proof is required']
  },

  addressProof: {
    type: fileSchema,
    required: [true, 'Address proof is required']
  },

  newspaperAds: {
    type: fileSchema,
    required: [true, 'Newspaper advertisements are required']
  },

  applicationForm: {
    type: fileSchema,
    required: [true, 'Application form is required']
  },

  paymentProof: {
    type: fileSchema,
    required: [true, 'Payment proof is required']
  },

  coverLetter: {
    type: fileSchema,
    required: [true, 'Cover letter is required']
  },

  photos: {
    type: fileSchema,
    required: [true, 'Passport size photographs are required']
  },

  digitalCD: {
    type: fileSchema,
    required: [true, 'Digital CD (soft copy) is required']
  }
}, {
  timestamps: true
});

// Create indexes
gazetteApplicationSchema.index({ applicationDate: -1 });
gazetteApplicationSchema.index({ status: 1 });
gazetteApplicationSchema.index({ email: 1 }, { unique: true });
gazetteApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
gazetteApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = [
    'affidavit',
    'idProof',
    'addressProof',
    'newspaperAds',
    'applicationForm',
    'paymentProof',
    'coverLetter',
    'photos',
    'digitalCD'
  ];
  
  for (const field of fileFields) {
    if (this[field]?.data) {
      // Calculate approximate size of base64 data
      const approximateSize = Math.ceil((this[field].data.length * 3) / 4);
      if (approximateSize > maxSize) {
        next(new Error(`${field} size exceeds maximum allowed size of 5MB`));
        return;
      }
    }
  }
  next();
});

const GazetteApplication = mongoose.models.GazetteApplication || 
  mongoose.model('GazetteApplication', gazetteApplicationSchema);

export default GazetteApplication;