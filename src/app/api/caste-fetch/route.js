
// app/api/caste-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CasteApplication from '@/models/casteApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await CasteApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      fatherName: app.fatherName,
      dateOfBirth: app.dateOfBirth,
      caste: app.caste,
      address: app.address,
      phoneNumber: app.phoneNumber,
      email: app.email,
      applicationDate: app.applicationDate,
      status: app.status,
      birthCertificate: app.birthCertificate,
      residenceProof: app.residenceProof,
      rationCard: app.rationCard,
      incomeCertificate: app.incomeCertificate,
      parentCasteCertificate: app.parentCasteCertificate
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