"use client";
import React, { useState } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    {children}
  </div>
)
const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DocumentServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleItemClick = (itemName) => {
    if (itemName === 'Income Certificate') {
      router.push('/employee_income');
    }
    if (itemName === 'Domicile Certificate') {
      router.push('/employee_domicile');
    }
    if (itemName === 'Non-Creamy Layer Certificate') {
      router.push('/employee_noncreamy');
    }
    if (itemName === 'Caste Certificate') {
      router.push('/employee_caste');
    }
    if (itemName === 'PAN Card') {
      router.push('/employee_pan');
    }
    if (itemName === 'Passport') {
      router.push('/employee_pass');
    }
    if (itemName === 'Gazette') {
      router.push('/employee_gazette');
    }
   
   
  };

  const documents = [
    {
      id: 1,
      title: 'Personal Documents',
      items: [
        { name: 'Income Certificate', processing: '15 days' },
        { name: 'Domicile Certificate', processing: '15 days' },
        { name: 'Non-Creamy Layer Certificate', processing: '15 days' },
        { name: 'Caste Certificate', processing: '15 days' },
        { name: 'PAN Card', processing: '15 days' },
        { name: 'Passport', processing: '15 days' },
      ]
    },
    {
      id: 2,
      title: 'Business Documents',
      items: [
        { name: 'Gazette', processing: '15 days' },
        { name: 'Shop License/Gumasta', processing: '15 days' },
        { name: 'Food License', processing: '15 days' },
        { name: 'GST Registration', processing: '15 days' },
        { name: 'Income Tax Filing', processing: '15 days' },
      ]
    },
    {
      id: 3,
      title: 'Legal Documents',
      items: [
        { name: 'Affidavit', processing: '15 days' },
        { name: 'E-Leave and License', processing: '15 days' },
        { name: 'Udyog Aadhar', processing: '15 days' },
        { name: 'Company Registration', processing: '15 days' },
      ]
    }
  ];

  const filteredDocuments = documents.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Document Categories */}
      <div className="grid gap-6">
        {filteredDocuments.map((category) => (
          <Card key={category.id}>
            {/* Category Header */}
            <div className="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
            
            {/* Category Items */}
            <CardContent className="p-0">
              {category.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer transition-colors"
                  onClick={() => handleItemClick(item.name)}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Processing time: {item.processing}
                    </span>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentServices;