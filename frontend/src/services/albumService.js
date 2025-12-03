import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.token : null;
};

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const getUserAlbums = async (userId) => {
  const response = await axios.get(`${API_URL}/albums/user/${userId}`);
  return response.data;
};

export const createAlbum = async (albumData) => {
  const response = await axios.post(`${API_URL}/albums`, albumData, getAuthConfig());
  return response.data;
};

export const getAlbumById = async (albumId) => {
  const response = await axios.get(`${API_URL}/albums/${albumId}`);
  return response.data;
};

export const addPostToAlbum = async (albumId, postId) => {
  const response = await axios.put(
    `${API_URL}/albums/${albumId}/add-post`,
    { postId },
    getAuthConfig()
  );
  return response.data;
};

export const removePostFromAlbum = async (albumId, postId) => {
  const response = await axios.put(
    `${API_URL}/albums/${albumId}/remove-post`,
    { postId },
    getAuthConfig()
  );
  return response.data;
};

export const deleteAlbum = async (albumId) => {
  const response = await axios.delete(`${API_URL}/albums/${albumId}`, getAuthConfig());
  return response.data;
};
