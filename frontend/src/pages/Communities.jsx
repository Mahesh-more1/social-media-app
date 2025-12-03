import React, { useState } from 'react';
import { FaUsers, FaSearch, FaPlus, FaLock } from 'react-icons/fa';

function Communities() {
  const [activeTab, setActiveTab] = useState('joined');

  const joinedCommunities = [
    { id: 1, name: "Cricket Lovers", members: "45.6K", posts: "12.4K", private: false, joined: true },
    { id: 2, name: "Tech Enthusiasts", members: "89.2K", posts: "23.1K", private: false, joined: true },
    { id: 3, name: "Fitness Freaks", members: "34.7K", posts: "8.9K", private: true, joined: true },
  ];

  const suggestedCommunities = [
    { id: 4, name: "Foodies United", members: "67.8K", posts: "15.2K", private: false, joined: false },
    { id: 5, name: "Travel Buddies", members: "23.4K", posts: "6.7K", private: false, joined: false },
    { id: 6, name: "Movie Buffs", members: "78.9K", posts: "19.3K", private: false, joined: false },
  ];

  const displayData = activeTab === 'joined' ? joinedCommunities : suggestedCommunities;

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Communities Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUsers className="text-2xl text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communities</h1>
              <p className="text-gray-600 dark:text-gray-400">Connect with people who share your interests</p>
            </div>
          </div>

          {/* Create Community Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
            <FaPlus className="text-sm" />
            Create Community
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'joined', label: 'Joined', count: joinedCommunities.length },
              { id: 'discover', label: 'Discover', count: suggestedCommunities.length },
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
              placeholder="Search communities..."
            />
          </div>
        </div>

        {/* Communities List */}
        <div className="space-y-4">
          {displayData.map((community) => (
            <div key={community.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{community.name}</h3>
                      {community.private && <FaLock className="text-gray-400 text-xs" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {community.members} members · {community.posts} posts
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {community.private ? 'Private community' : 'Public community'}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {community.joined ? (
                  <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                    Joined
                  </button>
                ) : (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600">
                    Join Community
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Communities;