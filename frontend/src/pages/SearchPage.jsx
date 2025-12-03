import React, { useState, useEffect } from "react";
import { useSocialMedia } from "../store/SocialMediaContext";
import { LOAD_USERS, LOAD_POSTS } from "../store/actionTypes";
import { FaFilter, FaHome, FaSearch } from "react-icons/fa";
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
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-20">
          {/* Icon */}
          <FaSearch className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-6" />
          
          {/* Message */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            What are you looking for?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Use the search bar above to discover posts, people, and topics
          </p>
          
          {/* Button */}
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Explore Home Feed
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {resultCount} results found for "{searchQuery}"
          </p>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-6">
              {filter.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`
              pb-3 px-1 border-b-2 transition-all
              ${
                selectedFilter === item
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }
              font-medium text-sm
            `}
                  onClick={() => setSelectedFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedFilter === "All" && (
          <div className="space-y-2">
            {uniquePosts.length == 0 && (
              <div className="max-w-xs text-white text-lg font-semibold rounded-lg p-1">
                <p className="text-gray-600 dark:text-gray-200">Peoples</p>
              </div>
            )}
            <div className="space-y-4">
              {filteredUsers.length > 0
                ? filteredUsers
                    .slice(0, slice.users)
                    .map((user) => <UserCard key={user.id} user={user} />)
                : uniquePosts.length == 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No User found for "{searchQuery}"
                      </p>
                    </div>
                  )}
              {filteredUsers.length > 3 && (
                <p
                  onClick={() =>
                    setSlice(
                      showAllUsers
                        ? { ...slice, users: 3 }
                        : { ...slice, users: filteredUsers.length }
                    )
                  }
                  className="text-white font-semibold dark:bg-gray-900 rounded-lg shadow-sm py-2 my-4 text-center cursor-pointer"
                >
                  {showAllUsers ? "Show Less" : "Show All Users"}
                </p>
              )}
            </div>
            {filteredUsers.length == 0 && (
              <div className="max-w-xs text-white text-lg font-semibold rounded-lg p-1">
                <p className="text-gray-600 dark:text-gray-200">Posts</p>
              </div>
            )}
            {/* Results List */}
            <div className="space-y-4">
              {uniquePosts.length > 0
                ? uniquePosts
                    .slice(0, slice.unique)
                    .map((post) => <Post key={post.id} post={post} />)
                : filteredUsers.length == 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No Post found for "{searchQuery}"
                      </p>
                    </div>
                  )}

              {uniquePosts.length > 3 && (
                <p
                  onClick={() =>
                    setSlice(
                      showAllPost
                        ? { ...slice, unique: 3 }
                        : { ...slice, unique: uniquePosts.length }
                    )
                  }
                  className="text-white font-semibold dark:bg-gray-900 rounded-lg shadow-sm py-2 my-4 text-center cursor-pointer"
                >
                  {showAllPost ? "Show Less" : "See All Post"}
                </p>
              )}
            </div>
          </div>
        )}
        
        {selectedFilter === "Posts" && (
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts
                .slice(0, slice.posts)
                .map((post) => <Post key={post.id} post={post} />)
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No Post found for "{searchQuery}"
                </p>
              </div>
            )}
            {filteredPosts.length > 3 && (
              <p
                onClick={() =>
                  setSlice(
                    showAllPost
                      ? { ...slice, posts: 3 }
                      : { ...slice, posts: filteredPosts.length }
                  )
                }
                className="text-white font-semibold dark:bg-gray-900 rounded-lg shadow-sm py-2 my-4 text-center cursor-pointer"
              >
                {showAllPost ? "Show Less" : "See All Post"}
              </p>
            )}
          </div>
        )}
        
        {selectedFilter === "People" && (
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers
                .slice(0, slice.users)
                .map((user) => <UserCard key={user.id} user={user} />)
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No User found for "{searchQuery}"
                </p>
              </div>
            )}
            {filteredUsers.length > 3 && (
              <p
                onClick={() =>
                  setSlice(
                    showAllUsers
                      ? { ...slice, users: 3 }
                      : { ...slice, users: filteredUsers.length }
                  )
                }
                className="text-white font-semibold dark:bg-gray-900 rounded-lg shadow-sm py-2 my-4 text-center cursor-pointer"
              >
                {showAllUsers ? "Show Less" : "See All Users"}
              </p>
            )}
          </div>
        )}
        
        {selectedFilter === "Tags" && (
          <div className="space-y-4">
            {filteredPostsWithTags.length > 0 ? (
              filteredPostsWithTags
                .slice(0, slice.tags)
                .map((post) => <Post key={post.id} post={post} />)
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No Post found for tag "{searchQuery}"
                </p>
              </div>
            )}
            {filteredPostsWithTags.length > 3 && (
              <p
                onClick={() =>
                  setSlice(
                    showAllPostWithTags
                      ? { ...slice, tags: 3 }
                      : { ...slice, tags: filteredPostsWithTags.length }
                  )
                }
                className="text-white font-semibold dark:bg-gray-900 rounded-lg shadow-sm py-2 my-4 text-center cursor-pointer"
              >
                {showAllPostWithTags ? "Show Less" : "See All Post"}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchPage;