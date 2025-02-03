import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  data: { type: String, required: [true, 'File data is required'] },
  contentType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image/jpeg', 'image/png', 'application/pdf']
  }
}, { _id: false });

const incomeApplicationSchema = new mongoose.Schema({
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
  annualIncome: {
    type: Number,
    required: [true, 'Annual income is required'],
    min: [0, 'Annual income cannot be negative']
  },
  idProofType: {
    type: String,
    required: [true, 'ID proof type is required'],
    enum: {
      values: ['aadhar', 'voter', 'driving', 'ration'],
      message: '{VALUE} is not a valid ID proof type'
    }
  },
  applicationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  photo: { type: fileSchema, required: [true, 'Photo is required'] },
  idProof: { type: fileSchema, required: [true, 'ID proof is required'] },
  addressProof: { type: fileSchema, required: [true, 'Address proof is required'] },
  incomeProof: { type: fileSchema, required: [true, 'Income proof is required'] },
  isPaymentVerifyed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

incomeApplicationSchema.index({ applicationDate: -1 });
incomeApplicationSchema.index({ status: 1 });
incomeApplicationSchema.index({ email: 1 }, { unique: true });
incomeApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

incomeApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024;
  const fileFields = ['photo', 'idProof', 'addressProof', 'incomeProof'];
  
  for (const field of fileFields) {
    if (this[field]?.data) {
      const approximateSize = Math.ceil((this[field].data.length * 3) / 4);
      if (approximateSize > maxSize) {
        next(new Error(`${field} size exceeds maximum allowed size of 5MB`));
        return;
      }
    }
  }
  next();
});

const IncomeApplication = mongoose.models.IncomeApplication || 
  mongoose.model('IncomeApplication', incomeApplicationSchema);

export default IncomeApplication;