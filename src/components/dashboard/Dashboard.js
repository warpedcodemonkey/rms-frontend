import React, { useState } from 'react';
import Sidebar from './Sidebar';
import OverviewSection from './sections/OverviewSection';
import LivestockSection from './sections/LivestockSection';
import UsersSection from './sections/UsersSection';
import AccountsSection from './sections/AccountsSection';
import SettingsSection from './sections/SettingsSection';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'livestock':
        return <LivestockSection />;
      case 'users':
        return <UsersSection />;
      case 'accounts':
        return <AccountsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;