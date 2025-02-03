// app/api/ca/login/route.js
import connectDB from '@/lib/mongodb';
import CharteredAccountant from '@/models/CharteredAccountant';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find CA by email
    const ca = await CharteredAccountant.findOne({
      email: email.toLowerCase()
    });

    if (!ca) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, ca.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return CA data (excluding sensitive information)
    const caData = {
      name: ca.name,
      email: ca.email,
      profileStatus: ca.profileStatus,
      createdAt: ca.createdAt
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: caData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}