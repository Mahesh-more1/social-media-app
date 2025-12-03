import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";
import { getAlbumById } from "../services/albumService";
import Post from "../components/Post";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function AlbumPage() {
  const { albumId } = useParams();
  const { state } = useSocialMedia();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbumById(albumId);
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

  if (loading) {
    return <div className="text-center mt-10">Loading album...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!album) {
    return <div className="text-center mt-10">Album not found.</div>;
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/photos"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 mb-6"
        >
          <FaArrowLeft />
          Back to Albums
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {album.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {album.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            {album.posts.length} posts
          </p>
        </div>

        <div className="space-y-6">
          {album.posts.length > 0 ? (
            album.posts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                This album has no posts yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AlbumPage;
