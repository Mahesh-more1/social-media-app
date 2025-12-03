import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useSocialMedia } from "../store/SocialMediaContext";
import { addPostToAlbum } from "../services/albumService";
import CreateAlbumModal from "./CreateAlbumModal";

function AddToAlbumModal({ isOpen, onClose, postId }) {
  const { state, getAlbums } = useSocialMedia();
  const { albums, currentUser } = state;
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCreateAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      getAlbums(currentUser.id);
    }
  }, [isOpen, currentUser, getAlbums]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlbum) {
      setError("Please select an album.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addPostToAlbum(selectedAlbum, postId);
      setSuccess("Post added to album successfully!");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add post to album. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
    setSelectedAlbum("");
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Add to Album
          </h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-100 dark:bg-green-900/30 p-2 rounded-md">{success}</p>}

          {albums.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't created any albums yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose(); // Close this modal first
                  setCreateAlbumModalOpen(true);
                }}
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Create an Album
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="album-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Select an Album
                </label>
                <select
                  id="album-select"
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="" disabled>
                    Choose an album...
                  </option>
                  {albums.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedAlbum}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add to Album"}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* This allows creating an album from the Photo page context as well */}
      <CreateAlbumModal
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setCreateAlbumModalOpen(false)}
      />
    </>
  );
}

export default AddToAlbumModal;
