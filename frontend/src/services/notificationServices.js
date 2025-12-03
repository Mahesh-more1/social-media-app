const API_URL = "http://localhost:3000";

const mapNotificationResponse = (notification) => {
  return {
    id: notification.id,
    userId: notification.userId,
    senderId: notification.senderId,
    senderName: notification.senderName,
    type: notification.type,
    action: notification.action,
    postId: notification.postId,
    commentId: notification.commentId,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };
};

export const createNotificationOnServer = async (notificationData) => {
  const response = await fetch(`${API_URL}/api/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create notification");
  }

  const { data } = await response.json();
  return mapNotificationResponse(data);
};

export const getNotificationsFromServer = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(`${API_URL}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch notifications");
  }

  const { data } = await response.json();
  return data.map(mapNotificationResponse);
};

export const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark notification as read");
  }

  const { data } = await response.json();
  return mapNotificationResponse(data);
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Failed to mark all notifications as read"
    );
  }

  return true;
};

export const deleteNotificationFromServer = async (notificationId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(
    `${API_URL}/api/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete notification");
  }

  return true;
};
