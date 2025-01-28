
// API Route
// app/api/domicile-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DomicileApplication from '@/models/domicileApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await DomicileApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      dateOfBirth: app.dateOfBirth,
      currentAddress: app.currentAddress,
      previousAddress: app.previousAddress,
      phoneNumber: app.phoneNumber,
      email: app.email,
      stayDuration: app.stayDuration,
      purpose: app.purpose,
      idProofType: app.idProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      idProof: app.idProof,
      residenceProof: app.residenceProof,
      schoolCertificate: app.schoolCertificate,
      affidavit: app.affidavit
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