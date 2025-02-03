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

const affidavitApplicationSchema = new mongoose.Schema({
 fullName: {
   type: String,
   required: [true, 'Full name is required'],
   trim: true,
   minlength: [2, 'Full name must be at least 2 characters']
 },
 address: {
   type: String,
   required: [true, 'Address is required'], 
   trim: true,
   minlength: [5, 'Address must be at least 5 characters']
 },
 phoneNumber: {
   type: String,
   required: [true, 'Phone number is required'],
   match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
 },
 email: {
   type: String,
   required: [true, 'Email is required'],
   match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
   trim: true,
   lowercase: true
 },
 purpose: {
   type: String,
   required: [true, 'Purpose of affidavit is required'],
   trim: true,
   minlength: [10, 'Purpose must be at least 10 characters']
 },
 idProofType: {
   type: String,
   required: [true, 'ID proof type is required'],
   enum: {
     values: [
       'panCard',
       'passport', 
       'rsby',
       'aadhar',
       'voter',
       'mnrega',
       'driving',
       'govtId'
     ],
     message: '{VALUE} is not a valid ID proof type'
   }
 },
 addressProofType: {
   type: String,
   required: [true, 'Address proof type is required'],
   enum: {
     values: [
       'passport',
       'ration',
       'aadhar', 
       'phone',
       'driving',
       'electricity',
       'water',
       'voter',
       'tax',
       'rent'
     ],
     message: '{VALUE} is not a valid address proof type'
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
 photo: {
   type: fileSchema,
   required: [true, 'Photo is required']
 },
 idProof: {
   type: fileSchema,
   required: [true, 'ID proof is required']
 },
 addressProof: {
   type: fileSchema,
   required: [true, 'Address proof is required']
 },
 selfDeclaration: {
   type: fileSchema,
   required: [true, 'Self declaration is required']
 }
}, {
 timestamps: true 
});

// Create indexes (removed duplicates)
affidavitApplicationSchema.index({ applicationDate: -1 });
affidavitApplicationSchema.index({ status: 1 });
affidavitApplicationSchema.index({ email: 1 }, { unique: true });
affidavitApplicationSchema.index({ phoneNumber: 1 }, { unique: true });

// Add validation for maximum file size (5MB)
affidavitApplicationSchema.pre('save', function(next) {
 const maxSize = 5 * 1024 * 1024; // 5MB in bytes
 const fileFields = ['photo', 'idProof', 'addressProof', 'selfDeclaration'];
 
 for (const field of fileFields) {
   if (this[field]?.data) {
     const approximateSize = Math.ceil((this[field].data.length * 3) / 4);
     if (approximateSize > maxSize) {
       next(new Error(`${field} size exceeds maximum allowed size of 5MB`));
       return;
     }
   }
 }
 next();
});

const AffidavitApplication = mongoose.models.AffidavitApplication || 
 mongoose.model('AffidavitApplication', affidavitApplicationSchema);

export default AffidavitApplication;