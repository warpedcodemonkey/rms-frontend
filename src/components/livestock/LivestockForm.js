import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const LivestockForm = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tagId: '',
    name: '',
    livestockType: '',
    breed: '',
    dateOfBirth: '',
    description: '',
    ...item
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">
            {item ? 'Edit Livestock' : 'Add New Livestock'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tag ID</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.tagId}
              onChange={(e) => handleChange('tagId', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Livestock Type</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.livestockType}
              onChange={(e) => handleChange('livestockType', e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Cattle">Cattle</option>
              <option value="Sheep">Sheep</option>
              <option value="Goats">Goats</option>
              <option value="Pigs">Pigs</option>
              <option value="Horses">Horses</option>
              <option value="Chickens">Chickens</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Breed</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
            >
              <option value="">Select Breed</option>
              <option value="Holstein">Holstein</option>
              <option value="Angus">Angus</option>
              <option value="Hereford">Hereford</option>
              <option value="Jersey">Jersey</option>
              <option value="Charolais">Charolais</option>
              <option value="Limousin">Limousin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description or notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivestockForm;