import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CasteApplication from '@/models/casteApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await CasteApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      fullName: app.fullName,
      fatherName: app.fatherName,
      dateOfBirth: app.dateOfBirth,
      caste: app.caste,
      email: app.email,
      phoneNumber: app.phoneNumber,
      address: app.address,
      applicationDate: app.applicationDate,
      status: app.status,
      birthCertificate: app.birthCertificate,
      residenceProof: app.residenceProof,
      rationCard: app.rationCard,
      incomeCertificate: app.incomeCertificate,
      parentCasteCertificate: app.parentCasteCertificate
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
    
    const updatedApplication = await CasteApplication.findByIdAndUpdate(
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

export async function POST(request) {
  try {
    const formData = await request.json();
    const { document, type } = formData;

    return new NextResponse(
      Buffer.from(document.split(',')[1], 'base64'),
      {
        headers: {
          'Content-Type': type,
          'Content-Disposition': 'attachment'
        }
      }
    );
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading file' },
      { status: 500 }
    );
  }
}