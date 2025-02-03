"use client";
import React, { useState, useEffect } from 'react';
import { Bell, FileText, Search, FolderOpen, Users, Menu, X, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    documents: {
      total: 0,
      pending: 0,
      active: 0,
      processed: 0,
      rejected: 0
    },
    users: {
      total: 0,
      registrations: {
        daily: [],
        weekly: [],
        monthly: [],
        yearly: []
      }
    }
  });
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

  const StatCard = React.memo(({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  ));

  const AnalyticsCard = React.memo(({ title, children }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  ));

  const RegistrationTrends = React.memo(({ data }) => {
    const [timeframe, setTimeframe] = useState('daily');
    
    const formatData = () => {
      if (!data) return [];
      
      switch(timeframe) {
        case 'daily':
          return data.daily?.map(item => {
            const date = new Date(item._id.year, item._id.month - 1, item._id.day);
            return {
              period: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
              registrations: item.count
            };
          }) || [];
        case 'weekly':
          return data.weekly?.map(item => ({
            period: `Week ${item._id.week}`,
            registrations: item.count
          })) || [];
        case 'monthly':
          return data.monthly?.map(item => ({
            period: `${new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' })} ${item._id.year}`,
            registrations: item.count
          })) || [];
        case 'yearly':
          return data.yearly?.map(item => ({
            period: item._id.year.toString(),
            registrations: item.count
          })) || [];
        default:
          return [];
      }
    };

    return (
      <AnalyticsCard title="User Registration Trends">
        <div className="flex justify-end gap-2 mb-4">
          {['daily', 'weekly', 'monthly', 'yearly'].map(option => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-4 py-2 rounded-lg text-sm ${
                timeframe === option 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period"
                angle={timeframe === 'daily' ? -45 : 0}
                textAnchor={timeframe === 'daily' ? 'end' : 'middle'}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={timeframe === 'daily'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>
    );
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/document-stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statusData = [
    { name: 'Processed', value: stats.documents.processed, color: '#4F46E5' },
    { name: 'Active', value: stats.documents.active, color: '#10B981' },
    { name: 'Pending', value: stats.documents.pending, color: '#F59E0B' },
    { name: 'Rejected', value: stats.documents.rejected, color: '#EF4444' }
  ];

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
        <div className="mb-8 flex items-center justify-between">
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
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <StatCard icon={Users} label="Total Users" value={stats.users.total} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={FolderOpen} label="Total Documents" value={stats.documents.total} />
            <StatCard icon={FolderOpen} label="Pending Documents" value={stats.documents.pending} />
            <StatCard icon={FileText} label="Active Documents" value={stats.documents.active} />
            <StatCard icon={Bell} label="Processed Documents" value={stats.documents.processed} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AnalyticsCard title="Document Status Distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsCard>

            <AnalyticsCard title="Document Status Comparison">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnalyticsCard>
          </div>

          <RegistrationTrends data={stats.users.registrations} />
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