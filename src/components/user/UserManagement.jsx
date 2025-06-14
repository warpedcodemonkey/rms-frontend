import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, RotateCcw, AlertTriangle, Info, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  
  // Delete-specific state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPermanentDeleteDialog, setShowPermanentDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletionInfo, setDeletionInfo] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      isActive: user.isActive,
      // Customer specific fields
      customerNumber: user.customerNumber || '',
      emergencyContact: user.emergencyContact || '',
      emergencyPhone: user.emergencyPhone || '',
      // Admin specific fields
      department: user.department || '',
      accessLevel: user.accessLevel || '',
      // Vet specific fields
      licenseNumber: user.licenseNumber || '',
      specialization: user.specialization || '',
      clinicName: user.clinicName || '',
      clinicAddress: user.clinicAddress || '',
      yearsExperience: user.yearsExperience || ''
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const updatePayload = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          updatePayload[key] = formData[key];
        }
      });

      const response = await fetch(`/api/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess('User updated successfully');
        setIsEditing(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the user list
      } else {
        setError(responseData.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({});
    setError('');
    setSuccess('');
  };

  // Delete functionality
  const handleDeleteClick = async (user) => {
    setUserToDelete(user);
    setError('');
    setSuccess('');
    
    // Fetch deletion info
    try {
      const response = await fetch(`/api/user/${user.id}/deletion-check`, {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const info = await response.json();
        setDeletionInfo(info);
        setShowDeleteDialog(true);
      } else {
        setError('Failed to check deletion status');
      }
    } catch (err) {
      setError('Error checking deletion status');
    }
  };

  const handleSoftDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(`User ${userToDelete.username} has been deactivated`);
        setShowDeleteDialog(false);
        setUserToDelete(null);
        setDeletionInfo(null);
        fetchUsers();
      } else {
        setError(responseData.error || 'Failed to deactivate user');
      }
    } catch (err) {
      setError('Error deactivating user');
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDeleteClick = () => {
    setShowDeleteDialog(false);
    setShowPermanentDeleteDialog(true);
    setDeleteReason('');
    setDeleteConfirmed(false);
  };

  const handlePermanentDelete = async () => {
    if (!deleteConfirmed || !deleteReason.trim()) {
      setError('Please confirm deletion and provide a reason');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user/${userToDelete.id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmed: deleteConfirmed,
          reason: deleteReason
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(`User ${userToDelete.username} has been permanently deleted`);
        setShowPermanentDeleteDialog(false);
        setUserToDelete(null);
        setDeletionInfo(null);
        setDeleteReason('');
        setDeleteConfirmed(false);
        fetchUsers();
      } else {
        setError(responseData.error || 'Failed to permanently delete user');
      }
    } catch (err) {
      setError('Error permanently deleting user');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (user) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/${user.id}/reactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${localStorage.getItem('rms_auth')}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess(`User ${user.username} has been reactivated`);
        fetchUsers();
      } else {
        setError(responseData.error || 'Failed to reactivate user');
      }
    } catch (err) {
      setError('Error reactivating user');
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteDialogs = () => {
    setShowDeleteDialog(false);
    setShowPermanentDeleteDialog(false);
    setUserToDelete(null);
    setDeletionInfo(null);
    setDeleteReason('');
    setDeleteConfirmed(false);
  };

  const renderUserTypeFields = (userType) => {
    switch (userType) {
      case 'CUSTOMER':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Number
                </label>
                <input
                  type="text"
                  name="customerNumber"
                  value={formData.customerNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );
      
      case 'ADMINISTRATOR':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select
                  name="accessLevel"
                  value={formData.accessLevel || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Access Level</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                </select>
              </div>
            </div>
          </>
        );
      
      case 'VETERINARIAN':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Name
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years Experience
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience || ''}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinic Address
                </label>
                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  // Delete confirmation dialog
  const DeleteConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
          <button
            onClick={closeDeleteDialogs}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {deletionInfo && (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <strong>{deletionInfo.username}</strong>?
            </p>

            {!deletionInfo.canDelete && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                <p className="text-red-800 text-sm font-medium">Cannot Delete User</p>
                <p className="text-red-700 text-sm">{deletionInfo.validationError}</p>
                {deletionInfo.recommendations && (
                  <ul className="mt-2 text-sm text-red-700">
                    {deletionInfo.recommendations.map((rec, index) => (
                      <li key={index} className="ml-4">• {rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {deletionInfo.associatedData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                <p className="text-blue-800 text-sm font-medium">Associated Data:</p>
                <ul className="text-blue-700 text-sm">
                  <li>Livestock: {deletionInfo.associatedData.livestockCount}</li>
                  <li>Vet Permissions: {deletionInfo.associatedData.vetPermissionsCount}</li>
                  <li>Appointments: {deletionInfo.associatedData.appointmentsCount}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={closeDeleteDialogs}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          {deletionInfo?.canDelete && (
            <>
              <button
                onClick={handleSoftDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? 'Deactivating...' : 'Deactivate'}
              </button>
              <button
                onClick={handlePermanentDeleteClick}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Permanent Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Permanent delete confirmation dialog
  const PermanentDeleteDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Permanent Delete</h3>
          <button
            onClick={closeDeleteDialogs}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-800 text-sm font-bold">Warning: This action cannot be undone!</p>
            <p className="text-red-700 text-sm">
              You are about to permanently delete <strong>{userToDelete?.username}</strong>. 
              This will remove all user data from the system.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for deletion (required)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Please provide a reason for permanent deletion..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confirmDelete"
                checked={deleteConfirmed}
                onChange={(e) => setDeleteConfirmed(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="confirmDelete" className="ml-2 text-sm text-gray-700">
                I understand this action cannot be undone
              </label>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={closeDeleteDialogs}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handlePermanentDelete}
            disabled={loading || !deleteConfirmed || !deleteReason.trim()}
            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Permanently Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && !isEditing && !showDeleteDialog && !showPermanentDeleteDialog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

      {error && (
        <Alert className="mb-4">
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {!isEditing ? (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      {user.isActive ? (
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4 inline" /> Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <RotateCcw className="h-4 w-4 inline" /> Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Edit form (previous implementation)
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit User: {selectedUser?.firstName} {selectedUser?.lastName}
            </h2>
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
              {selectedUser?.userType}
            </span>
          </div>

          <form onSubmit={handleSaveUser} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive || false}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active User
                  </label>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword || ''}
                    onChange={handleInputChange}
                    placeholder="Leave blank to keep current password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters required
                  </p>
                </div>
              </div>
            </div>

            {/* Type-specific Fields */}
            {selectedUser?.userType && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {selectedUser.userType} Specific Information
                </h3>
                {renderUserTypeFields(selectedUser.userType)}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation dialogs */}
      {showDeleteDialog && <DeleteConfirmationDialog />}
      {showPermanentDeleteDialog && <PermanentDeleteDialog />}
    </div>
  );
};

export default UserManagement;