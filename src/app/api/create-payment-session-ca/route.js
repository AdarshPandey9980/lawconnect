//api/create-payment-session-ca/route.js
import { storeTempData } from '@/lib/tempStorage';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Store form data temporarily and get ID
    const tempDataId = storeTempData(body);

    // Set the product name and price based on consultation type
    const productName = `CA ${body.consultationType} Consultation`;
    const amount = getConsultationPrice(body.consultationType, body.clientType);

    // Create a payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: body.email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: productName,
              description: `${body.clientType} consultation for ${body.consultationType.toLowerCase()} services`,
            },
            unit_amount: amount, // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}&collName=${body.clientType === 'Individual' ? 'individualConsultation' : 'firmConsultation'}&email_id=${body.email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ca-consultation?status=cancelled`,
      billing_address_collection: 'required',
      customer_creation: 'always',
      payment_intent_data: {
        shipping: {
          name: body.clientType === 'Individual' ? body.name : body.firmName,
          address: {
            line1: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'IN',
          },
        },
      },
      metadata: {
        tempDataId,
        clientType: body.clientType,
        consultationType: body.consultationType,
        customerName: body.clientType === 'Individual' ? body.name : body.firmName,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating payment session' },
      { status: 500 }
    );
  }
}

// Helper function to determine consultation price based on type and client
function getConsultationPrice(consultationType, clientType) {
  const basePrice = {
    Individual: {
      Tax: 199900,        // ₹1,999
      Audit: 299900,      // ₹2,999
      Compliance: 249900, // ₹2,499
      Other: 199900,      // ₹1,999
    },
    Firm: {
      Tax: 499900,        // ₹4,999
      Audit: 599900,      // ₹5,999
      Compliance: 549900, // ₹5,499
      Other: 499900,      // ₹4,999
    }
  };

  return basePrice[clientType]?.[consultationType] || 199900;
}