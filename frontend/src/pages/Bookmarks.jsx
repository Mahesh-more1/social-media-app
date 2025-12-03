import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import Post from "../components/Post";
import { LOAD_POSTS, LOAD_BOOKMARKS } from "../store/actionTypes";
import { getPostsFromServer } from "../services/postServices";
import { getBookmarksFromServer } from "../services/bookmarkServices";

function Bookmarks() {
  const { state, dispatch } = useSocialMedia();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeBookmarksPage = async () => {
      try {
        setLoading(true);
        const allPosts = await getPostsFromServer();
        dispatch({
          type: LOAD_POSTS,
          payload: allPosts,
        });
        const bookmarksData = await getBookmarksFromServer();
        const bookmarkIds = bookmarksData.map(post => post.id);
        dispatch({
          type: LOAD_BOOKMARKS,
          payload: bookmarkIds,
        });

      } catch (error) {
        console.error("❌ Failed to initialize bookmarks:", error);
        alert("Failed to load bookmarks page");
      } finally {
        setLoading(false);
      }
    };

    initializeBookmarksPage();
  }, [dispatch]);

  const savedPosts = state.posts.filter(post => 
    state.bookmarks.includes(post.id)
  );

  if (loading) {
    return (
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center max-w-md mx-auto">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading your bookmarks...</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fetching posts and bookmarks</p>
        </div>
      </main>
    );
  }
  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <FaBookmark className="text-2xl text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your saved posts ({savedPosts.length})
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {savedPosts.map(post => (
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
          </div>
        )}
      </div>
    </main>
  );
}
export default Bookmarks;
