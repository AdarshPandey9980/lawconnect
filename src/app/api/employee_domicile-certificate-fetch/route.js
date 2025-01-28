// app/api/employee_domicile-certificate-fetch/route.js
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
      email: app.email,
      phoneNumber: app.phoneNumber,
      dateOfBirth: app.dateOfBirth,
      currentAddress: app.currentAddress,
      previousAddress: app.previousAddress,
      stayDuration: app.stayDuration,
      purpose: app.purpose,
      idProofType: app.idProofType,
      applicationDate: app.applicationDate,
      status: app.status || 'pending',
      photo: {
        data: app.photo.data,
        contentType: app.photo.contentType
      },
      idProof: {
        data: app.idProof.data,
        contentType: app.idProof.contentType
      },
      residenceProof: {
        data: app.residenceProof.data,
        contentType: app.residenceProof.contentType
      },
      schoolCertificate: {
        data: app.schoolCertificate.data,
        contentType: app.schoolCertificate.contentType
      },
      affidavit: {
        data: app.affidavit.data,
        contentType: app.affidavit.contentType
      }
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
    
    const updatedApplication = await DomicileApplication.findByIdAndUpdate(
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