import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TaxReturn from '@/models/incometaxApplication';

// Validation helper functions
const isValidPAN = (pan) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

const isValidAadhaar = (aadhaar) => {
  return /^[0-9]{12}$/.test(aadhaar);
};

const isValidIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

const validateField = (value, field, validationRules = {}) => {
  if (!value) {
    return `${field} is required`;
  }

  if (validationRules.minLength && value.length < validationRules.minLength) {
    return `${field} must be at least ${validationRules.minLength} characters`;
  }

  if (field === 'panNumber' && !isValidPAN(value)) {
    return 'Please enter a valid PAN number';
  }

  if (field === 'aadhaarNumber' && !isValidAadhaar(value)) {
    return 'Please enter a valid 12-digit Aadhaar number';
  }

  if (field === 'ifscCode' && !isValidIFSC(value)) {
    return 'Please enter a valid IFSC code';
  }

  if (field === 'assessmentYear' && !['2024-25', '2023-24', '2022-23'].includes(value)) {
    return 'Please select a valid assessment year';
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
      fullName: { minLength: 2 },
      panNumber: {},
      aadhaarNumber: {},
      bankAccountNumber: { minLength: 5 },
      ifscCode: {},
      assessmentYear: {}
    };

    const errors = [];

    // Validate form fields
    for (const [field, rules] of Object.entries(fieldValidations)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    // Required files for tax return
    const requiredFiles = [
      'form16',
      'panCard',
      'aadhaarCard',
      'bankStatement',
      'investmentProofs',
      'rentReceipts',
      'homeLoanCertificate',
      'otherIncome'
    ];

    // Validate files
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

    // Create new tax return document
    const taxReturn = new TaxReturn({
      fullName: body.fullName,
      panNumber: body.panNumber,
      aadhaarNumber: body.aadhaarNumber,
      bankAccountNumber: body.bankAccountNumber,
      ifscCode: body.ifscCode,
      assessmentYear: body.assessmentYear,
      submissionDate: new Date(),
      status: 'pending',
      ...fileData
    });

    // Save to MongoDB
    await taxReturn.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Tax return submitted successfully',
      returnId: taxReturn._id,
      submissionDate: taxReturn.submissionDate
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
          message: `A tax return with this ${field} already exists for the selected assessment year` 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error submitting tax return. Please try again later.' 
      },
      { status: 500 }
    );
  }
}