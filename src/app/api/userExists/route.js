import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    const user = await User.findOne({ email }).select("_id");
    
    return NextResponse.json(
      { exists: !!user },
      { status: 200 }
    );
  } catch (error) {
    console.error("User exists check error:", error);
    return NextResponse.json(
      { message: "An error occurred while checking user existence" },
      { status: 500 }
    );
  }
}