"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Mail, Phone, MapPin, User, CheckCircle, XCircle, Clock } from 'lucide-react';

const GazetteDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/employee_gazette-certificate-fetch');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await fetch('/api/employee_gazette-certificate-fetch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setApplications(apps => 
        apps.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDownload = async (documentData, type, title) => {
    try {
      const response = await fetch('/api/employee_gazette-certificate-fetch/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: documentData, type })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const filteredApplications = applications.filter(app => 
    app.currentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.proposedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phoneNumber.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg border border-red-200">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Gazette Name Change Applications</h1>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {applications.length} Total Applications
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by current name, proposed name, email or phone..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select className="w-full rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {filteredApplications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-xl text-gray-900">
                      {app.currentName} → {app.proposedName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Name Change Request</p>
                  </div>
                  <div className="relative inline-block">
                    <select 
                      className={`appearance-none pl-8 pr-10 py-2 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        app.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {app.status === 'approved' ? <CheckCircle size={16} className="mr-2" /> :
                       app.status === 'rejected' ? <XCircle size={16} className="mr-2" /> :
                       <Clock size={16} className="mr-2" />}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={18} />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} />
                      <span>{app.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <MapPin size={18} />
                      <span className="truncate">{app.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                      <span className="font-medium">Reason:</span>
                      <span className="text-sm">{app.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />
                      <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Documents</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { key: 'affidavit', title: 'Affidavit' },
                        { key: 'idProof', title: 'ID Proof' },
                        { key: 'addressProof', title: 'Address Proof' },
                        { key: 'newspaperAds', title: 'Newspaper Ads' },
                        { key: 'applicationForm', title: 'Application Form' },
                        { key: 'paymentProof', title: 'Payment Proof' },
                        { key: 'coverLetter', title: 'Cover Letter' },
                        { key: 'photos', title: 'Photos' },
                        { key: 'digitalCD', title: 'Digital CD' }
                      ].map(({ key, title }) => (
                        app[key] && (
                          <div key={key} className="mt-4">
                            <p className="font-medium mb-2 text-gray-700 flex items-center">
                              {title}
                              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {app[key].contentType.split('/')[1].toUpperCase()}
                              </span>
                            </p>
                            <div className="relative overflow-hidden rounded-lg border border-gray-200 group hover:border-blue-400 transition-all duration-300">
                              {app[key].contentType.startsWith('image/') ? (
                                <img 
                                  src={app[key].data} 
                                  alt={title}
                                  className="w-full h-48 object-contain bg-gray-50"
                                />
                              ) : (
                                <embed 
                                  src={app[key].data} 
                                  type={app[key].contentType} 
                                  className="w-full h-48"
                                />
                              )}
                              <button
                                onClick={() => handleDownload(app[key].data, app[key].contentType, title)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all duration-300"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GazetteDashboard;