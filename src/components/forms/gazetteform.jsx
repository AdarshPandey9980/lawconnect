"use client";
import React, { useState } from 'react';

// Alert Component
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

// Upload Icon Component
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

// File Upload Field Component
const FileUploadField = ({ label, fileType, accept, isFileSelected, preview, handleFileChange, handleRemoveFile }) => {
  const inputRef = React.useRef(null);

  const onFileChange = (e) => {
    console.log(`File selected for ${fileType}:`, e.target.files[0]); // Debug log
    handleFileChange(e, fileType);
  };

  const onRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input
    }
    handleRemoveFile(fileType);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
        <div className="space-y-2 text-center">
          {preview ? (
            <div className="text-sm text-gray-600">
              {preview}
              <button
                type="button"
                onClick={onRemove}
                className="ml-2 text-red-500 hover:text-red-600 focus:outline-none focus:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <UploadIcon />
              <div className="flex text-sm text-gray-600 justify-center">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>{isFileSelected ? 'Change file' : 'Upload a file'}</span>
                  <input
                    ref={inputRef}
                    type="file"
                    className="sr-only"
                    accept={accept}
                    onChange={onFileChange}
                    required={!isFileSelected}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Personal Information Fields Component
const PersonalInfoFields = ({ formData, handleInputChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Full Name</label>
        <input
          type="text"
          name="currentName"
          value={formData.currentName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Proposed New Name</label>
        <input
          type="text"
          name="proposedName"
          value={formData.proposedName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Residential Address</label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Reason for Name Change</label>
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
  </div>
);

const GazetteForm = () => {
  const initialFormState = {
    currentName: '',
    proposedName: '',
    address: '',
    phoneNumber: '',
    email: '',
    reason: '',
    files: {
      affidavit: null,
      idProof: null,
      addressProof: null,
      newspaperAds: null,
      applicationForm: null,
      paymentProof: null,
      coverLetter: null,
      photos: null,
      digitalCD: null
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState({
    affidavit: null,
    idProof: null,
    addressProof: null,
    newspaperAds: null,
    applicationForm: null,
    paymentProof: null,
    coverLetter: null,
    photos: null,
    digitalCD: null
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

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) {
      console.log(`No file selected for ${fileType}`);
      return;
    }

    console.log(`Processing ${fileType}:`, {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setStatus({
        type: 'error',
        message: `Please upload a valid file type (PDF, JPEG, PNG) for ${fileType}`
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message: `${fileType} size should not exceed 5MB`
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        
        setFormData(prev => ({
          ...prev,
          files: {
            ...prev.files,
            [fileType]: base64
          }
        }));

        setPreview(prev => ({
          ...prev,
          [fileType]: `File selected: ${file.name}`
        }));

        setStatus({ type: '', message: '' });
      };

      reader.onerror = () => {
        setStatus({
          type: 'error',
          message: `Error reading ${fileType} file. Please try again.`
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(`Error processing ${fileType}:`, error);
      setStatus({
        type: 'error',
        message: `Error processing ${fileType}. Please try again.`
      });
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
    // Check all required fields first
    const requiredFields = ['currentName', 'proposedName', 'address', 'phoneNumber', 'email', 'reason'];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        setStatus({
          type: 'error',
          message: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
        });
        return false;
      }
    }

    // Check all required files
    const requiredFiles = [
      'affidavit',
      'idProof',
      'addressProof',
      'newspaperAds',
      'applicationForm',
      'paymentProof',
      'coverLetter',
      'photos',
      'digitalCD'
    ];

    for (const fileType of requiredFiles) {
      if (!formData.files[fileType]) {
        setStatus({
          type: 'error',
          message: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} is required`
        });
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
      const response = await fetch('/api/submit-gazette-certificate', {
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
        message: 'Gazette application submitted successfully!'
      });
      
      setFormData(initialFormState);
      setPreview({
        affidavit: null,
        idProof: null,
        addressProof: null,
        newspaperAds: null,
        applicationForm: null,
        paymentProof: null,
        coverLetter: null,
        photos: null,
        digitalCD: null
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
              Gazette Certificate Application Form
            </h1>
          </div>

          {status.message && (
            <CustomAlert variant={status.type === 'error' ? 'error' : 'success'}>
              {status.message}
            </CustomAlert>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <PersonalInfoFields 
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Required Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Notarized Affidavit"
                  fileType="affidavit"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.affidavit}
                  preview={preview.affidavit}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Identity Proof"
                  fileType="idProof"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.idProof}
                  preview={preview.idProof}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Address Proof"
                  fileType="addressProof"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.addressProof}
                  preview={preview.addressProof}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Newspaper Advertisements"
                  fileType="newspaperAds"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.newspaperAds}
                  preview={preview.newspaperAds}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Application Form"
                  fileType="applicationForm"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.applicationForm}
                  preview={preview.applicationForm}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Payment Proof"
                  fileType="paymentProof"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.paymentProof}
                  preview={preview.paymentProof}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Cover Letter"
                  fileType="coverLetter"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.coverLetter}
                  preview={preview.coverLetter}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Passport Size Photographs"
                  fileType="photos"
                  accept="image/*"
                  isFileSelected={!!formData.files.photos}
                  preview={preview.photos}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
                />

                <FileUploadField
                  label="Digital CD (Soft Copy)"
                  fileType="digitalCD"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.digitalCD}
                  preview={preview.digitalCD}
                  handleFileChange={handleFileChange}
                  handleRemoveFile={handleRemoveFile}
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
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GazetteForm;