"use client";
import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Upload } from 'lucide-react';
import axios from 'axios';
// Replace this code block at the top of your IncomeForm file

const CustomAlert = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";
  
  const variantStyles = {
    default: "bg-blue-50 text-blue-900 border-blue-200 dark:border-blue-800 [&>svg]:text-blue-900",
    destructive: "bg-red-50 text-red-900 border-red-200 dark:border-red-800 [&>svg]:text-red-900",
    success: "bg-green-50 text-green-900 border-green-200 dark:border-green-800 [&>svg]:text-green-900",
  };

  return (
    <div role="alert" className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = '' }) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

const FileUploadField = ({ label, accept, isFileSelected, fileUrl, handleFileChange, handleRemoveFile }) => (
  <div className="col-span-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition duration-150">
      <div className="space-y-2 text-center">
        {fileUrl ? (
          <div className="relative inline-block">
            {accept === "image/*" ? (
              <img src={fileUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
            ) : (
              <div className="text-sm text-gray-600">File selected</div>
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>{isFileSelected ? 'Change file' : 'Upload a file'}</span>
                <input type="file" className="sr-only" accept={accept} onChange={handleFileChange} />
              </label>
            </div>
          </>
        )}
        <p className="text-xs text-gray-500">
          {accept === "image/*" ? "PNG, JPG up to 5MB" : "PDF, PNG, JPG up to 5MB"}
        </p>
      </div>
    </div>
  </div>
);

const IncomeForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    annualIncome: '',
    idProofType: 'aadhar',
    files: {
      photo: null,
      idProof: null,
      addressProof: null,
      incomeProof: null
    },
  });

  const [fileUrls, setFileUrls] = useState({
    photo: null,
    idProof: null,
    addressProof: null,
    incomeProof: null
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status === 'success') {
      setStatus({
        type: 'success',
        message: 'Application submitted successfully!'
      });
    } else if (status === 'cancelled') {
      setStatus({
        type: 'error',
        message: 'Payment was cancelled. Please try again.'
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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message: 'File size should not exceed 5MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [type]: reader.result
        }
      }));
      setFileUrls(prev => ({
        ...prev,
        [type]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (type) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [type]: null
      }
    }));
    setFileUrls(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.address || !formData.phoneNumber || 
        !formData.email || !formData.annualIncome) {
      setStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid 10-digit phone number'
      });
      return false;
    }

    const requiredFiles = ['photo', 'idProof', 'addressProof', 'incomeProof'];
    for (const file of requiredFiles) {
      if (!formData.files[file]) {
        setStatus({
          type: 'error',
          message: `Please upload ${file.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
        const response = await fetch('/api/create-payment-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log(data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to submit data. Please try again.');
        }

        // window.location.href = data.url;
        if (data.success === true) {
          const res = await axios.post('/api/submit-income-certificate', formData, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          console.log(res);
        }
        window.location.href = data.url;
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Income Certificate Application
            </h1>
          </div>

          {/* Status Messages */}
          {status.message && (
            <CustomAlert variant={status.type === 'error' ? 'destructive' : 'default'} className="m-4">
           {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
             <AlertDescription>{status.message}</AlertDescription>
           </CustomAlert>
             )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Passport Size Photo"
                  accept="image/*"
                  isFileSelected={!!formData.files.photo}
                  fileUrl={fileUrls.photo}
                  handleFileChange={(e) => handleFileChange(e, 'photo')}
                  handleRemoveFile={() => handleRemoveFile('photo')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Type</label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 mb-4"
                  >
                    <option value="aadhar">Aadhaar Card</option>
                    <option value="voter">Voter ID</option>
                    <option value="driving">Driving License</option>
                    <option value="pan">PAN Card</option>
                  </select>

                  <FileUploadField
                    label="ID Proof Document"
                    accept=".pdf,image/*"
                    isFileSelected={!!formData.files.idProof}
                    fileUrl={fileUrls.idProof}
                    handleFileChange={(e) => handleFileChange(e, 'idProof')}
                    handleRemoveFile={() => handleRemoveFile('idProof')}
                  />
                </div>

                <FileUploadField
                  label="Address Proof"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.addressProof}
                  fileUrl={fileUrls.addressProof}
                  handleFileChange={(e) => handleFileChange(e, 'addressProof')}
                  handleRemoveFile={() => handleRemoveFile('addressProof')}
                />

                <FileUploadField
                  label="Income Proof"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.incomeProof}
                  fileUrl={fileUrls.incomeProof}
                  handleFileChange={(e) => handleFileChange(e, 'incomeProof')}
                  handleRemoveFile={() => handleRemoveFile('incomeProof')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-2 text-white rounded-lg
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                  transition duration-150
                `}
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;