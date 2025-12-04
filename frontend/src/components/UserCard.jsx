import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { useSocialMedia } from "../store/SocialMediaContext";
import { FOLLOW_TOGGLE } from "../store/actionTypes";
import { followToggle } from "../services/userServices";

function UserCard({ user, suggestedUser = false }) {
  const { state, dispatch } = useSocialMedia();
  const navigate = useNavigate();
  const [isFollow, setIsFollow] = useState(true);

  useEffect(() => {
    setIsFollow(state.currentUser?.following.includes(user.id) || false);
  }, [state.currentUser?.following, user.id]); // ✅ Re-run when following array changes

  const handleFollowToggle = async (otherUserId) => {
    try {
      // ✅ Get updated data from backend
      const { currentUser, targetUser } = await followToggle(otherUserId);

      // ✅ Dispatch with backend response
      dispatch({
        type: FOLLOW_TOGGLE,
        payload: { currentUser, targetUser },
      });
    } catch (error) {
      console.error("❌ Follow error:", error);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        suggestedUser ? "px-4 py-3" : "px-6 py-6"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img
          loading="lazy"
          src={user.profilePicture}
          alt={user.userName}
          onClick={() => navigate(`/profile/${user.id}`)}
          className={`object-cover rounded-full cursor-pointer flex-shrink-0 ${
            suggestedUser ? "w-10 h-10" : "w-14 h-14"
          }`}
        />

        {/* User Info - Takes remaining space */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <h3
            className={`font-bold text-gray-900 dark:text-white truncate ${
              suggestedUser ? "text-sm" : "text-lg"
            }`}
          >
            {user.userName}
          </h3>
          <p
            className={`text-gray-500 dark:text-gray-400 truncate ${
              suggestedUser ? "text-xs" : "text-sm"
            }`}
          >
            {suggestedUser
              ? user.handle
              : `${user.profession} | ${user.location}`}
          </p>
        </div>

        {/* Stats & Actions - Fixed widths for alignment */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {!suggestedUser && (
            <>
              <div className="hidden sm:flex flex-col items-center w-20">
                <span className="font-bold text-gray-900 dark:text-white">
                  {user.followersCount}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Followers
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-center w-20">
                <span className="font-bold text-gray-900 dark:text-white">
                  {user.followingCount}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Following
                </span>
              </div>
            </>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFollowToggle(user.id);
            }}
            className={`flex items-center justify-center gap-2 rounded-full font-medium transition-all whitespace-nowrap ${
              suggestedUser ? "text-xs px-3 py-1.5" : "text-sm px-5 py-2 w-32"
            } ${
              isFollow
                ? "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                : "bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm hover:shadow"
            }`}
          >
            {isFollow ? (
              <>
                <SlUserFollowing size={suggestedUser ? 12 : 16} />
                <span>Following</span>
              </>
            ) : (
              <>
                <SlUserFollow size={suggestedUser ? 12 : 16} />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
