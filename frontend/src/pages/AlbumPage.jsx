import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  getAlbumById,
  removePostFromAlbum,
  deleteAlbum,
} from "../services/albumService";
import { mapServerItemToLocalItem } from "../services/postServices"; // ✅ Import Mapper
import Post from "../components/Post";
import { FaArrowLeft, FaTrash, FaTimes } from "react-icons/fa";

function AlbumPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { state, getAlbums } = useSocialMedia();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = state.currentUser;

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbumById(albumId);

        // ✅ FIX: Map raw posts to local format AND extract author profile/name
        if (albumData && albumData.posts) {
          albumData.posts = albumData.posts.map((post) => {
            // The backend populates authorId as an object { _id, username, profilePicture }
            const populatedAuthor = post.authorId || {};

            return {
              ...mapServerItemToLocalItem(post), // Handles id, images, etc.
              // Explicitly pass profile and name from the populated object
              authorProfile: populatedAuthor.profilePicture,
              author: populatedAuthor.username || post.author,
              authorId: populatedAuthor._id
                ? populatedAuthor._id.toString()
                : post.authorId,
              // Ensure timestamp exists (mapServerItemToLocalItem might use createdAt)
              timestamp: post.createdAt,
            };
          });
        }

        setAlbum(albumData);
      } catch (err) {
        setError("Failed to fetch album details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const handleRemovePost = async (postId) => {
    if (!window.confirm("Remove this post from the album?")) return;

    try {
      await removePostFromAlbum(albumId, postId);
      setAlbum((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p.id !== postId), // Use .id because we mapped it
      }));
      if (currentUser) getAlbums(currentUser.id);
    } catch (error) {
      console.error("Failed to remove post:", error);
      alert("Failed to remove post");
    }
  };

  // ✅ NEW: This handles the "Delete" (Trash Can) action from inside the Post component
  const handlePostDeletionSuccess = (postId) => {
    setAlbum((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    }));
  };

  const handleDeleteAlbum = async () => {
    if (window.confirm("Are you sure you want to delete this ENTIRE album?")) {
      try {
        await deleteAlbum(albumId);
        if (currentUser) getAlbums(currentUser.id);
        navigate("/photos");
      } catch (error) {
        console.error("Failed to delete album:", error);
        alert("Could not delete album");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error || "Album not found"}
      </div>
    );
  }

  const albumCreatorId = album.creator?._id || album.creator;

  const currentUserId = currentUser?.id || currentUser?._id;

  const isOwner =
    currentUserId &&
    albumCreatorId &&
    String(albumCreatorId) === String(currentUserId);

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/photos"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
          >
            <FaArrowLeft />
            Back to Albums
          </Link>

          {/* ✅ Delete Album Button (Visible only to owner) */}
          {isOwner && (
            <button
              onClick={handleDeleteAlbum}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors text-sm font-medium"
            >
              <FaTrash size={14} /> Delete Album
            </button>
          )}
        </div>

        {/* Album Info Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {album.name}
          </h1>
          {album.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              {album.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4 font-medium">
            {album.posts.length} {album.posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {album.posts.length > 0 ? (
            album.posts.map((post) => (
              <div key={post.id} className="relative group">
                {/* Render Post with hideAddToAlbum=true AND pass onDelete */}
                <Post
                  post={post}
                  hideAddToAlbum={true}
                  onDelete={handlePostDeletionSuccess} // ✅ Passed here
                />

                {isOwner && (
                  <button
                    onClick={() => handleRemovePost(post.id)}
                    className="absolute top-4 right-4 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all z-20 flex items-center justify-center"
                    title="Remove from album"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                This album has no posts yet.
              </p>
              <Link
                to="/"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Go explore to add some!
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AlbumPage;
