import { API_URL } from "../config";

export const addUserToServer = async (formData) => {
  try {
    console.log("📤 Sending to server:", formData);
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    console.log("✅ Server response:", data);
    return data;
  } catch (error) {
    console.error("❌ Signup error:", error);
    throw error;
  }
};
export const updatedProfileToServer = async (updatedUserProfile) => {
  try {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      throw new Error("No token found. Please login.");
    }

    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: updatedUserProfile,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Profile update failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};
export const loginUserToServer = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();

    // ✅ Return object with token AND mapped user
    return {
      token: data.token,
      user: mapBackendUserToFrontend(data.user),
      message: data.message,
    };
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

export const getUsersFromServer = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch users");
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error("❌ Fetch users error:", error);
    throw error;
  }
};

export const followToggle = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please login.");
    }

    const response = await fetch(`${API_URL}/api/user/${userId}/follow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Follow toggle failed");
    }

    const data = await response.json();

    return {
      currentUser: mapBackendUserToFrontend(data.user), // Current user with updated following
      targetUser: mapBackendUserToFrontend(data.targetUser), // Target user with updated followers
    };
  } catch (error) {
    console.error("❌ Follow error:", error);
    throw error;
  }
};
export const mapBackendUserToFrontend = (backendUser) => {
  console.log("🔍 Backend user:", backendUser);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  const mapped = {
    id: backendUser.id,
    userName: backendUser.userName,
    email: backendUser.email,
    handle: backendUser.handle,
    bio: backendUser.bio || "",
    profilePicture: backendUser.profilePicture || "",
    coverPhoto: backendUser.coverPhoto || "",
    location: backendUser.location || "",
    profession: backendUser.profession || "",
    website: backendUser.website || "",
    initials: getInitials(backendUser.userName),
    joinDate: backendUser.createdAt,
    followers: Array.isArray(backendUser.followers)
      ? backendUser.followers.map((id) => id.toString())
      : [],
    followersCount: backendUser.followersCount || 0,
    following: Array.isArray(backendUser.following)
      ? backendUser.following.map((id) => id.toString())
      : [],
    followingCount: backendUser.followingCount || 0,
    postsCount: backendUser.postsCount || 0,
    bookmarks: Array.isArray(backendUser.bookmarks)
      ? backendUser.bookmarks.map((id) => id.toString())
      : [],
  };

  console.log("✅ Mapped user:", mapped);
  return mapped;
};
