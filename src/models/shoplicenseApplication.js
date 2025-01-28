import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  data: {
    type: String,
    required: [true, 'File data is required']
  },
  contentType: {
    type: String,
    required: [true, 'File content type is required']
  }
});

const shopLicenseSchema = new mongoose.Schema({
  // Business Information
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    minlength: [2, 'Owner name must be at least 2 characters long']
  },
  businessAddress: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true,
    minlength: [5, 'Business address must be at least 5 characters long']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: {
      values: ['proprietorship', 'partnership', 'private-limited'],
      message: '{VALUE} is not a valid business type'
    }
  },

  // Required Documents
  aadharCard: {
    type: fileSchema,
    required: [true, 'Aadhar card is required']
  },
  panCard: {
    type: fileSchema,
    required: [true, 'PAN card is required']
  },
  photo: {
    type: fileSchema,
    required: [true, 'Photo is required']
  },
  addressProof: {
    type: fileSchema,
    required: [true, 'Address proof is required']
  },
  rentAgreement: {
    type: fileSchema,
    required: [true, 'Rent agreement/NOC is required']
  },

  // Application Status
  status: {
    type: String,
    required: true,
    enum: {
      values: ['pending', 'reviewing', 'approved', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true
  },
  approvalDate: {
    type: Date
  },
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true  // Allows null values while maintaining uniqueness
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for common queries
shopLicenseSchema.index({ businessName: 1 });
shopLicenseSchema.index({ status: 1 });
shopLicenseSchema.index({ applicationDate: 1 });
shopLicenseSchema.index({ licenseNumber: 1 }, { unique: true, sparse: true });

// Method to generate license number when application is approved
shopLicenseSchema.methods.generateLicenseNumber = async function() {
  if (this.status === 'approved' && !this.licenseNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      status: 'approved',
      approvalDate: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      }
    });
    
    this.licenseNumber = `SL${year}${(count + 1).toString().padStart(4, '0')}`;
    this.approvalDate = new Date();
  }
};

// Pre-save middleware to generate license number
shopLicenseSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved') {
    await this.generateLicenseNumber();
  }
  next();
});

// Create the model if it doesn't exist, otherwise use the existing model
const ShopLicenseApplication = mongoose.models.ShopLicenseApplication || 
  mongoose.model('ShopLicenseApplication', shopLicenseSchema);

export default ShopLicenseApplication;