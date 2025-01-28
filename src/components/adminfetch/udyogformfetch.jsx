"use client";
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Building2, FileText } from 'lucide-react';

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
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
      placeholder="Search by Aadhaar, PAN, or GSTIN..."
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

const UdyogDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/udyog-fetch');
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
    app.aadhaarNumber.includes(searchTerm) ||
    app.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.gstin && app.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="text-3xl font-bold text-gray-900">Udyog Applications</h1>
        <div className="text-gray-500">Total Applications: {applications.length}</div>
      </div>

      <SearchBar onSearch={setSearchTerm} />

      <div className="grid gap-8 lg:grid-cols-2">
        {filteredApplications.map((app) => (
          <Card key={app._id}>
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="text-gray-500">Application ID:</span>
                  <span className="font-medium">{app._id}</span>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar Number</p>
                    <p className="font-medium">{app.aadhaarNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAN Number</p>
                    <p className="font-medium">{app.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="font-medium">{app.ifscCode}</p>
                  </div>
                  {app.gstin && (
                    <div>
                      <p className="text-sm text-gray-600">GSTIN</p>
                      <p className="font-medium">{app.gstin}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Business Address</p>
                      <p className="font-medium">{app.businessAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Commencement Date</p>
                      <p className="font-medium">
                        {new Date(app.commencementDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-xl text-gray-900 mb-4">Business Documents</h3>
                  <div className="space-y-6">
                    <DocumentPreview 
                      data={app.addressProof.data} 
                      type={app.addressProof.contentType}
                      title="Business Address Proof"
                    />
                    <DocumentPreview 
                      data={app.salesBills.data} 
                      type={app.salesBills.contentType}
                      title="Sales Bills"
                    />
                    <DocumentPreview 
                      data={app.machineryBills.data} 
                      type={app.machineryBills.contentType}
                      title="Machinery Bills"
                    />
                    <DocumentPreview 
                      data={app.licenses.data} 
                      type={app.licenses.contentType}
                      title="Business Licenses"
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

export default UdyogDashboard;
