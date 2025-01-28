import mongoose from 'mongoose';

const domicileApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  currentAddress: {
    type: String,
    required: [true, 'Current address is required'],
    trim: true
  },
  previousAddress: {
    type: String,
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
  stayDuration: {
    type: Number,
    required: [true, 'Duration of stay is required'],
    min: [0, 'Duration must be a positive number']
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: {
      values: ['education', 'employment', 'legal', 'other'],
      message: '{VALUE} is not a valid purpose'
    }
  },
  idProofType: {
    type: String,
    required: [true, 'ID proof type is required'],
    enum: {
      values: ['pan', 'aadhar', 'ration', 'passport', 'driving'],
      message: '{VALUE} is not a valid ID proof type'
    }
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
  residenceProof: {
    data: {
      type: String,
      required: [true, 'Residence proof is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  schoolCertificate: {
    data: {
      type: String,
      required: [true, 'School certificate is required']
    },
    contentType: {
      type: String,
      required: true
    }
  },
  affidavit: {
    data: {
      type: String,
      required: [true, 'Affidavit is required']
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

const DomicileApplication = mongoose.models.DomicileApplication || 
  mongoose.model('DomicileApplication', domicileApplicationSchema);

export default DomicileApplication;