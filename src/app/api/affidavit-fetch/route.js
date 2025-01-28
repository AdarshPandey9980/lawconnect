// API Route
// app/api/affidavit-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffidavitApplication from '@/models/affidavitApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await AffidavitApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      address: app.address,
      phoneNumber: app.phoneNumber,
      email: app.email,
      purpose: app.purpose,
      idProofType: app.idProofType,
      addressProofType: app.addressProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      idProof: app.idProof,
      addressProof: app.addressProof,
      selfDeclaration: app.selfDeclaration
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