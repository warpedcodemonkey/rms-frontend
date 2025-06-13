import React from 'react';
import { Plus } from 'lucide-react';

const AccountsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Account management interface will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">
          This will include account creation, vet permissions, and multi-tenant management.
        </p>
      </div>
    </div>
  );
};

export default AccountsSection;