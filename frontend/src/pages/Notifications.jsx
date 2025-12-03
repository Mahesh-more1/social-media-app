import React, { useEffect, useState, useRef } from "react";
import {
  FaUsers,
  FaHeart,
  FaComment,
  FaShare,
  FaUserPlus,
  FaTag,
  FaTrash,
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

function Notifications() {
  const { state, dispatch } = useSocialMedia();
  const [loading, setLoading] = useState(true);
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
      console.log("Notifications loaded:", notifications);
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
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">
            Loading notifications...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Notifications Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0
                  ? `You have ${unreadCount} new notification${
                      unreadCount !== 1 ? "s" : ""
                    }`
                  : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {state.notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No notifications yet
              </p>
            </div>
          ) : (
            state.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border-l-4 transition ${
                  notification.isRead
                    ? "border-transparent"
                    : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Notification Icon */}
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white text-sm">
                          <span className="font-semibold">
                            {notification.senderName}
                          </span>{" "}
                          {notification.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}{" "}
                          {new Date(notification.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 hover:scale-125 transition"
                        />
                      )}
                    </div>
                  </div>

                  {/* User Avatar & Delete */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${notification.senderName}&background=random`}
                      alt={notification.senderName}
                      className="w-10 h-10 rounded-full"
                    />
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                      title="Delete notification"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
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
