import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UdyogApplication from '@/models/udyogApplication';

// Validation helper functions
const isValidAadhaar = (aadhaar) => {
  return /^[0-9]{12}$/.test(aadhaar);
};

const isValidPAN = (pan) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

const isValidIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

const isValidGSTIN = (gstin) => {
  // GSTIN is optional, but if provided should be valid
  if (!gstin) return true;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
};

const validateField = (value, field, validationRules = {}) => {
  if (!value && field !== 'gstin') { // GSTIN is optional
    return `${field} is required`;
  }

  if (validationRules.minLength && value.length < validationRules.minLength) {
    return `${field} must be at least ${validationRules.minLength} characters`;
  }

  switch (field) {
    case 'aadhaarNumber':
      if (!isValidAadhaar(value)) {
        return 'Please enter a valid 12-digit Aadhaar number';
      }
      break;
    case 'panNumber':
      if (!isValidPAN(value)) {
        return 'Please enter a valid PAN number';
      }
      break;
    case 'ifscCode':
      if (!isValidIFSC(value)) {
        return 'Please enter a valid IFSC code';
      }
      break;
    case 'gstin':
      if (value && !isValidGSTIN(value)) {
        return 'Please enter a valid GSTIN';
      }
      break;
    case 'commencementDate':
      const date = new Date(value);
      if (isNaN(date.getTime()) || date > new Date()) {
        return 'Please enter a valid commencement date not in the future';
      }
      break;
  }

  return null;
};

const validateBase64File = (base64String, fieldName) => {
  if (!base64String) {
    return `${fieldName} is required`;
  }

  try {
    const [header] = base64String.split(',');
    if (!header.includes('base64')) {
      return `Invalid ${fieldName} format`;
    }

    // Calculate approximate size
    const approximateSize = Math.ceil((base64String.length * 3) / 4);
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (approximateSize > maxSize) {
      return `${fieldName} size should not exceed 5MB`;
    }

    // Verify file type from base64 header
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const fileType = header.split(':')[1].split(';')[0];
    if (!validTypes.includes(fileType)) {
      return `${fieldName} must be a PDF, JPEG, or PNG file`;
    }

    return null;
  } catch (error) {
    return `Invalid ${fieldName} format`;
  }
};

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the JSON body
    const body = await req.json();

    // Validate required fields
    const fieldValidations = {
      aadhaarNumber: {},
      panNumber: {},
      ifscCode: {},
      gstin: {}, // Optional
      businessAddress: { minLength: 5 },
      commencementDate: {}
    };

    const errors = [];

    // Validate form fields
    for (const [field, rules] of Object.entries(fieldValidations)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    // Validate files
    const requiredFiles = ['addressProof', 'salesBills', 'machineryBills', 'licenses'];
    for (const fileField of requiredFiles) {
      const base64File = body.files[fileField];
      const error = validateBase64File(base64File, fileField);
      if (error) {
        errors.push(error);
      }
    }

    // Return validation errors if any
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    // Extract file data and content types
    const fileData = {};
    for (const fileField of requiredFiles) {
      const base64String = body.files[fileField];
      const [header] = base64String.split(',');
      const contentType = header.split(':')[1].split(';')[0];
      
      fileData[fileField] = {
        data: base64String,
        contentType: contentType
      };
    }

    // Create new application document
    const application = new UdyogApplication({
      aadhaarNumber: body.aadhaarNumber,
      panNumber: body.panNumber,
      ifscCode: body.ifscCode,
      gstin: body.gstin || null,
      businessAddress: body.businessAddress,
      commencementDate: new Date(body.commencementDate),
      applicationDate: new Date(),
      status: 'pending',
      ...fileData
    });

    // Save to MongoDB
    await application.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Udyog registration submitted successfully',
      applicationId: application._id,
      applicationDate: application.applicationDate
    });

  } catch (error) {
    console.error('Submission error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { 
          success: false, 
          message: `A registration with this ${field} already exists` 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error submitting registration. Please try again later.' 
      },
      { status: 500 }
    );
  }
}