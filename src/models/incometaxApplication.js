import mongoose from 'mongoose';

const taxReturnSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    unique: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'],
    uppercase: true,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhaar number'],
    trim: true
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank account number is required'],
    trim: true
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
    uppercase: true,
    trim: true
  },
  assessmentYear: {
    type: String,
    required: [true, 'Assessment year is required'],
    enum: ['2024-25', '2023-24', '2022-23']
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  // File documents
  form16: {
    data: {
      type: String,
      required: [true, 'Form 16 is required']
    },
    contentType: String
  },
  panCard: {
    data: {
      type: String,
      required: [true, 'PAN card document is required']
    },
    contentType: String
  },
  aadhaarCard: {
    data: {
      type: String,
      required: [true, 'Aadhaar card document is required']
    },
    contentType: String
  },
  bankStatement: {
    data: {
      type: String,
      required: [true, 'Bank statement is required']
    },
    contentType: String
  },
  investmentProofs: {
    data: {
      type: String,
      required: [true, 'Investment proofs are required']
    },
    contentType: String
  },
  rentReceipts: {
    data: {
      type: String,
      required: [true, 'Rent receipts are required']
    },
    contentType: String
  },
  homeLoanCertificate: {
    data: {
      type: String,
      required: [true, 'Home loan certificate is required']
    },
    contentType: String
  },
  otherIncome: {
    data: {
      type: String,
      required: [true, 'Other income proof is required']
    },
    contentType: String
  }
}, {
  timestamps: true
});

// Compound index for PAN number and assessment year to prevent duplicate submissions
taxReturnSchema.index({ panNumber: 1, assessmentYear: 1 }, { unique: true });

const TaxReturn = mongoose.models.TaxReturn || mongoose.model('TaxReturn', taxReturnSchema);

export default TaxReturn;