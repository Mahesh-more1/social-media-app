import { API_URL } from "../config";

const mapMessageResponse = (message) => {
  return {
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderName,
    recipientId: message.recipientId,
    recipientName: message.recipientName,
    text: message.text,
    image: message.image,
    isRead: message.isRead,
    conversationId: message.conversationId,
    createdAt: message.createdAt,
  };
};

export const sendMessageToServer = async (
  recipientId,
  recipientName,
  text,
  image = null
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to send messages");
  }

  const response = await fetch(`${API_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipientId,
      recipientName,
      text,
      image,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send message");
  }

  const { data } = await response.json();
  return mapMessageResponse(data);
};

export const getConversationsFromServer = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(`${API_URL}/api/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch conversations");
  }

  const { data } = await response.json();
  return data;
};

export const getMessagesFromServer = async (conversationId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(`${API_URL}/api/messages/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch messages");
  }

  const { data } = await response.json();
  return data.map(mapMessageResponse);
};

export const deleteMessageFromServer = async (messageId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in");
  }

  const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete message");
  }

  return true;
};
