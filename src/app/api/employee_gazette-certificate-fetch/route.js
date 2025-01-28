import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GazetteApplication from '@/models/gazetteApplication';

export async function GET() {
  try {
    await connectDB();
    
    const applications = await GazetteApplication
      .find({})
      .sort({ applicationDate: -1 })
      .lean();

    const processedApplications = applications.map(app => ({
      _id: app._id.toString(),
      currentName: app.currentName,
      proposedName: app.proposedName,
      email: app.email,
      phoneNumber: app.phoneNumber,
      address: app.address,
      reason: app.reason,
      applicationDate: app.applicationDate,
      status: app.status,
      affidavit: app.affidavit,
      idProof: app.idProof,
      addressProof: app.addressProof,
      newspaperAds: app.newspaperAds,
      applicationForm: app.applicationForm,
      paymentProof: app.paymentProof,
      coverLetter: app.coverLetter,
      photos: app.photos,
      digitalCD: app.digitalCD
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
    
    const updatedApplication = await GazetteApplication.findByIdAndUpdate(
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