
// API Route
// app/api/gst-registration-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GSTRegistration from '@/models/gstApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await GSTRegistration
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      address: app.address,
      phoneNumber: app.phoneNumber,
      email: app.email,
      bankDetails: {
        accountNumber: app.bankDetails.accountNumber,
        ifscCode: app.bankDetails.ifscCode,
        bankName: app.bankDetails.bankName,
        branchName: app.bankDetails.branchName
      },
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      panCard: app.panCard,
      aadharCard: app.aadharCard,
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