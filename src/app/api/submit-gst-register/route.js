import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GSTRegistration from '@/models/gstApplication';

// Validation helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

const isValidIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

const isValidAccountNumber = (accountNumber) => {
  // Basic validation for account number (9-18 digits)
  return /^[0-9]{9,18}$/.test(accountNumber);
};

const validateField = (value, field, validationRules = {}) => {
  if (!value) {
    return `${field} is required`;
  }

  if (validationRules.minLength && value.length < validationRules.minLength) {
    return `${field} must be at least ${validationRules.minLength} characters`;
  }

  if (field === 'email' && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }

  if (field === 'phoneNumber' && !isValidPhone(value)) {
    return 'Please enter a valid 10-digit phone number';
  }

  if (field === 'ifscCode' && !isValidIFSC(value)) {
    return 'Please enter a valid IFSC code';
  }

  if (field === 'accountNumber' && !isValidAccountNumber(value)) {
    return 'Please enter a valid account number';
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
    const maxSize = fieldName === 'photo' ? 100 * 1024 : 5 * 1024 * 1024; // 100KB for photo, 5MB for others

    if (approximateSize > maxSize) {
      return `${fieldName} size should not exceed ${fieldName === 'photo' ? '100KB' : '5MB'}`;
    }

    // Special validation for photo - must be JPEG
    if (fieldName === 'photo' && !header.includes('image/jpeg')) {
      return 'Photo must be in JPEG format';
    }

    // For other documents
    if (fieldName !== 'photo') {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const fileType = header.split(':')[1].split(';')[0];
      if (!validTypes.includes(fileType)) {
        return `${fieldName} must be a PDF, JPEG, or PNG file`;
      }
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
      address: { minLength: 5 },
      phoneNumber: {},
      email: {},
      accountNumber: {},
      ifscCode: {},
      bankName: { minLength: 2 },
      branchName: { minLength: 2 }
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
    const requiredFiles = ['panCard', 'aadharCard', 'photo', 'addressProof'];
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

    // Create new GST registration document
    const registration = new GSTRegistration({
      fullName: body.fullName,
      address: body.address,
      phoneNumber: body.phoneNumber,
      email: body.email,
      bankDetails: {
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        bankName: body.bankName,
        branchName: body.branchName
      },
      applicationDate: new Date(),
      status: 'pending',
      ...fileData
    });

    // Save to MongoDB
    await registration.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'GST Registration application submitted successfully',
      registrationId: registration._id,
      applicationDate: registration.applicationDate
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
        message: 'Error submitting GST registration. Please try again later.' 
      },
      { status: 500 }
    );
  }
}