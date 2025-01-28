"use client";
import React, { useState } from 'react';

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

const FileUploadField = ({ label, fileType, accept, isFileSelected, preview, handleFileChange, handleRemoveFile }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
      <div className="space-y-2 text-center">
        {preview ? (
          preview.startsWith('data:image/') ? (
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="mx-auto h-32 w-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : (
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
          )
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

const PersonalInfoFields = ({ formData, handleInputChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Father's Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Caste</label>
        <input
          type="text"
          name="caste"
          value={formData.caste}
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
          title="Please enter a valid 10-digit phone number"
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
      <label className="block text-sm font-medium text-gray-700">Address</label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>
  </div>
);

const CasteForm = () => {
  const initialFormState = {
    fullName: '',
    fatherName: '',
    dateOfBirth: '',
    caste: '',
    address: '',
    phoneNumber: '',
    email: '',
    files: {
      birthCertificate: null,
      residenceProof: null,
      rationCard: null,
      incomeCertificate: null,
      parentCasteCertificate: null
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState({
    birthCertificate: null,
    residenceProof: null,
    rationCard: null,
    incomeCertificate: null,
    parentCasteCertificate: null
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

      if (file.type.startsWith('image/')) {
        setPreview(prev => ({
          ...prev,
          [fileType]: base64
        }));
      } else {
        setPreview(prev => ({
          ...prev,
          [fileType]: `File selected: ${file.name}`
        }));
      }
      
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
    const requiredFiles = ['birthCertificate', 'residenceProof', 'rationCard', 'incomeCertificate', 'parentCasteCertificate'];
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
      const response = await fetch('/api/submit-caste-certificate', {
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
        message: 'Application submitted successfully!'
      });
      
      setFormData(initialFormState);
      setPreview({
        birthCertificate: null,
        residenceProof: null,
        rationCard: null,
        incomeCertificate: null,
        parentCasteCertificate: null
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
              Caste Certificate Application Form
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
                  label="Birth Certificate"
                  fileType="birthCertificate"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.birthCertificate}
                  preview={preview.birthCertificate}
                  handleFileChange={(e) => handleFileChange(e, 'birthCertificate')}
                  handleRemoveFile={() => handleRemoveFile('birthCertificate')}
                />

                <FileUploadField
                  label="Residence Proof"
                  fileType="residenceProof"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.residenceProof}
                  preview={preview.residenceProof}
                  handleFileChange={(e) => handleFileChange(e, 'residenceProof')}
                  handleRemoveFile={() => handleRemoveFile('residenceProof')}
                />

                <FileUploadField
                  label="Ration Card"
                  fileType="rationCard"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.rationCard}
                  preview={preview.rationCard}
                  handleFileChange={(e) => handleFileChange(e, 'rationCard')}
                  handleRemoveFile={() => handleRemoveFile('rationCard')}
                />

                <FileUploadField
                  label="Income Certificate"
                  fileType="incomeCertificate"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.incomeCertificate}
                  preview={preview.incomeCertificate}
                  handleFileChange={(e) => handleFileChange(e, 'incomeCertificate')}
                  handleRemoveFile={() => handleRemoveFile('incomeCertificate')}
                />

                <FileUploadField
                  label="Parent's Caste Certificate"
                  fileType="parentCasteCertificate"
                  accept=".pdf,image/*"
                  isFileSelected={!!formData.files.parentCasteCertificate}
                  preview={preview.parentCasteCertificate}
                  handleFileChange={(e) => handleFileChange(e, 'parentCasteCertificate')}
                  handleRemoveFile={() => handleRemoveFile('parentCasteCertificate')}
                />
              </div>
            </div>

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

export default CasteForm;