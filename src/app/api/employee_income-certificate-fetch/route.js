// app/api/employee_income-certificate-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmployeeApplication from '@/models/IncomeApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await EmployeeApplication
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
      applicationDate: app.applicationDate,
      status: app.status || 'pending',
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

export async function PUT(request) {
  try {
    await connectDB();
    const { applicationId, status } = await request.json();
    
    const updatedApplication = await EmployeeApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating status' },
      { status: 500 }
    );
  }
}