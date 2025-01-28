// app/api/income-certificate-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import IncomeApplication from '@/models/IncomeApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await IncomeApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      email: app.email,
      phoneNumber: app.phoneNumber,
      address: app.address,
      annualIncome: app.annualIncome,
      idProofType: app.idProofType,
      applicationDate: app.applicationDate,
      status: app.status,
      idProof: app.idProof.data,
      addressProof: app.addressProof.data,
      incomeProof: app.incomeProof.data,
      idProofType: app.idProof.contentType,
      addressProofType: app.addressProof.contentType,
      incomeProofType: app.incomeProof.contentType
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