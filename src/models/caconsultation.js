// models/caConsultation.js
import mongoose from 'mongoose';

// Base schema fields shared between Individual and Firm consultations
const baseFields = {
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Please enter a valid 10-digit phone number'
    }
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Preferred date must be in the future'
    }
  },
  consultationType: {
    type: String,
    required: [true, 'Consultation type is required'],
    enum: {
      values: ['Tax', 'Audit', 'Compliance', 'Other'],
      message: 'Invalid consultation type'
    }
  },
  message: {
    type: String,
    trim: true,
    maxLength: [500, 'Message cannot be longer than 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'completed', 'cancelled'],
      message: 'Invalid status'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
};

// Individual consultation schema
const individualSchema = new mongoose.Schema({
  ...baseFields,
  clientType: {
    type: String,
    default: 'Individual',
    immutable: true,
    enum: ['Individual']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters long'],
    maxLength: [50, 'Name cannot be longer than 50 characters']
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid PAN number'
    }
  },
  occupation: {
    type: String,
    trim: true,
    maxLength: [50, 'Occupation cannot be longer than 50 characters']
  }
});

// Firm consultation schema
const firmSchema = new mongoose.Schema({
  ...baseFields,
  clientType: {
    type: String,
    default: 'Firm',
    immutable: true,
    enum: ['Firm']
  },
  firmName: {
    type: String,
    required: [true, 'Firm name is required'],
    trim: true,
    minLength: [2, 'Firm name must be at least 2 characters long'],
    maxLength: [100, 'Firm name cannot be longer than 100 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true,
    minLength: [2, 'Contact person name must be at least 2 characters long'],
    maxLength: [50, 'Contact person name cannot be longer than 50 characters']
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: {
      values: ['1-10', '11-50', '51-200', '201-500', '500+'],
      message: 'Invalid company size'
    }
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid GST number'
    }
  },
  registrationNumber: {
    type: String,
    trim: true,
    maxLength: [50, 'Registration number cannot be longer than 50 characters']
  }
});

// Add timestamps to both schemas
individualSchema.set('timestamps', true);
firmSchema.set('timestamps', true);

// Pre-save middleware to update 'updatedAt'
const updateTimestamp = function(next) {
  this.updatedAt = new Date();
  next();
};

individualSchema.pre('save', updateTimestamp);
firmSchema.pre('save', updateTimestamp);

// Virtual for full consultation reference
individualSchema.virtual('consultationRef').get(function() {
  return `IND-${this._id}`;
});

firmSchema.virtual('consultationRef').get(function() {
  return `FIRM-${this._id}`;
});

// Ensure virtuals are included in JSON conversion
individualSchema.set('toJSON', { virtuals: true });
firmSchema.set('toJSON', { virtuals: true });

// Create or get models
const IndividualConsultation = mongoose.models.IndividualConsultation || 
  mongoose.model('IndividualConsultation', individualSchema);

const FirmConsultation = mongoose.models.FirmConsultation || 
  mongoose.model('FirmConsultation', firmSchema);

export { IndividualConsultation, FirmConsultation };