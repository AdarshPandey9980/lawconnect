"use client";
import React, { useState } from 'react';

// Reusing the same Alert Component
const CustomAlert = ({ variant = 'default', className = '', children }) => {
  const baseStyles = "p-4 rounded-lg mb-4";
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Reusing the same Upload Icon Component
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mx-auto h-12 w-12 text-gray-400"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// Reusing the File Upload Field Component
const FileUploadField = ({ label, accept, isFileSelected, preview, handleFileChange, handleRemoveFile }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
      <div className="space-y-2 text-center">
        {preview ? (
          <div className="text-sm text-gray-600">
            {preview}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ml-2 text-red-500 hover:text-red-600 focus:outline-none focus:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <UploadIcon />
        )}
        <div className="flex text-sm text-gray-600 justify-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span>{isFileSelected ? 'Change file' : 'Upload a file'}</span>
            <input
              type="file"
              className="sr-only"
              accept={accept}
              onChange={handleFileChange}
              required={!isFileSelected}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
      </div>
    </div>
  </div>
);

// Business Information Fields Component
const BusinessInfoFields = ({ formData, handleInputChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Business Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
        <input
          type="text"
          name="aadhaarNumber"
          value={formData.aadhaarNumber}
          onChange={handleInputChange}
          pattern="[0-9]{12}"
          title="Please enter a valid 12-digit Aadhaar number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">PAN Number</label>
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleInputChange}
          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
          title="Please enter a valid 10-character PAN number"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleInputChange}
          pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
          title="Please enter a valid IFSC code"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">GSTIN (if applicable)</label>
        <input
          type="text"
          name="gstin"
          value={formData.gstin}
          onChange={handleInputChange}
          pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
          title="Please enter a valid GSTIN"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Commencement</label>
        <input
          type="date"
          name="commencementDate"
          value={formData.commencementDate}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Business Address</label>
      <textarea
        name="businessAddress"
        value={formData.businessAddress}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
  </div>
);

const UdyogForm = () => {
  const initialFormState = {
    aadhaarNumber: '',
    panNumber: '',
    ifscCode: '',
    gstin: '',
    businessAddress: '',
    commencementDate: '',
    files: {
      addressProof: null,
      salesBills: null,
      machineryBills: null,
      licenses: null
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState({
    addressProof: null,
    salesBills: null,
    machineryBills: null,
    licenses: null
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFile = (file) => {
    if (!file) return 'File is required';
    
    if (file.size > 5 * 1024 * 1024) {
      return 'File size should not exceed 5MB';
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid file type (PDF, JPEG, PNG)';
    }

    return null;
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setStatus({ type: 'error', message: error });
      e.target.value = '';
      return;
    }

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      setFormData(prev => ({
        ...prev,
        files: { ...prev.files, [fileType]: base64 }
      }));

      setPreview(prev => ({
        ...prev,
        [fileType]: `File selected: ${file.name}`
      }));
      
      setStatus({ type: '', message: '' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: 'Error processing file. Please try again.' 
      });
      console.error('File processing error:', error);
    }
  };

  const handleRemoveFile = (fileType) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [fileType]: null }
    }));
    setPreview(prev => ({ ...prev, [fileType]: null }));
  };

  const validateForm = () => {
    const requiredFiles = ['addressProof', 'salesBills', 'machineryBills', 'licenses'];
    for (const fileType of requiredFiles) {
      if (!formData.files[fileType]) {
        setStatus({ type: 'error', message: `${fileType.split(/(?=[A-Z])/).join(' ')} is required` });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-udyog-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Submission failed');
      
      setStatus({
        type: 'success',
        message: 'Udyog registration submitted successfully!'
      });
      
      setFormData(initialFormState);
      setPreview({
        addressProof: null,
        salesBills: null,
        machineryBills: null,
        licenses: null
      });
      
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Error submitting form. Please try again.'
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Udyog Registration Form
            </h1>
          </div>

          {status.message && (
            <CustomAlert variant={status.type === 'error' ? 'error' : 'success'}>
              {status.message}
            </CustomAlert>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <BusinessInfoFields 
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* Document Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Business Address Proof"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.addressProof}
                  preview={preview.addressProof}
                  handleFileChange={(e) => handleFileChange(e, 'addressProof')}
                  handleRemoveFile={() => handleRemoveFile('addressProof')}
                />

                <FileUploadField
                  label="Sales and Purchase Bills"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.salesBills}
                  preview={preview.salesBills}
                  handleFileChange={(e) => handleFileChange(e, 'salesBills')}
                  handleRemoveFile={() => handleRemoveFile('salesBills')}
                />

                <FileUploadField
                  label="Machinery Bills"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.machineryBills}
                  preview={preview.machineryBills}
                  handleFileChange={(e) => handleFileChange(e, 'machineryBills')}
                  handleRemoveFile={() => handleRemoveFile('machineryBills')}
                />

                <FileUploadField
                  label="Business Licenses"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.licenses}
                  preview={preview.licenses}
                  handleFileChange={(e) => handleFileChange(e, 'licenses')}
                  handleRemoveFile={() => handleRemoveFile('licenses')}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-2 rounded-md text-white
                  ${isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors duration-200
                `}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UdyogForm;