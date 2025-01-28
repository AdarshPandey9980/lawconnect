
// app/api/employee_pass-certificate-fetch/route.js
import { connectDB } from '@/lib/mongodb';
import PassportForm from '@/models/passportApplication';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const applications = await PassportForm.find({}).sort({ applicationDate: -1 });
    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { applicationId, status } = await request.json();
    await connectDB();
    
    const application = await PassportForm.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
