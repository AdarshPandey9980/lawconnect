import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PANApplication from '@/models/panApplication';

// Validation helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d) && d < new Date();
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

  if (field === 'mobileNumber' && !isValidPhone(value)) {
    return 'Please enter a valid 10-digit mobile number';
  }

  if (field === 'dateOfBirth' && !isValidDate(value)) {
    return 'Please enter a valid date of birth';
  }

  return null;
};

const validateBase64File = (base64String, fieldName) => {
  if (!base64String) {
    return `${fieldName} is required`;
  }

  // Check if it's a valid base64 string
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
    if (fieldName === 'photo' && !header.includes('image/')) {
      return 'Please upload an image file for photo';
    }

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

const validateProofType = (type, validTypes) => {
  return validTypes.includes(type) ? null : 'Invalid document type selected';
};

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the JSON body
    const body = await req.json();

    // Valid document types
    const validIdentityProofTypes = ['aadhar', 'voter', 'passport', 'driving', 'ration', 'govt_id', 'bank_certificate', 'gazetted'];
    const validDOBProofTypes = ['birth_certificate', 'matriculation', 'passport', 'aadhar', 'driving', 'voter_id', 'marriage_cert', 'affidavit'];
    const validAddressProofTypes = ['aadhar', 'voter_id', 'passport', 'driving', 'utility_bill', 'bank_statement', 'property_tax', 'rent_agreement', 'gas_bill'];

    // Validate required fields
    const fieldValidations = {
      fullName: { minLength: 2 },
      address: { minLength: 5 },
      mobileNumber: {},
      email: {},
      dateOfBirth: {}
    };

    const errors = [];

    // Validate form fields
    for (const [field, rules] of Object.entries(fieldValidations)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    // Validate proof types
    const proofTypeErrors = [
      validateProofType(body.identityProofType, validIdentityProofTypes),
      validateProofType(body.dobProofType, validDOBProofTypes),
      validateProofType(body.addressProofType, validAddressProofTypes)
    ].filter(Boolean);

    errors.push(...proofTypeErrors);

    // Validate files
    const requiredFiles = ['photo', 'identityProof', 'dobProof', 'addressProof'];
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
    const application = new PANApplication({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      mobileNumber: body.mobileNumber,
      email: body.email,
      identityProofType: body.identityProofType,
      dobProofType: body.dobProofType,
      addressProofType: body.addressProofType,
      applicationDate: new Date(),
      status: 'pending',
      ...fileData
    });

    // Save to MongoDB
    await application.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'PAN card application submitted successfully',
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
          message: `An application with this ${field} already exists` 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error submitting application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}