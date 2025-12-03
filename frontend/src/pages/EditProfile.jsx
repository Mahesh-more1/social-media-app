import React, { useState } from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import { EDIT_PROFILE } from "../store/actionTypes";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaImage, FaTimes } from "react-icons/fa";
import { updatedProfileToServer } from "../services/userServices";

function EditProfile() {
  const navigate = useNavigate();
  const { state, dispatch } = useSocialMedia();
  const profileToEdit = state.currentUser;

  // Text fields
  const [handle, setHandle] = useState(profileToEdit?.handle || "");
  const [bio, setBio] = useState(profileToEdit?.bio || "");
  const [location, setLocation] = useState(profileToEdit?.location || "");
  const [profession, setProfession] = useState(profileToEdit?.profession || "");
  const [website, setWebsite] = useState(profileToEdit?.website || "");

  // Image states
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    profileToEdit?.profilePicture || ""
  );
  const [coverPreview, setCoverPreview] = useState(
    profileToEdit?.coverPhoto || ""
  );

  // Handle profile picture upload
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover photo upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfilePreview(profileToEdit?.profilePicture || "");
  };

  // Remove cover photo
  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverPreview(profileToEdit?.coverPhoto || "");
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Save Changes clicked!");

    try {
      // 1. Create FormData
      const formData = new FormData();

      // 2. Add text fields
      formData.append("handle", handle);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("profession", profession);
      formData.append("website", website);

      // 3. Add image files (if selected)
      if (profileImageFile) {
        formData.append("profilePicture", profileImageFile);
        console.log("📷 Adding profile picture");
      }

      if (coverImageFile) {
        formData.append("coverPhoto", coverImageFile);
        console.log("🖼️ Adding cover photo");
      }

      console.log("📤 Sending to backend...");

      // 4. Send to backend
      const response = await updatedProfileToServer(formData);

      console.log("✅ Backend response:", response);

      localStorage.setItem("user", JSON.stringify(response.user));
      console.log("💾 Updated localStorage");

      dispatch({
        type: EDIT_PROFILE,
        payload: response.user,
      });

      // 6. Show success message
      alert("Profile updated successfully!");

      // 7. Navigate to profile
      navigate(`/profile/${response.user.id}`);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your profile information and images
          </p>
        </div>

        <form
          onSubmit={handleEditProfileSubmit}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
        >
          {/* Cover Photo Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-visible">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaImage className="text-white text-6xl opacity-50" />
              </div>
            )}

            {/* Cover Photo Upload Button */}
            <label className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 z-10">
              <FaCamera />
              <span className="text-sm font-medium">Change Cover</span>
              <input
                type="file"
                name="coverPhoto"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>

            {/* Remove Cover Button */}
            {coverImageFile && (
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Profile Picture Section */}
          <div className="relative px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="relative inline-block">
                <img
                  src={
                    profilePreview ||
                    "https://ui-avatars.com/api/?name=User&background=random"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
                />

                {/* Profile Picture Upload Button */}
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  <FaCamera />
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>

                {/* Remove Profile Button */}
                {profileImageFile && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 mt-6">
              {/* Handle and Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Your Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Profession and Website Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profession
                  </label>
                  <input
                    type="text"
                    placeholder="Your Profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${profileToEdit?.id}`)}
                  className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditProfile;
