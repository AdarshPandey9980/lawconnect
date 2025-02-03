"use client";
import React from 'react';
import { ChevronRight, FileText, Search, Bell, LogOut, FolderOpen, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DocumentServices() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('documents');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const router = useRouter();

  const SidebarItem = React.memo(({ icon: Icon, label, active, onClick }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  ));

  const Card = React.memo(({ children }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {children}
    </div>
  ));

  const CardContent = React.memo(({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  ));

  const handleNavigation = (section) => {
    if (section === 'documents') {
      router.push('/admindocument');
    } else if (section === 'dashboard') {
      router.push('/admin');
    } else if (section === 'logout') {
      router.push('/admindashboard');
    }
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const handleItemClick = (itemName) => {
    switch(itemName) {
      case 'Income Certificate':
        router.push('/incomeformfetch');
        break;
      case 'Domicile Certificate':
        router.push('/domicileformfetch');
        break;
      case 'Non-Creamy Layer Certificate':
        router.push('/noncreamyfetch');
        break;
      case 'Caste Certificate':
        router.push('/casteformfetch');
        break;
      case 'PAN Card':
        router.push('/panformfetch');
        break;
      case 'Passport':
        router.push('/passportformfetch');
        break;
      case 'Gazette':
        router.push('/gazetteformfetch');
        break;
      case 'Shop License/Gumasta':
        router.push('/shopformfetch');
        break;
      case 'Food License':
        router.push('/foodformfetch');
        break;
      case 'GST Registration':
        router.push('/gstformfetch');
        break;
      case 'Income Tax Filing':
        router.push('/taxfetch');
        break;
      case 'Affidavit':
        router.push('/affidevitefetch');
        break;
      case 'E-Leave and License':
        router.push('/leaveform');
        break;
      case 'Udyog Aadhar':
        router.push('/udyogformfetch');
        break;
      case 'Company Registration':
        router.push('/companyform');
        break;
    }
  };

  const documents = [
    {
      id: 1,
      title: 'Personal Documents',
      items: [
        { name: 'Income Certificate'},
        { name: 'Domicile Certificate' },
        { name: 'Non-Creamy Layer Certificate' },
        { name: 'Caste Certificate' },
        { name: 'PAN Card' },
        { name: 'Passport' },
      ]
    },
    {
      id: 2,
      title: 'Business Documents',
      items: [
        { name: 'Gazette' },
        { name: 'Shop License/Gumasta' },
        { name: 'Food License' },
        { name: 'GST Registration' },
        { name: 'Income Tax Filing' },
        { name: 'Company Registration' },
      ]
    },
    {
      id: 3,
      title: 'Legal Documents',
      items: [
        { name: 'Affidavit' },
        { name: 'E-Leave and License' },
        { name: 'Udyog Aadhar' },
        { name: 'Company Registration'},
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          <Bell className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        fixed md:static
        top-0 left-0
        h-auto min-h-screen
        w-64
        bg-white border-r border-gray-200
        p-4
        transition-transform duration-300 ease-in-out
        z-20
      `}>
        <div className="mb-8 hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem 
            icon={FileText} 
            label="Dashboard" 
            active={activeSection === 'dashboard'}
            onClick={() => handleNavigation('dashboard')} 
          />
          <SidebarItem 
            icon={FolderOpen} 
            label="Documents" 
            active={activeSection === 'documents'}
            onClick={() => handleNavigation('documents')} 
          />
          <SidebarItem 
            icon={LogOut} 
            label="Logout" 
            active={activeSection === 'logout'}
            onClick={() => handleNavigation('logout')} 
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Desktop Header */}
        <div className="hidden md:block bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Document Management</h2>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
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
                <div className="bg-purple-600 text-white px-4 md:px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg md:text-xl font-semibold">{category.title}</h2>
                </div>
                
                <CardContent className="p-0">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer transition-colors"
                      onClick={() => handleItemClick(item.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="text-gray-400 w-4 md:w-5" />
                        <span className="font-medium text-sm md:text-base">{item.name}</span>
                      </div>
                      <ChevronRight className="text-gray-400 w-4 md:w-5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}