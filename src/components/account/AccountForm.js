import React, { useState, useEffect } from 'react';
import { X, Save, Building2, User } from 'lucide-react';

const AccountForm = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    farmName: '',
    status: 'ACTIVE',
    membershipStart: '',
    membershipEnd: '',
    // Master user details
    masterUser: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        farmName: account.farmName || '',
        status: account.status || 'ACTIVE',
        membershipStart: account.membershipStart || '',
        membershipEnd: account.membershipEnd || '',
        masterUser: {
          username: account.masterUser?.username || '',
          email: account.masterUser?.email || '',
          password: '', // Don't populate password for editing
          firstName: account.masterUser?.firstName || '',
          lastName: account.masterUser?.lastName || '',
          phoneNumber: account.masterUser?.phoneNumber || ''
        }
      });
    }
  }, [account]);

  const validateForm = () => {
    const newErrors = {};

    // Account validation
    if (!formData.farmName.trim()) {
      newErrors.farmName = 'Farm name is required';
    }

    // Master user validation (only for new accounts)
    if (!account) {
      if (!formData.masterUser.username.trim()) {
        newErrors['masterUser.username'] = 'Username is required';
      }
      if (!formData.masterUser.email.trim()) {
        newErrors['masterUser.email'] = 'Email is required';
      }
      if (!formData.masterUser.password) {
        newErrors['masterUser.password'] = 'Password is required';
      }
      if (!formData.masterUser.firstName.trim()) {
        newErrors['masterUser.firstName'] = 'First name is required';
      }
      if (!formData.masterUser.lastName.trim()) {
        newErrors['masterUser.lastName'] = 'Last name is required';
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.masterUser.email && !emailRegex.test(formData.masterUser.email)) {
        newErrors['masterUser.email'] = 'Please enter a valid email address';
      }

      // Password validation
      if (formData.masterUser.password && formData.masterUser.password.length < 6) {
        newErrors['masterUser.password'] = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        farmName: formData.farmName,
        status: formData.status,
        membershipStart: formData.membershipStart || null,
        membershipEnd: formData.membershipEnd || null
      };

      // Include master user data only for new accounts
      if (!account) {
        payload.masterUser = formData.masterUser;
      }

      await onSave(payload);
    } catch (error) {
      console.error('Error saving account:', error);
      setErrors({ submit: 'Failed to save account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith('masterUser.')) {
      const userField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        masterUser: {
          ...prev.masterUser,
          [userField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            {account ? 'Edit Account' : 'Create New Account'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Account Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Farm Name *</label>
                <input
                  type="text"
                  required
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.farmName ? 'border-red-300' : ''
                  }`}
                  value={formData.farmName}
                  onChange={(e) => handleChange('farmName', e.target.value)}
                />
                {errors.farmName && (
                  <p className="mt-1 text-sm text-red-600">{errors.farmName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="TRIAL">Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Membership Start</label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.membershipStart}
                  onChange={(e) => handleChange('membershipStart', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Membership End</label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={formData.membershipEnd}
                  onChange={(e) => handleChange('membershipEnd', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Master User Information - Only show for new accounts */}
          {!account && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Master User Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username *</label>
                  <input
                    type="text"
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors['masterUser.username'] ? 'border-red-300' : ''
                    }`}
                    value={formData.masterUser.username}
                    onChange={(e) => handleChange('masterUser.username', e.target.value)}
                  />
                  {errors['masterUser.username'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['masterUser.username']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors['masterUser.email'] ? 'border-red-300' : ''
                    }`}
                    value={formData.masterUser.email}
                    onChange={(e) => handleChange('masterUser.email', e.target.value)}
                  />
                  {errors['masterUser.email'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['masterUser.email']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors['masterUser.firstName'] ? 'border-red-300' : ''
                    }`}
                    value={formData.masterUser.firstName}
                    onChange={(e) => handleChange('masterUser.firstName', e.target.value)}
                  />
                  {errors['masterUser.firstName'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['masterUser.firstName']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors['masterUser.lastName'] ? 'border-red-300' : ''
                    }`}
                    value={formData.masterUser.lastName}
                    onChange={(e) => handleChange('masterUser.lastName', e.target.value)}
                  />
                  {errors['masterUser.lastName'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['masterUser.lastName']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    value={formData.masterUser.phoneNumber}
                    onChange={(e) => handleChange('masterUser.phoneNumber', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors['masterUser.password'] ? 'border-red-300' : ''
                    }`}
                    value={formData.masterUser.password}
                    onChange={(e) => handleChange('masterUser.password', e.target.value)}
                  />
                  {errors['masterUser.password'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['masterUser.password']}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : (account ? 'Update Account' : 'Create Account')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;