import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import LivestockForm from '../../livestock/LivestockForm';

const LivestockSection = () => {
  const [livestock, setLivestock] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API call
  useEffect(() => {
    setLivestock([
      {
        id: 1,
        tagId: 'COW-001',
        name: 'Bessie',
        livestockType: { livestockType: 'Cattle' },
        breed: { breedName: 'Holstein' },
        dateOfBirth: '2020-03-15',
        description: 'High milk producer'
      },
      {
        id: 2,
        tagId: 'BULL-001',
        name: 'Thunder',
        livestockType: { livestockType: 'Cattle' },
        breed: { breedName: 'Angus' },
        dateOfBirth: '2019-08-22',
        description: 'Prize winning bull'
      }
    ]);
  }, []);

  const filteredLivestock = livestock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tagId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingItem) {
      setLivestock(livestock.map(item => 
        item.id === editingItem.id ? { ...item, ...data } : item
      ));
    } else {
      setLivestock([...livestock, { id: Date.now(), ...data }]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Livestock Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Livestock</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search livestock..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLivestock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.tagId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.livestockType?.livestockType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.breed?.breedName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.dateOfBirth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <LivestockForm
          item={editingItem}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default LivestockSection;