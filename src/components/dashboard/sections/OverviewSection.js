import React from 'react';
import { Heart, Scale, Syringe, Calendar } from 'lucide-react';

const OverviewSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Livestock</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Scale className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent Weighings</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Syringe className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vaccinations Due</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Breeding Records</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New livestock added: Animal #247</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Scale className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Weight recorded for Bull #123</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Syringe className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Vaccination due for Animal #156</p>
                <p className="text-xs text-gray-500">Tomorrow</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Breeding check for Heifer #089</p>
                <p className="text-xs text-gray-500">In 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;