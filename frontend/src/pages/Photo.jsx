import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import Modal from "../components/Modal";
import Post from "../components/Post";
import CreateAlbumModal from "../components/CreateAlbumModal";
import { Link } from "react-router-dom";

const Photo = () => {
  const { state } = useSocialMedia();
  const { albums } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Safe check for currentUser
  const userId = state.currentUser?.id;

  const selectedPost = selectedPostId
    ? state.posts.find((post) => post.id === selectedPostId)
    : null;

  // Filter posts only if user exists
  const recentPosts = userId
    ? state.posts.filter((post) => post.authorId === userId)
    : [];

  const recentPhoto = recentPosts.flatMap((post) => {
    if (!post.postImages || post.postImages.length === 0) return [];

    return post.postImages.map((imgUrl) => ({
      imgUrl,
      postId: post.id,
      likes: post.likes,
    }));
  });

  const photosCount = recentPhoto.length;
  const albumCount = albums.length;
  const videoCount = 0;

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaImages className="text-2xl text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Photos & Albums
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your memories and collections
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {photosCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Photos
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {albumCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Albums
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {videoCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Videos
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Albums
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 col-span-full">
                No albums yet.
              </p>
            ) : (
              albums.map((album) => (
                <Link to={`/album/${album._id}`} key={album._id}>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <img
                      loading="lazy"
                      src={
                        album.posts.length > 0 &&
                        album.posts[0].postImages &&
                        album.posts[0].postImages.length > 0
                          ? album.posts[0].postImages[0]
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={album.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Error";
                      }}
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {album.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {album.posts.length} photos
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}

            <div
              className="bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setCreateAlbumModalOpen(true)}
            >
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl text-gray-500 dark:text-gray-400">
                  +
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Create Album
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {recentPhoto.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 col-span-full">
                No recent photos.
              </p>
            ) : (
              recentPhoto.map((photo, index) => (
                <div
                  key={index}
                  className="relative flex group cursor-pointer"
                  onClick={() => {
                    setSelectedPostId(photo.postId);
                    setIsModalOpen(true);
                  }}
                >
                  <img
                    loading="lazy"
                    src={photo.imgUrl}
                    alt={`Photo ${index}`}
                    className="w-full h-32 object-cover rounded-lg bg-gray-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                  <div className="absolute inset-0 z-[-1] bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 text-white flex items-center gap-1 text-lg font-semibold">
                      <span>❤️</span> {photo.likes}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPostId(null);
        }}
      >
        {selectedPost && <Post post={selectedPost} />}
      </Modal>

      <CreateAlbumModal
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setCreateAlbumModalOpen(false)}
      />
    </main>
  );
};

export default Photo;
