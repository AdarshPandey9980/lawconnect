import { NextResponse } from "next/server";
import connectDB from '@/lib/mongodb';
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, collectionName } = body;

    console.log(email,collectionName);
    

    if (!collectionName) {
      return NextResponse.json({ message: "Collection name is required" }, { status: 400 });
    }

    // Dynamically get the model
    const DynamicModel = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));

    const user = await DynamicModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    const updatedUser = await DynamicModel.findByIdAndUpdate(
      user._id,
      { $set: { isPaymentVerified: true } },
      { new: true } // To return the updated document
    );

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
