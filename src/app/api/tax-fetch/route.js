
// API Route
// app/api/tax-return-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TaxReturn from '@/models/incometaxApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await TaxReturn
      .find({})
      .sort({ submissionDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      panNumber: app.panNumber,
      aadhaarNumber: app.aadhaarNumber,
      bankAccountNumber: app.bankAccountNumber,
      ifscCode: app.ifscCode,
      assessmentYear: app.assessmentYear,
      submissionDate: app.submissionDate,
      status: app.status,
      form16: app.form16,
      panCard: app.panCard,
      aadhaarCard: app.aadhaarCard,
      bankStatement: app.bankStatement,
      investmentProofs: app.investmentProofs,
      rentReceipts: app.rentReceipts,
      homeLoanCertificate: app.homeLoanCertificate,
      otherIncome: app.otherIncome
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