const API_URL = "http://localhost:3000";

export const addPostToServer = async (postData) => {
  const token = localStorage.getItem("token");
  const responce = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Send token!
    },
    body: postData,
  });

  const newPost = await responce.json();
  console.log(newPost);
  return mapServerItemToLocalItem(newPost);
};
export const getPostsFromServer = async () => {
  const response = await fetch(`${API_URL}/api/posts`);
  const allPost = await response.json();
  return allPost.map(mapServerItemToLocalItem);
};

export const editPostToServer = async (postId, postData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to edit posts");
  }
  const response = await fetch(`${API_URL}/api/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to edit post");
  }

  const updatedPost = await response.json();

  return mapServerItemToLocalItem(updatedPost);
};

export const deletePostFromServer = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    const result = await response.json();
    console.log("✅ Deleted:", result);

    return result;
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
};

export const toggleLikePost = async (postId, isLiked) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to like posts");
  }
  const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: isLiked ? "DELETE" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle like");
  }
  return await response.json();
};

export const addCommentToPostOnServer = async (postId, text) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to like posts");
  }
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle like");
  }
  return await response.json();
};

export const deleteCommentFromTheServer = async (postId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/api/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete comment");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
};

export const toggleLikeCommentPost = async (postId, commentId,isCommentLiked) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to like posts");
  }
  const response = await fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}/like`, {
    method: isCommentLiked ? "DELETE" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle like");
  }
  return await response.json();
};

export const mapServerItemToLocalItem = (serverItem) => {
  const API_URL = "http://localhost:3000";

  const mapImageUrl = (url) => {
    if (typeof url !== "string") return "";

    const doubleUrl = `${API_URL}${API_URL}`;
    if (url.startsWith(doubleUrl)) {
      return url.replace(doubleUrl, API_URL);
    }

    if (url.startsWith("http")) {
      return url;
    }

    // Ensure it starts with a single slash
    const sanitizedUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_URL}${sanitizedUrl}`;
  };

  return {
    id: serverItem._id,
    title: serverItem.title,
    content: serverItem.content,
    author: serverItem.author,
    authorId: serverItem.authorId,
    postImages: (serverItem.postImages || []).map(mapImageUrl),
    tags: serverItem.tags || [],
    privacy: serverItem.privacy,
    likes: serverItem.likes || 0,
    likedBy: (serverItem.likedBy || []).map((id) => id.toString()),
    comments: serverItem.comments || [],
    timestamp: serverItem.createdAt,
    createdAt: serverItem.createdAt,
    updatedAt: serverItem.updatedAt,
  };
};
