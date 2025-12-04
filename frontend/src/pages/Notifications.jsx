import React, { useEffect, useState, useRef } from "react";
import {
  FaUsers,
  FaHeart,
  FaComment,
  FaShare,
  FaUserPlus,
  FaTag,
  FaTrash,
  FaBell,
  FaAt,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  LOAD_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  DELETE_NOTIFICATION,
} from "../store/actionTypes";
import {
  getNotificationsFromServer,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationFromServer,
} from "../services/notificationServices";
import { Link } from "react-router-dom";

function Notifications() {
  const { state, dispatch } = useSocialMedia();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      loadNotifications();
      hasLoaded.current = true;
    }

    // Refresh notifications every 5 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const notifications = await getNotificationsFromServer();
      dispatch({ type: LOAD_NOTIFICATIONS, payload: notifications });
      setLoading(false);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      dispatch({ type: MARK_NOTIFICATION_READ, payload: notificationId });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      dispatch({ type: MARK_ALL_NOTIFICATIONS_READ });
      await loadNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotificationFromServer(notificationId);
      dispatch({ type: DELETE_NOTIFICATION, payload: notificationId });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-red-500" />;
      case "comment":
        return <FaComment className="text-blue-500" />;
      case "share":
        return <FaShare className="text-green-500" />;
      case "follow":
        return <FaUserPlus className="text-purple-500" />;
      case "message":
        return <FaComment className="text-indigo-500" />;
      case "mention":
        return <FaAt className="text-orange-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  // Filter Logic
  const filteredNotifications = state.notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Likes") return n.type === "like";
    if (activeTab === "Comments") return n.type === "comment";
    if (activeTab === "Mentions")
      return n.type === "mention" || n.type === "tag";
    return true;
  });

  const tabs = [
    { id: "All", label: "All" },
    { id: "Likes", label: "Likes" },
    { id: "Comments", label: "Comments" },
    { id: "Mentions", label: "Mentions" },
  ];

  if (loading) {
    return (
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-2xl mx-auto flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Notifications Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Stay updated with your latest interactions.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBell className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "All"
                  ? "You're all caught up! Check back later."
                  : `No ${activeTab.toLowerCase()} yet.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative bg-white dark:bg-gray-900 rounded-xl p-4 transition-all hover:shadow-md border border-gray-100 dark:border-gray-700 ${
                  !notification.isRead
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full flex-shrink-0 ${
                      !notification.isRead
                        ? "bg-white dark:bg-gray-800 shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                        <span className="font-bold hover:underline cursor-pointer">
                          {notification.senderName}
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-300">
                          {notification.action}
                        </span>
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(
                          notification.createdAt
                        ).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? new Date(notification.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <FaTrash size={10} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Notifications;
