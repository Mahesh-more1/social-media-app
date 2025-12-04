import React, { useState, useEffect } from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import { LOAD_USERS, LOAD_POSTS } from "../store/actionTypes";
import {
  FaFilter,
  FaSearch,
  FaUser,
  FaHashtag,
  FaRegNewspaper,
} from "react-icons/fa";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { Link } from "react-router-dom";
import { getUsersFromServer } from "../services/userServices";
import { getPostsFromServer } from "../services/postServices";

function SearchPage() {
  const { state, dispatch } = useSocialMedia();
  const searchQuery = state.searchQuery;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [slice, setSlice] = useState({
    users: 3,
    posts: 3,
    tags: 3,
    unique: 3,
  });

  // ✅ Load data if missing
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        if (state.posts.length === 0) {
          const posts = await getPostsFromServer();
          dispatch({ type: LOAD_POSTS, payload: posts });
        }
        if (state.users.length === 0) {
          const users = await getUsersFromServer();
          dispatch({ type: LOAD_USERS, payload: users });
        }
      } catch (error) {
        console.error("Error loading search data:", error);
      }
    };
    loadSearchData();
  }, []);

  const filter = ["All", "Posts", "People", "Tags"];

  const filteredPosts = state.posts.filter((post) => {
    if (searchQuery.trim() === "") return false;
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      post.author?.toLowerCase().includes(query)
    );
  });

  const filteredPostsWithTags = state.posts.filter((post) => {
    if (searchQuery.trim() === "") return false;
    const query = searchQuery.toLowerCase();
    return (
      Array.isArray(post.tags) &&
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const filteredUsers = state.users.filter((user) => {
    if (searchQuery.trim() === "") return false;
    const query = searchQuery.toLowerCase();
    return (
      user.userName?.toLowerCase().includes(query) ||
      user.handle?.toLowerCase().includes(query) ||
      user.handle?.replace("@", "").toLowerCase().includes(query) ||
      user.initials?.toLowerCase().includes(query) ||
      user.bio?.toLowerCase().includes(query) ||
      user.profession?.toLowerCase().includes(query) ||
      user.location?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const showAllUsers = slice.users >= filteredUsers.length;
  const showAllPost = slice.posts >= filteredPosts.length;
  const showAllPostWithTags = slice.tags >= filteredPostsWithTags.length;

  const resultCount =
    selectedFilter === "All"
      ? filteredPosts.length +
        filteredUsers.length +
        filteredPostsWithTags.length
      : selectedFilter === "Posts"
      ? filteredPosts.length
      : selectedFilter === "People"
      ? filteredUsers.length
      : filteredPostsWithTags.length;

  const allMatchingPosts = [...filteredPosts, ...filteredPostsWithTags];
  const uniquePosts = Array.from(
    new Set(allMatchingPosts.map((p) => p.id))
  ).map((id) => allMatchingPosts.find((p) => p.id === id));

  if (searchQuery === "") {
    return (
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm inline-block mb-6">
            <FaSearch className="text-6xl text-blue-500 opacity-80" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Explore & Discover
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto">
            Search for friends, trending topics, or interesting posts to start
            connecting.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Go to Home Feed
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Found {resultCount} matches for "
                <span className="text-blue-500 font-medium">{searchQuery}</span>
                "
              </p>
            </div>
          </div>

          {/* Modern Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {filter.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedFilter(item)}
                className={`
                  px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                  ${
                    selectedFilter === item
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {selectedFilter === "All" && (
            <>
              {/* People Section */}
              {filteredUsers.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <FaUser className="text-blue-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      People
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredUsers.slice(0, slice.users).map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                  {filteredUsers.length > 3 && (
                    <button
                      onClick={() =>
                        setSlice((prev) => ({
                          ...prev,
                          users: showAllUsers ? 3 : filteredUsers.length,
                        }))
                      }
                      className="w-full mt-4 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {showAllUsers
                        ? "Show Less"
                        : `See all ${filteredUsers.length} people`}
                    </button>
                  )}
                </section>
              )}

              {/* Posts Section */}
              {uniquePosts.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4 px-2 mt-8">
                    <FaRegNewspaper className="text-blue-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Posts
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {uniquePosts.slice(0, slice.unique).map((post) => (
                      <Post key={post.id} post={post} />
                    ))}
                  </div>
                  {uniquePosts.length > 3 && (
                    <button
                      onClick={() =>
                        setSlice((prev) => ({
                          ...prev,
                          unique: showAllPost ? 3 : uniquePosts.length,
                        }))
                      }
                      className="w-full mt-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      {showAllPost
                        ? "Show Less"
                        : `View all ${uniquePosts.length} posts`}
                    </button>
                  )}
                </section>
              )}

              {/* Empty State for All */}
              {filteredUsers.length === 0 && uniquePosts.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No matches found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try checking for typos or using different keywords.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Specific Filters (Posts, People, Tags) */}
          {selectedFilter !== "All" && (
            <div className="space-y-6">
              {selectedFilter === "People" && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No people found matching "{searchQuery}"
                  </p>
                </div>
              )}
              {selectedFilter === "People" &&
                filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}

              {(selectedFilter === "Posts" || selectedFilter === "Tags") && (
                <>
                  {selectedFilter === "Posts" && filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No posts found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                  {selectedFilter === "Tags" &&
                    filteredPostsWithTags.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                          No tags found matching "{searchQuery}"
                        </p>
                      </div>
                    )}

                  {(selectedFilter === "Posts"
                    ? filteredPosts
                    : filteredPostsWithTags
                  ).map((post) => (
                    <Post key={post.id} post={post} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SearchPage;
