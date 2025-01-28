import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PassportApplication from '@/models/passportApplication';

// Validation helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
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

  if (field === 'dateOfBirth') {
    if (!isValidDate(value)) {
      return 'Please enter a valid date of birth';
    }
    
    const dob = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    // Basic age validation
    if (age < 0) {
      return 'Date of birth cannot be in the future';
    }
    if (age < 18) {
      return 'Applicant must be at least 18 years old';
    }
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
      return 'Please upload an image file for passport photo';
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

const validateDocumentTypes = (body) => {
  const validPhotoIdTypes = ['aadhar', 'voter', 'pancard', 'driving'];
  const validAddressProofTypes = ['aadhar', 'utility', 'bank', 'voter', 'rental', 'gas'];
  const validDobProofTypes = ['aadhar', 'pancard', 'birth', 'driving'];
  
  const errors = [];
  
  if (!validPhotoIdTypes.includes(body.photoIdType)) {
    errors.push('Invalid photo ID type selected');
  }
  
  if (!validAddressProofTypes.includes(body.addressProofType)) {
    errors.push('Invalid address proof type selected');
  }
  
  if (!validDobProofTypes.includes(body.dobProofType)) {
    errors.push('Invalid date of birth proof type selected');
  }
  
  return errors;
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
      dateOfBirth: {},
      address: { minLength: 5 },
      phoneNumber: {},
      email: {},
      photoIdType: {},
      addressProofType: {},
      dobProofType: {},
      hasOldPassport: {}
    };

    const errors = [];

    // Validate form fields
    for (const [field, rules] of Object.entries(fieldValidations)) {
      const error = validateField(body[field], field, rules);
      if (error) {
        errors.push(error);
      }
    }

    // Validate document types
    errors.push(...validateDocumentTypes(body));

    // Validate files
    const requiredFiles = ['photo', 'photoId', 'addressProof', 'dobProof'];
    
    // Add old passport to required files if applicant has one
    if (body.hasOldPassport === 'yes') {
      requiredFiles.push('oldPassport');
    }

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
    const application = new PassportApplication({
      fullName: body.fullName,
      dateOfBirth: new Date(body.dateOfBirth),
      address: body.address,
      phoneNumber: body.phoneNumber,
      email: body.email,
      photoIdType: body.photoIdType,
      addressProofType: body.addressProofType,
      dobProofType: body.dobProofType,
      hasOldPassport: body.hasOldPassport,
      applicationDate: new Date(),
      status: 'pending',
      ...fileData
    });

    // Save to MongoDB
    await application.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Passport application submitted successfully',
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
        message: 'Error submitting passport application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}