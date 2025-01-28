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

const passportApplicationSchema = new mongoose.Schema({
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
      validator: function(value) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18 && value <= today;
      },
      message: 'Applicant must be at least 18 years old and date cannot be in the future'
    }
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
  
  photoIdType: {
    type: String,
    required: [true, 'Photo ID type is required'],
    enum: {
      values: ['aadhar', 'voter', 'pancard', 'driving'],
      message: '{VALUE} is not a valid photo ID type'
    }
  },

  addressProofType: {
    type: String,
    required: [true, 'Address proof type is required'],
    enum: {
      values: ['aadhar', 'utility', 'bank', 'voter', 'rental', 'gas'],
      message: '{VALUE} is not a valid address proof type'
    }
  },

  dobProofType: {
    type: String,
    required: [true, 'Date of birth proof type is required'],
    enum: {
      values: ['aadhar', 'pancard', 'birth', 'driving'],
      message: '{VALUE} is not a valid date of birth proof type'
    }
  },

  hasOldPassport: {
    type: String,
    required: [true, 'Please specify if you have an old passport'],
    enum: {
      values: ['yes', 'no'],
      message: '{VALUE} is not a valid option'
    }
  },
  
  applicationDate: {
    type: Date,
    default: Date.now
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'additional-info-required'],
    default: 'pending'
  },
  
  photo: {
    type: fileSchema,
    required: [true, 'Passport size photo is required'],
    validate: {
      validator: function(value) {
        return value.contentType.startsWith('image/');
      },
      message: 'Passport photo must be an image file'
    }
  },
  
  photoId: {
    type: fileSchema,
    required: [true, 'Photo ID proof is required']
  },
  
  addressProof: {
    type: fileSchema,
    required: [true, 'Address proof is required']
  },
  
  dobProof: {
    type: fileSchema,
    required: [true, 'Date of birth proof is required']
  },
  
  oldPassport: {
    type: fileSchema,
    required: function() {
      return this.hasOldPassport === 'yes';
    }
  }
}, {
  timestamps: true
});

// Create indexes
passportApplicationSchema.index({ applicationDate: -1 });
passportApplicationSchema.index({ status: 1 });
passportApplicationSchema.index({ email: 1 }, { unique: true });
passportApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
passportApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = ['photo', 'photoId', 'addressProof', 'dobProof'];
  
  // Add oldPassport to validation if it exists
  if (this.hasOldPassport === 'yes') {
    fileFields.push('oldPassport');
  }
  
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

const PassportApplication = mongoose.models.PassportApplication || 
  mongoose.model('PassportApplication', passportApplicationSchema);

export default PassportApplication;