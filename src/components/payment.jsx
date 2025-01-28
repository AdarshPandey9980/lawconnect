"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/stripe-js/pure';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800">
    {children}
  </h2>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Stripe Payment Form Component
const StripePaymentForm = ({ clientSecret, orderAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `/success`,
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount to Pay
        </label>
        <div className="text-2xl font-semibold text-gray-900 mb-4">
          ₹{orderAmount || '100'}
        </div>
      </div>

      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full px-4 py-2 text-white font-medium rounded-md
          ${processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
};

// Main Payment Form Container
const PaymentForm = ({ orderId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await fetch(`/api/get-order?orderId=${orderId}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to get order details');
        }

        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent>
          <div className="bg-red-50 text-red-600 p-3 rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stripeOptions = {
    clientSecret: orderDetails?.paymentSessionId,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
        colorBackground: '#ffffff',
        colorText: '#30313d',
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {orderDetails?.paymentSessionId ? (
          <Elements stripe={stripePromise} options={stripeOptions}>
            <StripePaymentForm
              clientSecret={orderDetails.paymentSessionId}
              orderAmount={orderDetails.orderAmount}
            />
          </Elements>
        ) : (
          <div className="text-red-600">
            Unable to initialize payment. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentForm;