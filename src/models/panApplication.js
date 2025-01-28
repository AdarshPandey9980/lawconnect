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

const panApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters']
  },
  
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        return v && v.getTime() < new Date().getTime();
      },
      message: 'Date of birth must be in the past'
    }
  },

  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [5, 'Address must be at least 5 characters']
  },
  
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    trim: true,
    lowercase: true
  },
  
  identityProofType: {
    type: String,
    required: [true, 'Identity proof type is required'],
    enum: {
      values: ['aadhar', 'voter', 'passport', 'driving', 'ration', 'govt_id', 'bank_certificate', 'gazetted'],
      message: '{VALUE} is not a valid identity proof type'
    }
  },

  dobProofType: {
    type: String,
    required: [true, 'Date of birth proof type is required'],
    enum: {
      values: ['birth_certificate', 'matriculation', 'passport', 'aadhar', 'driving', 'voter_id', 'marriage_cert', 'affidavit'],
      message: '{VALUE} is not a valid date of birth proof type'
    }
  },

  addressProofType: {
    type: String,
    required: [true, 'Address proof type is required'],
    enum: {
      values: ['aadhar', 'voter_id', 'passport', 'driving', 'utility_bill', 'bank_statement', 'property_tax', 'rent_agreement', 'gas_bill'],
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

  dobProof: {
    type: fileSchema,
    required: [true, 'Date of birth proof is required']
  },
  
  addressProof: {
    type: fileSchema,
    required: [true, 'Address proof is required']
  }
}, {
  timestamps: true
});

// Create indexes
panApplicationSchema.index({ applicationDate: -1 });
panApplicationSchema.index({ status: 1 });
panApplicationSchema.index({ email: 1 }, { unique: true });
panApplicationSchema.index({ mobileNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
panApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = ['photo', 'identityProof', 'dobProof', 'addressProof'];
  
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

const PANApplication = mongoose.models.PANApplication || 
  mongoose.model('PANApplication', panApplicationSchema);

export default PANApplication;