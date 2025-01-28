
// API Route
// app/api/shop-license-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ShopLicenseApplication from '@/models/shoplicenseApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await ShopLicenseApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      businessName: app.businessName,
      ownerName: app.ownerName,
      businessAddress: app.businessAddress,
      contactNumber: app.contactNumber,
      email: app.email,
      businessType: app.businessType,
      status: app.status,
      applicationDate: app.applicationDate,
      remarks: app.remarks,
      approvalDate: app.approvalDate,
      licenseNumber: app.licenseNumber,
      aadharCard: app.aadharCard,
      panCard: app.panCard,
      photo: app.photo,
      addressProof: app.addressProof,
      rentAgreement: app.rentAgreement
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