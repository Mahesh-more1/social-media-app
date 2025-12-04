import React, { useMemo } from "react";
import {
  FaHashtag,
  FaNewspaper,
  FaVideo,
  FaMusic,
  FaFire,
  FaUserPlus,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import { SET_SEARCH_QUERY } from "../store/actionTypes";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import UserCard from "../components/UserCard";

function Explore() {
  const navigate = useNavigate();
  const { state, dispatch } = useSocialMedia();

  // ✅ OPTIMIZATION: Calculate Trending Topics only when posts change
  const trendingTopics = useMemo(() => {
    const count = {};
    state.posts
      .flatMap((post) => post.tags)
      .forEach((tag) => {
        count[tag] = (count[tag] || 0) + 1;
      });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }))
      .slice(0, 5);
  }, [state.posts]);

  // ✅ OPTIMIZATION: Calculate Popular Posts only when posts change
  const popularPosts = useMemo(() => {
    return state.posts.toSorted((a, b) => b.likes - a.likes).slice(0, 5);
  }, [state.posts]);

  const formatCount = (count) => {
    return count >= 1000 ? (count / 1000).toFixed(1) + "K" : count;
  };

  const suggestedUser = state.users
    .filter((user) => user.id !== state.currentUser?.id)
    .slice(0, 6);

  // Only show loading if we really have NO data
  if (state.posts.length === 0 && state.users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Explore Header & Categories */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Explore
          </h1>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { icon: FaFire, label: "Trending", color: "text-orange-500" },
              { icon: FaNewspaper, label: "News", color: "text-blue-500" },
              { icon: FaVideo, label: "Videos", color: "text-red-500" },
              { icon: FaMusic, label: "Music", color: "text-purple-500" },
              { icon: FaHashtag, label: "Hashtags", color: "text-green-500" },
            ].map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all whitespace-nowrap group"
              >
                <item.icon
                  className={`text-lg ${item.color} group-hover:scale-110 transition-transform`}
                />
                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Popular Posts) - Spans 8 columns */}
          <div className="lg:col-span-8 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaFire className="text-orange-500" /> Popular Posts
                </h2>
              </div>
              <div className="space-y-6">
                {popularPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area - Spans 4 columns */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Trending Topics Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaHashtag className="text-blue-500" /> Trending Now
                </h2>
                <div className="space-y-1">
                  {trendingTopics.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No trending topics yet.
                    </p>
                  ) : (
                    trendingTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="group p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl cursor-pointer transition-colors"
                        onClick={() => {
                          dispatch({
                            type: SET_SEARCH_QUERY,
                            payload: topic.tag,
                          });
                          navigate("/search");
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                              {index + 1} · Trending
                            </p>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              #{topic.tag}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatCount(topic.count)} posts
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            ···
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Suggested Users Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUserPlus className="text-green-500" /> Suggested for you
                </h2>
                <div className="space-y-4">
                  {suggestedUser.map((user) => (
                    <UserCard key={user.id} user={user} suggestedUser={true} />
                  ))}
                </div>
                <button className="w-full mt-6 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                  Show More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Explore;
