import React, { useState } from "react";
import { FaImage, FaVideo, FaSmile, FaMapMarkerAlt } from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import { ADD_POST } from "../store/actionTypes";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import { addPostToServer } from "../services/postServices";

function CreatePost() {
  const navigate = useNavigate();
  const { state, dispatch } = useSocialMedia();
  const posts = state.posts;

  // Form states
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postTags, setPostTags] = useState("");
  const [selectedPostPrivacy, setSelectedPostPrivacy] = useState("public");

  // Image states
  const [selectedImages, setSelectedImages] = useState([]); // Array of File objects
  const [previewUrls, setPreviewUrls] = useState([]); // Array of preview URLs

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 10) {
      alert("Maximum 10 images allowed!");
      return;
    }

    setSelectedImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    URL.revokeObjectURL(previewUrls[index]);

    setSelectedImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postTitle);
      formData.append("content", postContent);
      formData.append("tags", postTags);
      formData.append("privacy", selectedPostPrivacy);
      formData.append("author", state.currentUser?.userName);
      formData.append("authorId", state.currentUser?.id);
      selectedImages.forEach((file) => {
        formData.append("photos", file);
      });
      const newPost = await addPostToServer(formData);
      dispatch({
        type: ADD_POST,
        payload: newPost,
      });
      setPostTitle("");
      setPostContent("");
      setPostTags("");
      setSelectedPostPrivacy("public");
      setSelectedImages([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      navigate("/");
    } catch (error) {
      console.error("❌ Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const userPosts = posts.filter(
    (post) => state.currentUser?.userName === post.author
  );

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Create Post Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share what's on your mind
          </p>
        </div>

        {/* Post Creator Form */}
        <form
          onSubmit={handlePostSubmit}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={state.currentUser?.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {state.currentUser?.userName}
              </h3>
              {/* Privacy Selector */}
              <select
                value={selectedPostPrivacy}
                onChange={(e) => setSelectedPostPrivacy(e.target.value)}
                className="text-xs border-none bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-gray-600 dark:text-gray-400"
              >
                <option value="public">🌍 Public</option>
                <option value="friends">👥 Friends</option>
                <option value="private">🔒 Only me</option>
              </select>
            </div>
          </div>

          {/* Post Title */}
          <input
            type="text"
            name="title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full p-4 mb-3 text-gray-900 dark:text-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-lg font-semibold"
            required
          />

          {/* Post Content */}
          <textarea
            name="content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 p-4 mb-3 text-gray-900 dark:text-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-base"
            required
          />

          {/* Tags Input */}
          <div className="mb-4">
            <input
              type="text"
              name="tags"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              placeholder="Add tags (e.g., react coding javascript)"
              className="w-full p-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate tags with spaces or commas
            </p>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Images ({previewUrls.length}/10)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImages([]);
                    previewUrls.forEach((url) => URL.revokeObjectURL(url));
                    setPreviewUrls([]);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Your Post */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Add to your post
            </p>
            <div className="flex gap-4 flex-wrap">
              {/* Photo Upload Button */}
              <label className="flex items-center gap-2 text-gray-500 hover:text-green-500 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <FaImage className="text-lg" />
                <span className="text-sm">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Other buttons (disabled for now) */}
              <button
                type="button"
                disabled
                className="flex items-center gap-2 text-gray-400 p-2 rounded-lg cursor-not-allowed opacity-50"
              >
                <FaVideo className="text-lg" />
                <span className="text-sm">Video</span>
              </button>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 text-gray-400 p-2 rounded-lg cursor-not-allowed opacity-50"
              >
                <FaSmile className="text-lg" />
                <span className="text-sm">Feeling</span>
              </button>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 text-gray-400 p-2 rounded-lg cursor-not-allowed opacity-50"
              >
                <FaMapMarkerAlt className="text-lg" />
                <span className="text-sm">Location</span>
              </button>
            </div>
          </div>

          {/* Post Button */}
          <button
            type="submit"
            disabled={!postContent.trim() || !postTitle.trim()}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
              postContent.trim() && postTitle.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            } transition-colors`}
          >
            Post
          </button>
        </form>

        {/* Recent Posts Preview */}
        <div className="mt-8">
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Nothing Here! Add your First Post 👍
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your recent posts
                </h2>
                {userPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreatePost;
