import { storeTempData } from '@/lib/tempStorage';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Store form data temporarily and get ID
    const tempDataId = storeTempData(body);
    
    // const data = getTempData(tempDataId);
    // console.log(data);
    
    
    // Create a payment session with customer details for Indian export compliance
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: body.email, // Add customer email if available
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Income Certificate Application Fee',
              description: 'Application processing fee for income certificate',
            },
            unit_amount: 10000, // ₹100.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?status=success&session_id={CHECKOUT_SESSION_ID}&email_id=${body.email}&collName=incomeApplication`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/income-form?status=cancelled`,
      billing_address_collection: 'required', // Require billing address
      customer_creation: 'always', // Create a customer for each transaction
      payment_intent_data: {
        shipping: {
          name: body.fullName, // Customer's full name
          address: {
            line1: body.address?.line1 || '',
            line2: body.address?.line2 || '',
            city: body.address?.city || '',
            state: body.address?.state || '',
            postal_code: body.address?.postalCode || '',
            country: 'IN', // India
          },
        },
      },
      metadata: {
        customerName: body.fullName,
        tempDataId: tempDataId,
      },
    });

    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url,
      body:body
    });
  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating payment session' },
      { status: 500 }
    );
  }
}
