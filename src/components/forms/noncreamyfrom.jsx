"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Reusable Components
const CustomAlert = ({ variant = 'default', children }) => {
  const baseStyles = "p-4 rounded-lg mb-4";
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};

const FormInput = ({ label, name, type = "text", value, onChange, required = true, pattern, title }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      pattern={pattern}
      title={title}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FileUploadField = ({ label, fileType, accept, isFileSelected, preview, handleFileChange, handleRemoveFile, description }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {description && (
      <p className="text-sm text-gray-500">{description}</p>
    )}
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
      <div className="space-y-2 text-center">
        {preview ? (
          <div className="relative inline-block">
            {fileType === 'photo' || preview.startsWith('data:image/') ? (
              <div>
                <img src={preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md"/>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                File selected: {preview}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500">
          {fileType === 'photo' ? 'PNG, JPG up to 5MB' : 'PDF, PNG, JPG up to 5MB'}
        </p>
      </div>
    </div>
  </div>
);

const NonCreamyLayerForm = () => {
  const initialFormState = {
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    caste: '',
    identityProofType: 'aadhar',
    addressProofType: 'aadhar',
    files: {
      photo: null,
      identityProof: null,
      addressProof: null,
      casteProof: null,
      incomeProof: null,
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState({
    photo: null,
    identityProof: null,
    addressProof: null,
    casteProof: null,
    incomeProof: null,
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Check for payment status from URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('canceled')) {
      setStatus({
        type: 'error',
        message: 'Payment was canceled. Please try again.'
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return 'File size should not exceed 5MB';
    }
    return null;
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          files: { ...prev.files, [fileType]: reader.result }
        }));
        setPreview(prev => ({
          ...prev,
          [fileType]: file.type.startsWith('image/') ? reader.result : file.name
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setStatus({ type: 'error', message: 'Error processing file' });
    }
  };

  const handleRemoveFile = (fileType) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [fileType]: null }
    }));
    setPreview(prev => ({ ...prev, [fileType]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!acceptedTerms) {
      setStatus({ type: 'error', message: 'Please accept the terms and conditions' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Stripe Payment Session
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Error processing payment. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Non-Creamy Layer Certificate Application
            </h1>
          </div>

          {status.message && (
            <CustomAlert variant={status.type === 'error' ? 'error' : 'success'}>
              {status.message}
            </CustomAlert>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleInputChange}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUploadField
                  label="Passport Size Photo"
                  fileType="photo"
                  accept="image/*"
                  isFileSelected={!!formData.files.photo}
                  preview={preview.photo}
                  handleFileChange={(e) => handleFileChange(e, 'incomeProof')}
                  handleRemoveFile={() => handleRemoveFile('incomeProof')}
                  description="Upload latest income proof (Form 16, Salary Slip, or Income Certificate)"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Proof</label>
                  <select
                    name="addressProofType"
                    value={formData.addressProofType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                  >
                    <option value="aadhar">Aadhaar Card</option>
                    <option value="electricity">Electricity Bill</option>
                    <option value="water">Water Bill</option>
                    <option value="telephone">Telephone Bill</option>
                    <option value="passport">Passport</option>
                    <option value="rental">Rental Agreement</option>
                  </select>
                  <FileUploadField
                    label="Upload Address Proof"
                    fileType="addressProof"
                    accept=".pdf,image/*"
                    isFileSelected={!!formData.files.addressProof}
                    preview={preview.addressProof}
                    handleFileChange={(e) => handleFileChange(e, 'addressProof')}
                    handleRemoveFile={() => handleRemoveFile('addressProof')}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
                  <div>
                    <h3 className="font-medium text-blue-900">Application Fee</h3>
                    <p className="text-sm text-blue-700">Non-Creamy Layer Certificate Processing Fee</p>
                  </div>
                  <div className="text-xl font-bold text-blue-900">₹500</div>
                </div>
                <p className="text-sm text-gray-600">
                  * You will be redirected to a secure payment gateway to complete the payment.
                </p>
              </div>
            </div>

            {/* Terms and Declaration */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Declaration</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
                    I understand that providing false information may result in rejection of my application and legal consequences. 
                    I also agree to pay the required processing fee for the Non-Creamy Layer Certificate application.
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !acceptedTerms}
                className={`
                  px-8 py-3 rounded-md text-white font-medium
                  ${(isSubmitting || !acceptedTerms)
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                  transition-colors duration-200
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? Contact support at support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default NonCreamyLayerForm;