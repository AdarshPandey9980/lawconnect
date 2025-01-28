import mongoose from 'mongoose';

const GSTRegistrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
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
  bankDetails: {
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      match: [/^[0-9]{9,18}$/, 'Please enter a valid account number']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
      uppercase: true
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true
    },
    branchName: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true
    }
  },
  // Document fields
  panCard: {
    data: {
      type: String,
      required: [true, 'PAN card document is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  aadharCard: {
    data: {
      type: String,
      required: [true, 'Aadhar card document is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  photo: {
    data: {
      type: String,
      required: [true, 'Passport size photo is required']
    },
    contentType: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v === 'image/jpeg';
        },
        message: 'Photo must be in JPEG format'
      }
    }
  },
  addressProof: {
    data: {
      type: String,
      required: [true, 'Address proof document is required']
    },
    contentType: {
      type: String,
      required: true
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
  }
}, {
  timestamps: true
});

const GSTRegistration = mongoose.models.GSTRegistration || mongoose.model('GSTRegistration', GSTRegistrationSchema);

export default GSTRegistration;