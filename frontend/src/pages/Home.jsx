import React from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import Post from "../components/Post";

function Home() {
  const { state } = useSocialMedia();
  const posts = state.posts;

  // ✅ Display loading ONLY if app hasn't fetched data yet
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Card */}
        <div
          className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6 ${
            !state.currentUser ? "mt-12" : ""
          }`}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Pulse!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Welcome to Pulse! Connect, share, and vibe with your friends in
            real-time. Explore the latest posts, join conversations, and capture
            the moment.
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Home;
