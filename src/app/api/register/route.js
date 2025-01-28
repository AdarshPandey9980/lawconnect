import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

// Validation helper functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

export async function POST(req) {
  try {
    // Parse request body
    const { name, email, password } = await req.json();

    // Validate required fields
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!email || !isValidEmail(email)) {
      errors.push("Please provide a valid email address");
    }

    const passwordError = validatePassword(password);
    if (!password || passwordError) {
      errors.push(passwordError || "Password is required");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { message: errors.join(", ") },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check for existing user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Registration successful" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: errors.join(", ") },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred during registration. Please try again later." },
      { status: 500 }
    );
  }
}