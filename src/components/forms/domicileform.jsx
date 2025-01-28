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
const FileUploadField = ({ label, fileType, accept, isFileSelected, preview, handleFileChange, handleRemoveFile }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
      <div className="space-y-2 text-center">
        {preview ? (
          fileType === 'photo' || preview.startsWith('data:image/') ? (
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

// Personal Information Fields Component
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration of Stay (in years)</label>
        <input
          type="number"
          name="stayDuration"
          value={formData.stayDuration}
          onChange={handleInputChange}
          min="0"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Purpose of Certificate</label>
        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">Select purpose</option>
          <option value="education">Education</option>
          <option value="employment">Employment</option>
          <option value="legal">Legal Purpose</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Current Address</label>
      <textarea
        name="currentAddress"
        value={formData.currentAddress}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Previous Address (if any)</label>
      <textarea
        name="previousAddress"
        value={formData.previousAddress}
        onChange={handleInputChange}
        rows="3"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
);

const DomicileForm = () => {
  const initialFormState = {
    fullName: '',
    dateOfBirth: '',
    currentAddress: '',
    previousAddress: '',
    phoneNumber: '',
    email: '',
    stayDuration: '',
    purpose: '',
    idProofType: 'aadhar',
    files: {
      photo: null,
      idProof: null,
      residenceProof: null,
      schoolCertificate: null,
      affidavit: null
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState({
    photo: null,
    idProof: null,
    residenceProof: null,
    schoolCertificate: null,
    affidavit: null
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
    const requiredFiles = ['photo', 'idProof', 'residenceProof', 'schoolCertificate', 'affidavit'];
    for (const fileType of requiredFiles) {
      if (!formData.files[fileType]) {
        setStatus({ type: 'error', message: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} is required` });
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
      const response = await fetch('/api/submit-domicile-certificate', {
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
      
      // Reset form
      setFormData(initialFormState);
      setPreview({
        photo: null,
        idProof: null,
        residenceProof: null,
        schoolCertificate: null,
        affidavit: null
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
              Domicile Certificate Application Form
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

            {/* Document Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Passport Size Photo"
                  fileType="photo"
                  accept="image/*"
                  isFileSelected={!!formData.files.photo}
                  preview={preview.photo}
                  handleFileChange={(e) => handleFileChange(e, 'photo')}
                  handleRemoveFile={() => handleRemoveFile('photo')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Proof Type</label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pan">PAN Card</option>
                    <option value="aadhar">Aadhaar Card</option>
                    <option value="ration">Ration Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving">Driving License</option>
                  </select>

                  <div className="mt-4">
                    <FileUploadField
                      label="ID Proof Document"
                      fileType="idProof"
                      accept="application/pdf,image/*"
                      isFileSelected={!!formData.files.idProof}
                      preview={preview.idProof}
                      handleFileChange={(e) => handleFileChange(e, 'idProof')}
                      handleRemoveFile={() => handleRemoveFile('idProof')}
                    />
                  </div>
                </div>

                <FileUploadField
                  label="Proof of Residence"
                  fileType="residenceProof"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.residenceProof}
                  preview={preview.residenceProof}
                  handleFileChange={(e) => handleFileChange(e, 'residenceProof')}
                  handleRemoveFile={() => handleRemoveFile('residenceProof')}
                />

                <FileUploadField
                  label="School Leaving Certificate"
                  fileType="schoolCertificate"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.schoolCertificate}
                  preview={preview.schoolCertificate}
                  handleFileChange={(e) => handleFileChange(e, 'schoolCertificate')}
                  handleRemoveFile={() => handleRemoveFile('schoolCertificate')}
                />

                <FileUploadField
                  label="Tehsildar/Court Affidavit"
                  fileType="affidavit"
                  accept="application/pdf,image/*"
                  isFileSelected={!!formData.files.affidavit}
                  preview={preview.affidavit}
                  handleFileChange={(e) => handleFileChange(e, 'affidavit')}
                  handleRemoveFile={() => handleRemoveFile('affidavit')}
                />
              </div>

              {/* Declaration Section */}
              <div className="mt-6">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-yellow-900 mb-2">Declaration</h3>
                  <p className="text-sm text-yellow-700">
                    I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
                    I understand that any false statement may result in the rejection of my application and/or legal action. 
                    I have been continuously residing at the given address for the period mentioned above.
                  </p>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        required
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I agree to the declaration and confirm that all submitted documents are genuine
                      </span>
                    </label>
                  </div>
                </div>
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

export default DomicileForm;