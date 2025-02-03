'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const PageComponent = () => {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleData = async () => {
    try {
      const id = searchParams.get('email_id');
      const collectionName = searchParams.get('collName');
      console.log(id, collectionName);

      const res = await axios.post('/api/success', {
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
      setErrorMessage('Failed to verify payment. Please try again or contact support.');
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {verificationStatus === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader className="w-16 h-16 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Payment
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Verified!
              </h1>
              <p className="text-gray-600">
                Your payment has been successfully verified. Thank you for your purchase!
              </p>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600">
                {errorMessage}
              </p>
            </>
          )}
        </div>

        <div className="mt-8">
          {verificationStatus === 'success' && (
            <button
              onClick={() => window.location.href = '/main'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Go to Main Page
            </button>
          )}

          {verificationStatus === 'error' && (
            <button
              onClick={() => handleData()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageComponent;