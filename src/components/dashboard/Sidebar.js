import React from 'react';
import { 
  Users, 
  Home, 
  Settings, 
  LogOut, 
  Building2, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Overview', id: 'overview', icon: Home },
    { name: 'Livestock', id: 'livestock', icon: Heart },
    { name: 'Users', id: 'users', icon: Users },
    { name: 'Accounts', id: 'accounts', icon: Building2 },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} flex items-center space-x-2`}>
            <Heart className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">RMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`${
                    activeSection === item.id
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md w-full text-left`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {sidebarOpen && item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="border-t p-4">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} mb-4`}>
            <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">{user.primaryAccount?.farmName}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 w-full"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;