// app/api/employee_income-certificate-fetch/download/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { document, type } = await request.json();
    const buffer = Buffer.from(document.replace(/^data:.*?;base64,/, ''), 'base64');
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': type,
        'Content-Disposition': 'attachment',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading document' },
      { status: 500 }
    );
  }
}