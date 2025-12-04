import React from "react";
import { FaBookmark } from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import Post from "../components/Post";
import { Link } from "react-router-dom";

function Bookmarks() {
  const { state } = useSocialMedia();

  const savedPosts = state.posts.filter((post) =>
    state.bookmarks.includes(post.id)
  );

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <FaBookmark className="text-2xl text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bookmarks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your saved posts ({savedPosts.length})
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        {savedPosts.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
            <FaBookmark className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save posts from the home page to see them here.
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
    </main>
  );
}

export default Bookmarks;
