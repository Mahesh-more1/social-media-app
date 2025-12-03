import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaLink, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { useSocialMedia } from "../store/SocialMediaContext";
import Post from "../components/Post";
import { formatDate } from "../utils/dateTimes";
import { Link, useParams } from "react-router-dom";
import { LOAD_POSTS, FOLLOW_TOGGLE } from "../store/actionTypes";
import { getPostsFromServer } from "../services/postServices";
import { followToggle } from "../services/userServices";

function Profile() {
  const { userId } = useParams();
  const { state, dispatch } = useSocialMedia();
  const userID = userId;
  const [isFollow, setIsFollow] = useState(false);

  // ✅ Load posts if empty on mount
  useEffect(() => {
    if (state.posts.length === 0) {
      const loadPosts = async () => {
        try {
          const posts = await getPostsFromServer();
          dispatch({ type: LOAD_POSTS, payload: posts });
        } catch (error) {
          console.error("Error loading posts:", error);
        }
      };
      loadPosts();
    }
  }, []);

  const user =
    state.currentUser?.id === userID
      ? state.currentUser
      : state.users.find((user) => user.id === userID);

  // ✅ Update isFollow when user changes or following array changes
  useEffect(() => {
    if (user && state.currentUser) {
      setIsFollow(state.currentUser.following?.includes(user.id) || false);
    }
  }, [user?.id, state.currentUser?.following]);

  // ✅ Fix: Convert IDs to strings for proper comparison
  const userPosts = state.posts.filter(
    (post) => String(userID) === String(post.authorId)
  );

  // ✅ Handle follow toggle
  const handleFollowToggle = async (otherUserId) => {
    try {
      const { currentUser, targetUser } = await followToggle(otherUserId);
      dispatch({
        type: FOLLOW_TOGGLE,
        payload: { currentUser, targetUser },
      });
    } catch (error) {
      console.error("❌ Follow error:", error);
    }
  };

  if (!user)
    return (
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This user doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Go Home
          </Link>
        </div>
      </main>
    );

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 flex justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              alt="Profile"
              src={user.coverPhoto}
              className="h-48 bg-red-500 border-2 border-white dark:border-gray-900"
            />
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              {/* Profile Picture */}
              <img
                alt="Profile"
                src={user.profilePicture}
                className="size-32 rounded-full object-cover bg-red-500 border-4 border-white dark:border-gray-900"
              />

              {/* Edit Profile or Follow Button */}
              <div className="flex flex-col gap-1 flex-shrink-0 items-end ml-auto">
                {userID === state.currentUser?.id ? (
                  <Link
                    to="/profile/edit"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <FaEdit className="text-sm" />
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`flex items-center justify-center gap-2 text-white rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap text-sm px-4 py-2 ${
                        isFollow
                          ? "bg-transparent border-2 border-blue-600 text-blue-600"
                          : "bg-blue-600 hover:bg-blue-700 border-2 border-transparent"
                      }`}
                    >
                      {isFollow ? (
                        <SlUserFollowing size={20} />
                      ) : (
                        <SlUserFollow size={20} />
                      )}
                      {isFollow ? "Following" : "Follow"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.userName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user.handle} | {user.profession}
              </p>

              {/* Bio */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {user.bio}
              </p>

              {/* Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-xs" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaLink className="text-xs" />
                  <a
                    href={user.website}
                    className="text-blue-500 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-xs" />
                  <span>{formatDate(user.joinDate)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {user.followingCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Following
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {user.followersCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {userPosts.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Posts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Preview */}
        <div className="mt-8">
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div>
                <p className="text-lg font-bold text-center text-white">
                  Nothing Here! Add your First Post 👍.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {state.currentUser?.id === userID
                    ? "Your"
                    : `${user.userName.split(" ")[0]}'s`}{" "}
                  recent posts
                </h2>
                {userPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;