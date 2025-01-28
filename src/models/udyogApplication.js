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

const udyogApplicationSchema = new mongoose.Schema({
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhaar number'],
    unique: true
  },

  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    match: [/^[A-Z]{5}\d{4}[A-Z]$/, 'Please enter a valid PAN number'],
    uppercase: true,
    trim: true,
    unique: true
  },

  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code'],
    uppercase: true,
    trim: true
  },

  gstin: {
    type: String,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GSTIN'],
    uppercase: true,
    trim: true,
    sparse: true,
    unique: true
  },

  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true,
    minlength: [5, 'Business address must be at least 5 characters']
  },

  commencementDate: {
    type: Date,
    required: [true, 'Date of commencement is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Commencement date cannot be in the future'
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

  addressProof: {
    type: fileSchema,
    required: [true, 'Business address proof is required']
  },

  salesBills: {
    type: fileSchema,
    required: [true, 'Sales and purchase bills are required']
  },

  machineryBills: {
    type: fileSchema,
    required: [true, 'Machinery bills are required']
  },

  licenses: {
    type: fileSchema,
    required: [true, 'Business licenses are required']
  }
}, {
  timestamps: true
});

// Create indexes
udyogApplicationSchema.index({ applicationDate: -1 });
udyogApplicationSchema.index({ status: 1 });
udyogApplicationSchema.index({ commencementDate: 1 });
udyogApplicationSchema.index({ aadhaarNumber: 1 }, { unique: true });
udyogApplicationSchema.index({ panNumber: 1 }, { unique: true });
udyogApplicationSchema.index({ gstin: 1 }, { unique: true, sparse: true });

// Add validation for maximum file size (5MB)
udyogApplicationSchema.pre('save', function(next) {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const fileFields = ['addressProof', 'salesBills', 'machineryBills', 'licenses'];

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

const UdyogApplication = mongoose.models.UdyogApplication || 
  mongoose.model('UdyogApplication', udyogApplicationSchema);

export default UdyogApplication;