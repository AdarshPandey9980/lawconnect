// import mongoose from 'mongoose';

// // Supported file types configuration
// const FILE_TYPES = {
//   IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
//   DOCUMENT: [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//   ],
//   ALL: [
//     'image/jpeg',
//     'image/png',
//     'image/webp',
//     'image/heic',
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//   ]
// };

// const fileSchema = new mongoose.Schema({
//   data: {
//     type: String,
//     required: [true, 'File data is required']
//   },
//   contentType: {
//     type: String,
//     required: [true, 'File type is required'],
//     enum: {
//       values: FILE_TYPES.ALL,
//       message: 'Unsupported file type. Please upload a valid file.'
//     }
//   },
//   fileName: {
//     type: String,
//     required: [true, 'File name is required']
//   },
//   fileSize: {
//     type: Number,
//     required: [true, 'File size is required'],
//     max: [10 * 1024 * 1024, 'File size cannot exceed 10MB']
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   }
// }, { _id: false });

// // Custom validators for specific document types
// const fileValidators = {
//   imageOnly: function(file) {
//     return FILE_TYPES.IMAGE.includes(file.contentType);
//   },
//   documentOnly: function(file) {
//     return FILE_TYPES.DOCUMENT.includes(file.contentType);
//   }
// };

// const directorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Director name is required'],
//     trim: true,
//     minlength: [2, 'Director name must be at least 2 characters']
//   },
//   nationality: {
//     type: String,
//     required: [true, 'Nationality is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     trim: true,
//     lowercase: true,
//     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
//   },
//   photo: {
//     type: fileSchema,
//     required: [true, 'Director photo is required'],
//     validate: [
//       {
//         validator: fileValidators.imageOnly,
//         message: 'Please upload a valid image file for director photo'
//       }
//     ]
//   },
//   identityProof: {
//     type: fileSchema,
//     required: [true, 'Identity proof is required']
//   }
// }, { _id: false });

// const companyRegistrationSchema = new mongoose.Schema({
//   // Basic company information remains the same
//   companyName: {
//     type: String,
//     required: [true, 'Company name is required'],
//     trim: true,
//     minlength: [3, 'Company name must be at least 3 characters'],
//     match: [/^[a-zA-Z0-9\s.-]+$/, 'Company name contains invalid characters'],
//     unique: true
//   },
//   companyType: {
//     type: String,
//     required: [true, 'Company type is required'],
//     enum: {
//       values: ['private', 'public', 'llp', 'opc'],
//       message: '{VALUE} is not a valid company type'
//     }
//   },
//   businessActivity: {
//     type: String,
//     required: [true, 'Business activity is required'],
//     trim: true,
//     minlength: [5, 'Business activity must be at least 5 characters']
//   },
//   authorizedCapital: {
//     type: Number,
//     required: [true, 'Authorized capital is required'],
//     min: [100000, 'Minimum authorized capital should be ₹1,00,000']
//   },
//   registeredAddress: {
//     type: String,
//     required: [true, 'Registered office address is required'],
//     trim: true,
//     minlength: [10, 'Please enter a complete registered address']
//   },
  
//   // Directors information
//   directors: {
//     type: [directorSchema],
//     required: [true, 'At least one director is required'],
//     validate: {
//       validator: function(directors) {
//         return directors.length > 0;
//       },
//       message: 'At least one director must be added'
//     }
//   },

//   // Required documents with specific file type validations
//   documents: {
//     addressProof: {
//       type: fileSchema,
//       required: [true, 'Address proof is required']
//     },
//     utilityBill: {
//       type: fileSchema,
//       required: [true, 'Utility bill is required']
//     },
//     officeLeaseAgreement: {
//       type: fileSchema,
//       required: [true, 'Office lease agreement is required'],
//       validate: [
//         {
//           validator: fileValidators.documentOnly,
//           message: 'Please upload a valid document file for lease agreement'
//         }
//       ]
//     },
//     propertyOwnerNOC: {
//       type: fileSchema,
//       required: [true, 'NOC from property owner is required'],
//       validate: [
//         {
//           validator: fileValidators.documentOnly,
//           message: 'Please upload a valid document file for NOC'
//         }
//       ]
//     },
//     digitalSignatureCertificate: {
//       type: fileSchema,
//       required: [true, 'Digital Signature Certificate is required'],
//       validate: [
//         {
//           validator: function(file) {
//             return file.contentType === 'application/pdf';
//           },
//           message: 'Digital Signature Certificate must be a PDF file'
//         }
//       ]
//     }
//   },

//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
  
//   registrationDate: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Create indexes
// companyRegistrationSchema.index({ registrationDate: -1 });
// companyRegistrationSchema.index({ status: 1 });
// companyRegistrationSchema.index({ companyName: 1 }, { unique: true });
// companyRegistrationSchema.index({ 'directors.email': 1 });
// companyRegistrationSchema.index({ 'directors.phone': 1 });

// const CompanyRegistration = mongoose.models.CompanyRegistration || 
//   mongoose.model('CompanyRegistration', companyRegistrationSchema);

// export default CompanyRegistration;