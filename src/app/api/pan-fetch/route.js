// API Route
// app/api/pan-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PANApplication from '@/models/panApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await PANApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth,
      address: app.address,
      mobileNumber: app.mobileNumber,
      email: app.email,
      identityProofType: app.identityProofType,
      dobProofType: app.dobProofType,
      addressProofType: app.addressProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      identityProof: app.identityProof,
      dobProof: app.dobProof,
      addressProof: app.addressProof
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