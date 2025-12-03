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
      className={`flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm ${
        suggestedUser ? "px-4 py-3" : "px-6 py-8"
      }`}
    >
      <img
        src={user.profilePicture}
        alt={user.userName}
        onClick={() => navigate(`/profile/${user.id}`)}
        className={`object-cover rounded-full cursor-pointer ${
          suggestedUser ? "w-12 h-12" : "w-16 h-16"
        }`}
      />
      <div className="w-full flex justify-between items-center gap-2">
        <div
          className={`flex ${
            suggestedUser ? "gap-2" : "gap-10"
          } cursor-pointer`}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <div className="flex flex-col w-full">
            <h3
              className={`font-bold text-gray-900 dark:text-white ${
                suggestedUser ? "text-base" : "text-xl"
              }`}
            >
              {user.userName}
            </h3>
            {!suggestedUser && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.profession} {" | "} {user.location}
              </p>
            )}
            {suggestedUser && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.handle}
              </p>
            )}
          </div>
          <div className={`flex flex-col ${suggestedUser ? "hidden" : ""}`}>
            <b className="text-white text-center">{user.followersCount}</b>
            <b className="text-white">Followers</b>
          </div>
          <div className={`flex flex-col ${suggestedUser ? "hidden" : ""}`}>
            <b className="text-white text-center">{user.followingCount}</b>
            <b className="text-white">Following</b>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0 items-end">
          {!suggestedUser && (
            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap pr-2">
              {user.handle}
            </p>
          )}
          <span
            onClick={() => handleFollowToggle(user.id)}
            className={`flex items-center justify-center gap-2 text-white rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
              suggestedUser ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2"
            } ${
              isFollow
                ? "bg-transparent border-2 border-blue-600 text-blue-600"
                : "bg-blue-600 hover:bg-blue-700 border-2 border-transparent"
            }`}
          >
            {isFollow ? (
              <SlUserFollowing size={suggestedUser ? 16 : 20} />
            ) : (
              <SlUserFollow size={suggestedUser ? 16 : 20} />
            )}
            {isFollow ? "Following" : "Follow"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserCard;