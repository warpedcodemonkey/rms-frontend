import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Shield, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import UserForm from '../../user/UserForm';
import apiService from '../../../services/apiService';

const UsersSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [userTypeFilter, setUserTypeFilter] = useState('all'); // all, CUSTOMER, ADMINISTRATOR, VETERINARIAN

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await apiService.createUser(userData);
      setUsers([...users, newUser]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await apiService.updateUser(editingUser.id, userData);
      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: false } : user
        ));
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await apiService.request(`/user/${userId}/reactivate`, { method: 'PUT' });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: true } : user
      ));
    } catch (error) {
      console.error('Error reactivating user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesActiveFilter = filter === 'all' || 
      (filter === 'active' && user.isActive) ||
      (filter === 'inactive' && !user.isActive);

    const matchesTypeFilter = userTypeFilter === 'all' || user.userType === userTypeFilter;

    return matchesSearch && matchesActiveFilter && matchesTypeFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
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
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* User Type Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="CUSTOMER">Customers</option>
              <option value="ADMINISTRATOR">Administrators</option>
              <option value="VETERINARIAN">Veterinarians</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.userType === 'ADMINISTRATOR' ? 'bg-purple-100 text-purple-800' :
                      user.userType === 'VETERINARIAN' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-green-600 hover:text-green-900"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {user.isActive ? (
                      <button 
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Deactivate User"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReactivateUser(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Reactivate User"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No users found matching your criteria.</div>
          </div>
        )}
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleClose}
          onSave={editingUser ? handleUpdateUser : handleCreateUser}
        />
      )}
    </div>
  );
};

export default UsersSection;