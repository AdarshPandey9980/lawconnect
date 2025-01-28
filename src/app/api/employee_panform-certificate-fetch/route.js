// app/api/pan-certificate-fetch/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PANApplication from '@/models/panApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await PANApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      email: app.email,
      mobileNumber: app.mobileNumber,
      dateOfBirth: app.dateOfBirth,
      address: app.address,
      identityProofType: app.identityProofType,
      dobProofType: app.dobProofType,
      addressProofType: app.addressProofType,
      applicationDate: app.applicationDate,
      status: app.status || 'pending',
      photo: {
        data: app.photo.data,
        contentType: app.photo.contentType
      },
      identityProof: {
        data: app.identityProof.data,
        contentType: app.identityProof.contentType
      },
      dobProof: {
        data: app.dobProof.data,
        contentType: app.dobProof.contentType
      },
      addressProof: {
        data: app.addressProof.data,
        contentType: app.addressProof.contentType
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
    
    const updatedApplication = await PANApplication.findByIdAndUpdate(
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