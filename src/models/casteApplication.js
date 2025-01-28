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

const casteApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters']
  },

  fatherName: {
    type: String,
    required: [true, 'Father\'s name is required'],
    trim: true,
    minlength: [2, 'Father\'s name must be at least 2 characters']
  },

  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    max: [Date.now, 'Date of birth cannot be in the future']
  },

  caste: {
    type: String,
    required: [true, 'Caste is required'],
    trim: true,
    minlength: [1, 'Caste cannot be empty']
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

  applicationDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  birthCertificate: {
    type: fileSchema,
    required: [true, 'Birth certificate is required']
  },

  residenceProof: {
    type: fileSchema,
    required: [true, 'Residence proof is required']
  },

  rationCard: {
    type: fileSchema,
    required: [true, 'Ration card is required']
  },

  incomeCertificate: {
    type: fileSchema,
    required: [true, 'Income certificate is required']
  },

  parentCasteCertificate: {
    type: fileSchema,
    required: [true, 'Parent\'s caste certificate is required']
  }
}, {
  timestamps: true
});

// Create indexes
casteApplicationSchema.index({ applicationDate: -1 });
casteApplicationSchema.index({ status: 1 });
casteApplicationSchema.index({ email: 1 }, { unique: true });
casteApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
casteApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = ['birthCertificate', 'residenceProof', 'rationCard', 'incomeCertificate', 'parentCasteCertificate'];
  
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

const CasteApplication = mongoose.models.CasteApplication || 
  mongoose.model('CasteApplication', casteApplicationSchema);

export default CasteApplication;