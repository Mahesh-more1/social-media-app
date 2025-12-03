import React from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import Post from "../components/Post";
import { useEffect } from "react";
import { getPostsFromServer } from "../services/postServices";
import { getBookmarksFromServer } from "../services/bookmarkServices";
import { getUsersFromServer } from "../services/userServices";

function Home() {
  const { state, dispatch } = useSocialMedia();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const posts = await getPostsFromServer();
        dispatch({ type: "LOAD_POSTS", payload: posts });

        const users = await getUsersFromServer();
        dispatch({ type: "LOAD_USERS", payload: users });

        const bookmarksData = await getBookmarksFromServer();
        const bookmarkIds = bookmarksData.map((p) => p.id);
        dispatch({ type: "LOAD_BOOKMARKS", payload: bookmarkIds });
      } catch (error) {
        console.error("Home load failed:", error);
      }
    };

    fetchAllData();
  }, [dispatch]);

  const posts = state.posts;

  return (
    <>
      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to SocialApp!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              This is a fully responsive social media layout. The sidebar is
              hidden on mobile and can be toggled with the menu button.
            </p>
          </div>

          {/* Sample Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
