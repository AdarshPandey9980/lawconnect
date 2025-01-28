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

const nonCreamyApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters']
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
  
  caste: {
    type: String,
    required: [true, 'Caste is required'],
    trim: true,
    minlength: [2, 'Caste must be at least 2 characters']
  },
  
  identityProofType: {
    type: String,
    required: [true, 'Identity proof type is required'],
    enum: {
      values: ['aadhar', 'voter', 'passport', 'driving', 'pan', 'rsby', 'mnrega'],
      message: '{VALUE} is not a valid identity proof type'
    }
  },

  addressProofType: {
    type: String,
    required: [true, 'Address proof type is required'],
    enum: {
      values: ['aadhar', 'voter', 'passport', 'driving', 'electricity', 'water', 'ration', 'property', 'telephone'],
      message: '{VALUE} is not a valid address proof type'
    }
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
    type: fileSchema,
    required: [true, 'Photo is required']
  },
  
  identityProof: {
    type: fileSchema,
    required: [true, 'Identity proof is required']
  },
  
  addressProof: {
    type: fileSchema,
    required: [true, 'Address proof is required']
  },

  casteProof: {
    type: fileSchema,
    required: [true, 'Caste proof is required']
  },
  
  incomeProof: {
    type: fileSchema,
    required: [true, 'Income proof is required']
  }
}, {
  timestamps: true
});

// Create indexes
nonCreamyApplicationSchema.index({ applicationDate: -1 });
nonCreamyApplicationSchema.index({ status: 1 });
nonCreamyApplicationSchema.index({ email: 1 }, { unique: true });
nonCreamyApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
nonCreamyApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = ['photo', 'identityProof', 'addressProof', 'casteProof', 'incomeProof'];
  
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

const NonCreamyApplication = mongoose.models.NonCreamyApplication || 
  mongoose.model('NonCreamyApplication', nonCreamyApplicationSchema);

export default NonCreamyApplication;