import { mapServerItemToLocalItem } from "./postServices";

const API_URL = "http://localhost:3000";

// ✅ Add bookmark
export const addBookmarkToServer = async (postId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to bookmark posts");
  }

  const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add bookmark");
  }

  return await response.json();
};

// ✅ Remove bookmark
export const removeBookmarkFromServer = async (postId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to remove bookmarks");
  }

  const response = await fetch(`${API_URL}/api/bookmarks/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove bookmark");
  }

  return await response.json();
};

// ✅ Get all bookmarked posts
export const getBookmarksFromServer = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to view bookmarks");
  }

  const response = await fetch(`${API_URL}/api/bookmarks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get bookmarks");
  }

  const posts = await response.json();

  return posts.map(mapServerItemToLocalItem);
};
