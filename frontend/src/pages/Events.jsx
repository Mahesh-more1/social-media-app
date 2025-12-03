import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus, FaClock } from 'react-icons/fa';

function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingEvents = [
    { 
      id: 1, 
      title: "Cricket Match - India vs Australia", 
      date: "2024-03-15", 
      time: "14:00", 
      location: "Melbourne Cricket Ground", 
      attendees: "45.6K", 
      interested: true 
    },
    { 
      id: 2, 
      title: "Tech Conference 2024", 
      date: "2024-03-20", 
      time: "09:00", 
      location: "Convention Center", 
      attendees: "12.4K", 
      interested: false 
    },
    { 
      id: 3, 
      title: "Charity Gala Dinner", 
      date: "2024-03-25", 
      time: "19:00", 
      location: "Grand Hotel", 
      attendees: "2.3K", 
      interested: true 
    },
  ];

  const pastEvents = [
    { 
      id: 4, 
      title: "Music Festival 2024", 
      date: "2024-02-10", 
      location: "Central Park", 
      attendees: "78.9K" 
    },
    { 
      id: 5, 
      title: "Business Summit", 
      date: "2024-01-25", 
      location: "Business Center", 
      attendees: "8.7K" 
    },
  ];

  const displayData = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Events Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-2xl text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
                <p className="text-gray-600 dark:text-gray-400">Discover and join exciting events</p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
              <FaPlus className="text-sm" />
              Create Event
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
              { id: 'past', label: 'Past Events', count: pastEvents.length },
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

        {/* Events List */}
        <div className="space-y-4">
          {displayData.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-xs" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <FaClock className="text-xs" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-xs" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-xs" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  {activeTab === 'upcoming' ? (
                    <>
                      {event.interested ? (
                        <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600">
                          Interested ✓
                        </button>
                      ) : (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600">
                          Interested
                        </button>
                      )}
                      <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                        Share
                      </button>
                    </>
                  ) : (
                    <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                      View Photos
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events State */}
        {displayData.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
            <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'upcoming' 
                ? 'Check back later for new events or create your own!' 
                : 'Your past events will appear here.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Events;