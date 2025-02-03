import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    

    // if (!body.email || !body.name || !body.consultationFee) {
    //   return NextResponse.json(
    //     { success: false, message: 'Missing required fields' },
    //     { status: 400 }
    //   );
    // }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: body.email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Legal Consultation',
              description: `Consultation with lawyer on ${body.date} at ${body.time}`,
            },
            unit_amount: Math.round(body.consultationFee * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/lawyer-success?session_id={CHECKOUT_SESSION_ID}&email_id=${body.email}&collName=lawyerBooking`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookingForm/cancel`,
      billing_address_collection: 'required',
      customer_creation: 'always',
      payment_intent_data: {
        shipping: {
          name:  body.name ,
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
        bookingType: 'lawyer_consultation',
        clientName: body.name,
        consultationDate: body.date,
        consultationTime: body.time
      }
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create payment session'
      },
      { status: 500 }
    );
  }
}
