import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Users, Building2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import AccountForm from '../../account/AccountForm';

const AccountsSection = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/account', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const accountData = await response.json();
        setAccounts(accountData);
      } else {
        console.error('Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (accountData) => {
    try {
      const response = await fetch('http://localhost:8080/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
        credentials: 'include',
      });

      if (response.ok) {
        const newAccount = await response.json();
        setAccounts([...accounts, newAccount]);
        setShowForm(false);
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  };

  const handleUpdateAccount = async (accountData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/account/${editingAccount.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedAccount = await response.json();
        setAccounts(accounts.map(account => 
          account.id === editingAccount.id ? updatedAccount : account
        ));
        setShowForm(false);
        setEditingAccount(null);
      } else {
        throw new Error('Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = (
      account.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.masterUser?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.masterUser?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="TRIAL">Trial</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Master User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livestock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {account.farmName || 'Unnamed Farm'}
                        </div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.masterUser ? 
                        `${account.masterUser.firstName} ${account.masterUser.lastName}` : 
                        'No Master User'
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {account.masterUser?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-1" />
                      {account.accountUsers?.length || 0} / 5
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.livestock?.length || 0} animals
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      account.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                      account.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                      account.status === 'TRIAL' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {account.status === 'ACTIVE' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {account.status === 'INACTIVE' && <XCircle className="h-3 w-3 mr-1" />}
                      {account.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.signupDate ? new Date(account.signupDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(account)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit Account"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">No accounts found matching your criteria.</div>
          </div>
        )}
      </div>

      {showForm && (
        <AccountForm
          account={editingAccount}
          onClose={handleClose}
          onSave={editingAccount ? handleUpdateAccount : handleCreateAccount}
        />
      )}
    </div>
  );
};

export default AccountsSection;