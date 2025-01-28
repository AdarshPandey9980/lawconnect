
// API Route
// app/api/passport-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PassportApplication from '@/models/passportApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await PassportApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth,
      address: app.address,
      phoneNumber: app.phoneNumber,
      email: app.email,
      photoIdType: app.photoIdType,
      addressProofType: app.addressProofType,
      dobProofType: app.dobProofType,
      hasOldPassport: app.hasOldPassport,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      photoId: app.photoId,
      addressProof: app.addressProof,
      dobProof: app.dobProof,
      oldPassport: app.oldPassport
    }));

    return NextResponse.json({ 
      success: true, 
      applications: processedApplications 
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching applications' }, 
      { status: 500 }
    );
  }
}