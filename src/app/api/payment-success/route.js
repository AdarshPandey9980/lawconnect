// app/api/payment-success/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getTempData } from '@/lib/tempStorage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');
  const tempId = searchParams.get('temp_id');

  try {
    // Verify payment was successful
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Retrieve the stored form data
      const applicationData = getTempData(tempId);
      
      if (!applicationData) {
        throw new Error('Application data not found');
      }

      // Forward the application data to the submit-income-certificate endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/submit-income-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          paymentSessionId: sessionId,
          paymentStatus: 'paid'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Redirect to success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/income-form?status=success`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/income-form?status=payment_failed`
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/income-form?status=error`
    );
  }
}