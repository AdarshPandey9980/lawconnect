// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import CompanyRegistration from '@/models/companyApplication';

// // Validation helper functions
// const validateCompanyName = (name) => {
//   if (!name) return 'Company name is required';
//   if (name.length < 3) return 'Company name must be at least 3 characters';
//   if (!/^[a-zA-Z0-9\s.-]+$/.test(name)) return 'Company name contains invalid characters';
//   return null;
// };

// const validateCompanyType = (type) => {
//   const validTypes = ['private', 'public', 'llp', 'opc'];
//   if (!type) return 'Company type is required';
//   if (!validTypes.includes(type)) return 'Invalid company type selected';
//   return null;
// };

// const validateAuthorizedCapital = (capital) => {
//   if (!capital) return 'Authorized capital is required';
//   const amount = Number(capital);
//   if (isNaN(amount) || amount <= 0) return 'Please enter a valid amount';
//   if (amount < 100000) return 'Minimum authorized capital should be ₹1,00,000';
//   return null;
// };

// const validateAddress = (address) => {
//   if (!address) return 'Registered address is required';
//   if (address.length < 10) return 'Please enter a complete registered address';
//   return null;
// };

// const validateBusinessActivity = (activity) => {
//   if (!activity) return 'Business activity is required';
//   if (activity.length < 5) return 'Please provide more detail about the business activity';
//   return null;
// };

// const validateBase64File = (base64String, fieldName) => {
//   if (!base64String) {
//     return `${fieldName} is required`;
//   }

//   try {
//     const [header] = base64String.split(',');
//     if (!header.includes('base64')) {
//       return `Invalid ${fieldName} format`;
//     }

//     // Calculate approximate size (5MB limit)
//     const approximateSize = Math.ceil((base64String.length * 3) / 4);
//     const maxSize = 5 * 1024 * 1024;

//     if (approximateSize > maxSize) {
//       return `${fieldName} size should not exceed 5MB`;
//     }

//     // Get file type from base64 header
//     const fileType = header.split(':')[1].split(';')[0];
    
//     // Special validation for director photos (images only)
//     if (fieldName === 'directorPhotos' && !fileType.startsWith('image/')) {
//       return 'Director photos must be image files';
//     }
    

//     // For other documents, accept PDF and images
//     const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//     if (!validTypes.includes(fileType)) {
//       return `${fieldName} must be a PDF, JPEG, or PNG file`;
//     }

//     return null;
//   } catch (error) {
//     console.error(`File validation error for ${fieldName}:`, error);
//     return `Invalid ${fieldName} format`;
//   }
// };

// export async function POST(req) {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     // Parse request body
//     const body = await req.json();

//     // Validate basic fields
//     const errors = [];
    
//     const basicValidations = {
//       companyName: validateCompanyName(body.companyName),
//       companyType: validateCompanyType(body.companyType),
//       businessActivity: validateBusinessActivity(body.businessActivity),
//       authorizedCapital: validateAuthorizedCapital(body.authorizedCapital),
//       registeredAddress: validateAddress(body.registeredAddress)
//     };

//     // Collect basic field validation errors
//     Object.entries(basicValidations).forEach(([field, error]) => {
//       if (error) errors.push(error);
//     });

//     // Validate required documents
//     const requiredFiles = [
//       'panCard',
//       'addressProof',
//       'officeProof',
//       'utilityBill',
//       'leaseAgreement',
//       'nocOwner',
//       'directorPhotos',
//       'dsc'
//     ];

//     // Validate each required file
//     for (const fileField of requiredFiles) {
//       const base64File = body.files[fileField];
//       const error = validateBase64File(base64File, fileField);
//       if (error) {
//         errors.push(error);
//       }
//     }

//     // Return if validation errors exist
//     if (errors.length > 0) {
//       return NextResponse.json(
//         { success: false, message: errors.join(', ') },
//         { status: 400 }
//       );
//     }

//     // Process file data
//     const fileData = {};
//     for (const fileField of requiredFiles) {
//       const base64String = body.files[fileField];
//       const [header] = base64String.split(',');
//       const contentType = header.split(':')[1].split(';')[0];
      
//       fileData[fileField] = {
//         data: base64String,
//         contentType: contentType
//       };
//     }

//     // Create new registration document
//     const registration = new CompanyRegistration({
//       companyName: body.companyName,
//       companyType: body.companyType,
//       businessActivity: body.businessActivity,
//       authorizedCapital: Number(body.authorizedCapital),
//       registeredAddress: body.registeredAddress,
//       registrationDate: new Date(),
//       status: 'pending',
//       files: fileData
//     });

//     // Save to database
//     await registration.save();

//     // Return success response
//     return NextResponse.json({
//       success: true,
//       message: 'Company registration submitted successfully',
//       registrationId: registration._id,
//       registrationDate: registration.registrationDate
//     });

//   } catch (error) {
//     console.error('Registration error:', error);

//     // Handle MongoDB validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return NextResponse.json(
//         { success: false, message: errors.join(', ') },
//         { status: 400 }
//       );
//     }

//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: `A company with this ${field} already exists` 
//         },
//         { status: 409 }
//       );
//     }

//     // Handle all other errors
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Error processing registration. Please try again later.' 
//       },
//       { status: 500 }
//     );
//   }
// }