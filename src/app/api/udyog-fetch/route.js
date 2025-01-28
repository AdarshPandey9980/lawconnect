
// API Route
// app/api/udyog-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UdyogApplication from '@/models/udyogApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await UdyogApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      aadhaarNumber: app.aadhaarNumber,
      panNumber: app.panNumber,
      ifscCode: app.ifscCode,
      gstin: app.gstin,
      businessAddress: app.businessAddress,
      commencementDate: app.commencementDate,
      applicationDate: app.applicationDate,
      status: app.status,
      addressProof: app.addressProof,
      salesBills: app.salesBills,
      machineryBills: app.machineryBills,
      licenses: app.licenses
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