import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NonCreamyApplication from '@/models/noncreamyApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await NonCreamyApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      email: app.email,
      phoneNumber: app.phoneNumber,
      address: app.address,
      caste: app.caste,
      identityProofType: app.identityProofType,
      addressProofType: app.addressProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      identityProof: app.identityProof,
      addressProof: app.addressProof,
      casteProof: app.casteProof,
      incomeProof: app.incomeProof
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