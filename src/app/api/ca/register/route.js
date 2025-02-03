import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CharteredAccountant from '@/models/CharteredAccountant';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingEmail = await CharteredAccountant.findOne({
      email: email.toLowerCase()
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCA = new CharteredAccountant({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newCA.save();

    const caResponse = {
      name: newCA.name,
      email: newCA.email,
      profileStatus: newCA.profileStatus,
      createdAt: newCA.createdAt
    };

    return NextResponse.json(
      {
        message: 'Registration successful',
        data: caResponse
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('CA Registration error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}