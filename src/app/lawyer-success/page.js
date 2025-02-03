// app/lawyer-success/page.js
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Scale, CheckCircle2, XCircle, Loader } from 'lucide-react';

const LawyerSuccessContent = () => {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const handleData = async () => {
    try {
      const id = searchParams.get('email_id');
      const collectionName = searchParams.get('collName');
      console.log(id, collectionName);

      const res = await axios.post('/api/lawyer-success', {
        email: id,
        collectionName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res);
      setVerificationStatus('success');
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setErrorMessage('Failed to verify payment. Please contact our legal support team for assistance.');
    }
  };

  useEffect(() => {
    handleData();
  }, [searchParams]); // Added searchParams as dependency

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Scale className="w-12 h-12 text-indigo-600" />
        </div>
        
        <div className="text-center">
          {verificationStatus === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader className="w-16 h-16 text-indigo-600 animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verifying Legal Payment
              </h1>
              <p className="text-gray-600 text-lg">
                Please wait while we process your payment verification...
              </p>
              <div className="mt-4 bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-700">
                  Your transaction is being securely processed
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Payment Verified Successfully
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Your legal service payment has been confirmed.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Your lawyer will be notified and will contact you shortly.
                </p>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {errorMessage}
              </p>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  For immediate assistance, please contact our support at support@legalfirm.com
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Go to Legal Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Contact Your Lawyer
              </button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <button
                onClick={() => handleData()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/support'}
                className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Contact Support
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the content in Suspense
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LawyerSuccessContent />
    </Suspense>
  );
}