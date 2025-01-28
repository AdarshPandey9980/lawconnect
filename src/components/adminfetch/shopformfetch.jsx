"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Mail, Phone, MapPin, Building2, User } from 'lucide-react';

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 border-b ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    reviewing: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BusinessTypeBadge = ({ type }) => {
  const styles = {
    proprietorship: 'bg-purple-100 text-purple-800 border-purple-200',
    partnership: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'private-limited': 'bg-teal-100 text-teal-800 border-teal-200'
  };
  const displayText = type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[type]}`}>
      {displayText}
    </span>
  );
};

const DocumentPreview = ({ data, type, title }) => {
  if (!data) return null;
  return (
    <div className="mt-4 group relative">
      <p className="font-medium mb-2 text-gray-700">{title}</p>
      <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-blue-400 transition-all duration-300">
        {type.startsWith('image/') ? (
          <img src={data} alt={title} className="w-full h-48 object-contain" />
        ) : (
          <embed src={data} type={type} className="w-full h-48" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => (
  <div className="relative mb-6">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    <input
      type="text"
      placeholder="Search applications..."
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

const FilterBar = () => (
  <div className="flex gap-4 mb-8">
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition-all duration-300">
      <Filter size={18} />
      <span>Filter</span>
    </button>
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition-all duration-300">
      <Calendar size={18} />
      <span>Date Range</span>
    </button>
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition-all duration-300">
      <Download size={18} />
      <span>Export</span>
    </button>
  </div>
);

const ShopLicenseDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/shop-fetch');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg border border-red-200">{error}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop License Applications</h1>
        <div className="text-gray-500">Total Applications: {applications.length}</div>
      </div>

      <SearchBar onSearch={setSearchTerm} />
      <FilterBar />

      <div className="grid gap-8 lg:grid-cols-2">
        {filteredApplications.map((app) => (
          <Card key={app._id}>
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-xl text-gray-900">{app.businessName}</h2>
                    <p className="text-gray-600 mt-1">Owner: {app.ownerName}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex justify-between items-center">
                  <BusinessTypeBadge type={app.businessType} />
                  {app.licenseNumber && (
                    <span className="text-sm font-medium text-gray-600">
                      License: {app.licenseNumber}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    <span>{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span>{app.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 col-span-2">
                    <MapPin size={18} />
                    <span>{app.businessAddress}</span>
                  </div>
                  {app.remarks && (
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600 font-medium">Remarks:</p>
                      <p className="text-gray-700 mt-1">{app.remarks}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-xl text-gray-900 mb-4">Required Documents</h3>
                  <div className="space-y-6">
                    <DocumentPreview 
                      data={app.aadharCard.data} 
                      type={app.aadharCard.contentType}
                      title="Aadhar Card"
                    />
                    <DocumentPreview 
                      data={app.panCard.data} 
                      type={app.panCard.contentType}
                      title="PAN Card"
                    />
                    <DocumentPreview 
                      data={app.photo.data} 
                      type={app.photo.contentType}
                      title="Photo"
                    />
                    <DocumentPreview 
                      data={app.addressProof.data} 
                      type={app.addressProof.contentType}
                      title="Address Proof"
                    />
                    <DocumentPreview 
                      data={app.rentAgreement.data} 
                      type={app.rentAgreement.contentType}
                      title="Rent Agreement/NOC"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopLicenseDashboard;

