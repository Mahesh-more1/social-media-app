import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useSocialMedia } from "../store/SocialMediaContext";
import { addPostToAlbum } from "../services/albumService";
import CreateAlbumModal from "./CreateAlbumModal";
import { FaPlus, FaSearch, FaFolder, FaCheckCircle } from "react-icons/fa";

function AddToAlbumModal({ isOpen, onClose, postId }) {
  const { state, getAlbums } = useSocialMedia();
  const { albums, currentUser } = state;

  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Nested Modal State
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      getAlbums(currentUser.id);
      // Reset state when opening
      setSelectedAlbum("");
      setError("");
      setSuccess("");
      setSearchQuery("");
    }
  }, [isOpen, currentUser, getAlbums]);

  const handleSubmit = async () => {
    if (!selectedAlbum) {
      setError("Please select an album.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addPostToAlbum(selectedAlbum, postId);
      setSuccess("Saved to album!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add post.");
    } finally {
      setLoading(false);
    }
  };

  // Filter albums based on search
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full mx-auto h-[80vh] flex flex-col">
          {/* --- Header --- */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Save to Album
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Choose a collection to save this post
            </p>
          </div>

          {/* --- Search Bar --- */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* --- Error/Success Messages --- */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg mb-4 text-center text-sm">
              {success}
            </div>
          )}

          {/* --- Albums Grid (Scrollable Area) --- */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* 1. Create New Album Card */}
              <div
                onClick={() => setCreateModalOpen(true)}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-800 transition-colors">
                  <FaPlus className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" />
                </div>
                <span className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  Create New
                </span>
              </div>

              {/* 2. Album Cards */}
              {filteredAlbums.map((album) => {
                const isSelected = selectedAlbum === album._id;
                // Get first image of album for cover, if exists
                const coverImage =
                  album.posts.length > 0 &&
                  album.posts[0].postImages &&
                  album.posts[0].postImages.length > 0
                    ? album.posts[0].postImages[0]
                    : null;

                return (
                  <div
                    key={album._id}
                    onClick={() => setSelectedAlbum(album._id)}
                    className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                        : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    {/* Card Image / Placeholder */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                      {coverImage ? (
                        <img
                          loading="lazy"
                          src={coverImage}
                          alt={album.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaFolder className="text-4xl text-gray-300 dark:text-gray-600" />
                        </div>
                      )}

                      {/* Dark Overlay on hover or select */}
                      <div
                        className={`absolute inset-0 bg-black/10 transition-opacity ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />

                      {/* Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-blue-500 bg-white rounded-full">
                          <FaCheckCircle size={22} />
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {album.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {album.posts.length} posts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State (Search results) */}
            {filteredAlbums.length === 0 && searchQuery && (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  No albums found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* --- Footer Actions --- */}
          <div className="pt-6 mt-auto border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !selectedAlbum}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
            >
              {loading ? "Saving..." : "Done"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Nested Create Album Modal */}
      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          if (currentUser) getAlbums(currentUser.id);
        }}
      />
    </>
  );
}

export default AddToAlbumModal;
