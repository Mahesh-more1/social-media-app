import React, { useEffect } from "react";
import {
  FaHashtag,
  FaNewspaper,
  FaVideo,
  FaMusic,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import { SET_SEARCH_QUERY, LOAD_USERS, LOAD_POSTS, FOLLOW_TOGGLE } from "../store/actionTypes";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { getUsersFromServer } from "../services/userServices";
import { getPostsFromServer } from "../services/postServices";

function Explore() {
  const navigate = useNavigate();
  const { state, dispatch } = useSocialMedia();
  const [isLoading, setIsLoading] = React.useState(false);

  // ✅ Fetch data if not already loaded
  useEffect(() => {
    const loadExploreData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch posts
        if (state.posts.length === 0) {
          const posts = await getPostsFromServer();
          dispatch({ type: LOAD_POSTS, payload: posts });
        }
        
        // Fetch users - ALWAYS fetch fresh to sync with backend
        const users = await getUsersFromServer();
        dispatch({ type: LOAD_USERS, payload: users });
        
      } catch (error) {
        console.error("Error loading explore data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExploreData();
  }, []); // ✅ Only runs once when Explore mounts

  const count = {};
  state.posts
    .flatMap((post) => post.tags)
    .forEach((tag) => {
      count[tag] = (count[tag] || 0) + 1;
    });
  const sortedArr = Object.entries(count).sort((a, b) => b[1] - a[1]);

  const trendingTopics = sortedArr
    .map(([tag, count]) => ({tag, count}))
    .slice(0, 5);

  const formatCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count;
  };

  const popularPosts = state.posts
    .toSorted((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const suggestedUser = state.users
    .filter((user) => user.id !== state.currentUser?.id)
    .slice(0, 6);

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Explore Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Explore
          </h1>

          {/* Categories */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { icon: FaNewspaper, label: "News" },
              { icon: FaVideo, label: "Videos" },
              { icon: FaMusic, label: "Music" },
              { icon: FaHashtag, label: "Hashtags" },
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap"
              >
                <item.icon className="text-sm" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Trending Now
            </h2>
            <div className="space-y-4">
              {trendingTopics.length === 0 ? (
                <p>No trending topics yet. Create posts with tags!</p>
              ) : (
                trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                    onClick={() => {
                      dispatch({ type: SET_SEARCH_QUERY, payload: topic.tag });
                      navigate("/search");
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Trending
                        </p>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          #{topic.tag}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCount(topic.count)} posts
                        </p>
                      </div>
                      <button className="text-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        ···
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Suggested Users */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Suggested for you
            </h2>
            <div className="space-y-4">
              {isLoading && suggestedUser.length === 0 ? (
                <p>Loading users...</p>
              ) : suggestedUser.length === 0 ? (
                <p>No users found</p>
              ) : (
                suggestedUser.map((user) => (
                  <UserCard key={user.id} user={user} suggestedUser={true} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Popular Posts */}
        {popularPosts.length === 0 ? (
          <p>No posts yet. Create the first post!</p>
        ) : (
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Posts
            </h2>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Explore;