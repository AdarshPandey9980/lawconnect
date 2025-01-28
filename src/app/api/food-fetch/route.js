
// API Route
// app/api/food-license-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FoodLicenseApplication from '@/models/foodApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await FoodLicenseApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      businessName: app.businessName,
      ownerName: app.ownerName,
      businessAddress: app.businessAddress,
      phoneNumber: app.phoneNumber,
      email: app.email,
      idProofType: app.idProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      photo: app.photo,
      idProof: app.idProof,
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