import React, { useState } from 'react';
import { FaSearch, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';

function Friends() {
  const [activeTab, setActiveTab] = useState('all');

  const friends = [
    { id: 1, name: "Rohit Sharma", mutual: 45, status: "friends" },
    { id: 2, name: "MS Dhoni", mutual: 89, status: "friends" },
    { id: 3, name: "Hardik Pandya", mutual: 23, status: "friends" },
    { id: 4, name: "Jasprit Bumrah", mutual: 34, status: "friends" },
    { id: 5, name: "Rishabh Pant", mutual: 12, status: "friends" },
  ];

  const requests = [
    { id: 6, name: "KL Rahul", mutual: 15, status: "pending" },
    { id: 7, name: "Shikhar Dhawan", mutual: 8, status: "pending" },
  ];

  const suggestions = [
    { id: 8, name: "Ravindra Jadeja", mutual: 28, status: "suggested" },
    { id: 9, name: "Mohammed Shami", mutual: 19, status: "suggested" },
    { id: 10, name: "Yuzvendra Chahal", mutual: 32, status: "suggested" },
  ];

  const displayData = activeTab === 'all' ? friends : 
                     activeTab === 'requests' ? requests : 
                     suggestions;

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Friends Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Friends</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect with your friends and make new ones</p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Friends', count: friends.length },
              { id: 'requests', label: 'Requests', count: requests.length },
              { id: 'suggestions', label: 'Suggestions', count: suggestions.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
              placeholder="Search friends..."
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayData.map((person) => (
            <div key={person.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${person.name}&background=random`}
                  alt={person.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{person.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {person.mutual} mutual friends
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    {person.status === 'friends' && (
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                        Message
                      </button>
                    )}
                    {person.status === 'pending' && (
                      <>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 flex items-center gap-1">
                          <FaCheck className="text-xs" />
                          Confirm
                        </button>
                        <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          Delete
                        </button>
                      </>
                    )}
                    {person.status === 'suggested' && (
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 flex items-center gap-1">
                        <FaUserPlus className="text-xs" />
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Friends;