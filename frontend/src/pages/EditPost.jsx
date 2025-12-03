import React, { useState } from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import { useNavigate, useParams } from "react-router-dom";
import { EDIT_POST } from "../store/actionTypes";
import { editPostToServer } from "../services/postServices";

function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { state, dispatch } = useSocialMedia();
  const postToEdit = state.posts.find((post) => post.id === postId);
  const [postContent, setPostContent] = useState(postToEdit?.content || "");
  const [postTitle, setPostTitle] = useState(postToEdit?.title || "");
  const [postTags, setPostTags] = useState(postToEdit?.tags.join(" ") || "");
  const [selectedPostPrivacy, setSelectedPostPrivacy] = useState(
    postToEdit?.privacy || "public"
  );

  // frontend/src/pages/EditPost.jsx

  const handleEditPostSubmit = async (e, postId) => {
    e.preventDefault();

    try {
      const postData = {
        title: postTitle,
        content: postContent,
        tags: postTags.split(/[\s,]+/).filter((tag) => tag.trim()),
        privacy: selectedPostPrivacy,
      };

      console.log("📤 Updating post:", postId);

      const updatedPost = await editPostToServer(postId, postData);

      dispatch({
        type: EDIT_POST,
        payload: updatedPost,
      });

      console.log("✅ Post updated successfully!");
      alert("Post updated!");
      navigate("/");
    } catch (error) {
      console.error("❌ Edit failed:", error);
      alert(error.message);
    }
  };

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Create Post Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share what's on your mind
          </p>
        </div>

        {/* Post Creator Form */}
        <form
          onSubmit={(e) => handleEditPostSubmit(e, postId)}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6"
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://preview.redd.it/can-someone-give-me-hd-or-higher-quality-photo-of-virat-v0-wn08gbwghx5f1.jpeg?width=1252&auto=webp&s=a8e816d643481f32074a5fb96756db9a2e5e4a0b"
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Virat Kohli
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

          {/* Post Title - NEW */}
          <input
            type="text"
            name="title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full p-4 mb-3 text-gray-900 dark:text-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-lg font-semibold"
          />

          {/* Post Content */}
          <textarea
            name="content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 p-4 mb-3 text-gray-900 dark:text-white bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 text-base"
          />

          {/* Tags Input - NEW */}
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
      </div>
    </main>
  );
}

export default EditPost;
