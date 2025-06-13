import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';

const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userType: 'CUSTOMER',
    isActive: true,
    // Customer specific
    customerNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    // Administrator specific
    department: '',
    accessLevel: 1,
    // Veterinarian specific
    licenseNumber: '',
    specialization: '',
    clinicName: '',
    clinicAddress: '',
    yearsExperience: 0
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't populate password for editing
        confirmPassword: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        userType: user.userType || 'CUSTOMER',
        isActive: user.isActive !== undefined ? user.isActive : true,
        // Customer specific
        customerNumber: user.customerNumber || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || '',
        // Administrator specific
        department: user.department || '',
        accessLevel: user.accessLevel || 1,
        // Veterinarian specific
        licenseNumber: user.licenseNumber || '',
        specialization: user.specialization || '',
        clinicName: user.clinicName || '',
        clinicAddress: user.clinicAddress || '',
        yearsExperience: user.yearsExperience || 0
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only for new users or when password is being changed)
    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // User type specific validations
    if (formData.userType === 'VETERINARIAN' && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required for veterinarians';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create the payload based on user type
      const payload = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType,
        isActive: formData.isActive
      };

      // Add password if provided
      if (formData.password) {
        payload.password = formData.password;
      }

      // Add type-specific fields
      if (formData.userType === 'CUSTOMER') {
        payload.customerNumber = formData.customerNumber;
        payload.emergencyContact = formData.emergencyContact;
        payload.emergencyPhone = formData.emergencyPhone;
      } else if (formData.userType === 'ADMINISTRATOR') {
        payload.department = formData.department;
        payload.accessLevel = formData.accessLevel;
      } else if (formData.userType === 'VETERINARIAN') {
        payload.licenseNumber = formData.licenseNumber;
        payload.specialization = formData.specialization;
        payload.clinicName = formData.clinicName;
        payload.clinicAddress = formData.clinicAddress;
        payload.yearsExperience = formData.yearsExperience;
      }

      await onSave(payload);
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const renderUserTypeFields = () => {
    switch (formData.userType) {
      case 'CUSTOMER':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Number</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.customerNumber}
                onChange={(e) => handleChange('customerNumber', e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.emergencyContact}
                onChange={(e) => handleChange('emergencyContact', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
              <input
                type="tel"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.emergencyPhone}
                onChange={(e) => handleChange('emergencyPhone', e.target.value)}
              />
            </div>
          </>
        );

      case 'ADMINISTRATOR':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Access Level</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.accessLevel}
                onChange={(e) => handleChange('accessLevel', parseInt(e.target.value))}
              >
                <option value={1}>Level 1 - Basic Admin</option>
                <option value={5}>Level 5 - Standard Admin</option>
                <option value={10}>Level 10 - Super Admin</option>
              </select>
            </div>
          </>
        );

      case 'VETERINARIAN':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number *</label>
              <input
                type="text"
                required
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.licenseNumber ? 'border-red-300' : ''
                }`}
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.clinicName}
                onChange={(e) => handleChange('clinicName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Clinic Address</label>
              <textarea
                rows={2}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.clinicAddress}
                onChange={(e) => handleChange('clinicAddress', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.yearsExperience}
                onChange={(e) => handleChange('yearsExperience', parseInt(e.target.value) || 0)}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                required
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.username ? 'border-red-300' : ''
                }`}
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.email ? 'border-red-300' : ''
                }`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                required
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.firstName ? 'border-red-300' : ''
                }`}
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name *</label>
              <input
                type="text"
                required
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.lastName ? 'border-red-300' : ''
                }`}
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                value={formData.userType}
                onChange={(e) => handleChange('userType', e.target.value)}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMINISTRATOR">Administrator</option>
                <option value="VETERINARIAN">Veterinarian</option>
              </select>
            </div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password {!user && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={user ? 'Leave empty to keep current password' : ''}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                  errors.confirmPassword ? 'border-red-300' : ''
                }`}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active User
            </label>
          </div>

          {/* User Type Specific Fields */}
          {renderUserTypeFields()}
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
             <span>{loading ? 'Saving...' : 'Save User'}</span>
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default UserForm;