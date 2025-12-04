import axios from "axios";

import { API_URL } from "../config";

// ✅ FIX: Get token directly from "token" key, not from inside "user" object
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const getUserAlbums = async (userId) => {
  const response = await axios.get(`${API_URL}/api/albums/user/${userId}`);
  return response.data;
};

export const createAlbum = async (albumData) => {
  // This header call will now have the correct token
  const response = await axios.post(
    `${API_URL}/api/albums`,
    albumData,
    getAuthConfig()
  );
  return response.data;
};

export const getAlbumById = async (albumId) => {
  const response = await axios.get(`${API_URL}/api/albums/${albumId}`);
  return response.data;
};

export const addPostToAlbum = async (albumId, postId) => {
  const response = await axios.put(
    `${API_URL}/api/albums/${albumId}/add-post`,
    { postId },
    getAuthConfig()
  );
  return response.data;
};

export const removePostFromAlbum = async (albumId, postId) => {
  const response = await axios.put(
    `${API_URL}/api/albums/${albumId}/remove-post`,
    { postId },
    getAuthConfig()
  );
  return response.data;
};

export const deleteAlbum = async (albumId) => {
  const response = await axios.delete(
    `${API_URL}/api/albums/${albumId}`,
    getAuthConfig()
  );
  return response.data;
};
