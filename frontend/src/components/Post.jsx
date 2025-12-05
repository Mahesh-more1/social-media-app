import React, { useState, useEffect, useRef } from "react";
import { getTimeAgo } from "../utils/dateTimes";
import { MdOutlineDeleteOutline } from "react-icons/md";
import {
  FaRegHeart,
  FaRegComment,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaImages,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  DELETE_POST,
  ADD_COMMENT,
  TOGGLE_LIKE,
  TOGGLE_SAVE,
  SET_SEARCH_QUERY,
  TOGGLE_LIKE_COMMENT,
} from "../store/actionTypes";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  addCommentToPostOnServer,
  deleteCommentFromTheServer,
  deletePostFromServer,
  toggleLikeCommentPost,
  toggleLikePost,
} from "../services/postServices";
import {
  addBookmarkToServer,
  removeBookmarkFromServer,
} from "../services/bookmarkServices";
import AddToAlbumModal from "./AddToAlbumModal";

// ✅ 1. Accept hideAddToAlbum prop (defaults to false)
function Post({ post, hideAddToAlbum = false, onDelete }) {
  const { state, dispatch } = useSocialMedia();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postTags, setPostTags] = useState("");
  const [onCommentsPosts, setOnCommentPosts] = useState([]);
  const [text, setText] = useState("");
  const [isAddToAlbumModalOpen, setAddToAlbumModalOpen] = useState(false);

  // ✅ 2. FIX BROKEN LIKES: Use local state for immediate UI updates
  // This ensures it works on the Album page where global state might not trigger a re-render
  const [localLikedBy, setLocalLikedBy] = useState(post.likedBy || []);
  const [localLikes, setLocalLikes] = useState(post.likes || 0);

  // Sync local state if the prop changes (e.g. via global refresh)
  useEffect(() => {
    setLocalLikedBy(post.likedBy || []);
    setLocalLikes(post.likes || 0);
  }, [post.likedBy, post.likes]);

  const isLike = localLikedBy.includes(state.currentUser?.id);

  const likedCommentIds = post.comments
    .filter((comment) =>
      comment.likedBy.some(
        (userId) => userId.toString() === state.currentUser?.id
      )
    )
    .map((comment) => comment._id.toString());

  const isSave = state.bookmarks.includes(post.id);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Video Player Logic
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const postToDeleteId = await deletePostFromServer(postId);

    dispatch({
      type: DELETE_POST,
      payload: postToDeleteId,
    });
    if (onDelete) {
      onDelete(postId);
    }
  };

  const handleAddComment = async (postId) => {
    if (!text.trim()) return;
    try {
      const response = await addCommentToPostOnServer(postId, text);
      dispatch({
        type: ADD_COMMENT,
        payload: {
          postId,
          comment: response.comment,
        },
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteCommentFromTheServer(postId, commentId);
      dispatch({
        type: "DELETE_COMMENT",
        payload: {
          postId,
          commentId,
        },
      });
    } catch (error) {
      console.error("❌ Delete FAILED:", error);
      alert("Failed to delete comment: " + error.message);
    }
  };

  const toggleLikeComment = async (postId, commentId, isCommentLiked) => {
    try {
      const response = await toggleLikeCommentPost(
        postId,
        commentId,
        isCommentLiked
      );
      dispatch({
        type: TOGGLE_LIKE_COMMENT,
        payload: {
          postId,
          commentId,
          userId: state.currentUser?.id,
        },
      });
    } catch (error) {
      console.error("❌ Like comment FAILED:", error);
      alert("Failed to like comment: " + error.message);
    }
  };

  const toggleComment = (postId) => {
    if (onCommentsPosts.includes(postId)) {
      setOnCommentPosts(onCommentsPosts.filter((id) => id !== postId));
    } else {
      setOnCommentPosts([...onCommentsPosts, postId]);
    }
  };

  const toggleLike = async (postId) => {
    if (!state.currentUser) return alert("Please login to like");

    // ✅ 3. Optimistic UI Update (Updates immediately before server responds)
    const userId = state.currentUser.id;
    const currentlyLiked = isLike;

    if (currentlyLiked) {
      setLocalLikedBy((prev) => prev.filter((id) => id !== userId));
      setLocalLikes((prev) => prev - 1);
    } else {
      setLocalLikedBy((prev) => [...prev, userId]);
      setLocalLikes((prev) => prev + 1);
    }

    try {
      const response = await toggleLikePost(postId, currentlyLiked);

      // Dispatch to update global store (for other pages)
      dispatch({
        type: TOGGLE_LIKE,
        payload: {
          postId,
          userId: state.currentUser?.id,
        },
      });
    } catch (error) {
      console.error("❌ Like failed:", error);
      // Revert on error
      setLocalLikedBy(post.likedBy);
      setLocalLikes(post.likes);
      alert(error.message);
    }
  };

  const toggleSave = async (postId) => {
    try {
      const isBookmarked = state.bookmarks.includes(postId);
      if (isBookmarked) {
        await removeBookmarkFromServer(postId);
      } else {
        await addBookmarkToServer(postId);
      }

      dispatch({
        type: TOGGLE_SAVE,
        payload: { postId },
      });
    } catch (error) {
      console.error("❌ Bookmark failed:", error);
      alert(error.message);
    }
  };

  const getUserById = (userId) => {
    return state.users.find((user) => user.id === userId);
  };

  const authorUser = getUserById(post.authorId);
  const authorProfile = authorUser?.profilePicture;

  let allLikers = localLikedBy.map((id) => getUserById(id)).filter(Boolean);

  if (isLike && state.currentUser) {
    allLikers = allLikers.filter((u) => u.id !== state.currentUser.id);
    allLikers.unshift(state.currentUser);
  }

  const top3LikeUser = allLikers.slice(0, 3);
  const firstLiker =
    localLikedBy.length > 0 ? getUserById(localLikedBy[0]) : null;
  const firstLikerName = firstLiker?.userName || "Someone";

  const navigate = useNavigate();

  const handleTagSearch = (tag) => {
    dispatch({
      type: SET_SEARCH_QUERY,
      payload: tag,
    });
    navigate("/search");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 sm:p-6">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          loading="lazy"
          src={
            authorProfile ||
            "https://ui-avatars.com/api/?name=User&background=random"
          }
          className="size-10 rounded-full object-cover cursor-pointer"
          onClick={() => navigate(`/profile/${post.authorId}`)}
          alt="Author"
        />

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {post.author}
            {post.feeling && (
              <span className="font-normal text-gray-600 dark:text-gray-400 text-sm">
                {" "}
                is feeling {post.feeling}
              </span>
            )}
            {post.location && (
              <span className="font-normal text-gray-600 dark:text-gray-400 text-sm">
                {" "}
                at {post.location}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getTimeAgo(post.timestamp)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 text-4 font-bold dark:text-gray-300 mb-2">
        {post.title}
      </p>
      <div className="relative flex justify-center">
        {post.postImages && post.postImages.length > 1 && (
          <div className="">
            <img
              loading="lazy"
              src={post.postImages[currentImgIndex]}
              alt=""
              className="rounded-lg w-full max-h-[600px] object-contain bg-black/5"
            />

            {currentImgIndex > 0 && (
              <button
                onClick={() => setCurrentImgIndex(currentImgIndex - 1)}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <IoIosArrowBack className="w-6 h-6" />
              </button>
            )}

            {currentImgIndex < post.postImages.length - 1 && (
              <button
                onClick={() => setCurrentImgIndex(currentImgIndex + 1)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <IoIosArrowForward className="w-6 h-6" />
              </button>
            )}

            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentImgIndex + 1} / {post.postImages.length}
            </div>
          </div>
        )}

        {post.postImages && post.postImages.length === 1 && (
          <img
            loading="lazy"
            src={post.postImages[0]}
            alt=""
            className="rounded-lg w-full max-h-[600px] object-contain bg-black/5"
          />
        )}

        {post.video && (
          <div className="relative w-full group">
            <video
              ref={videoRef}
              src={post.video}
              className="max-h-[600px] w-auto max-w-full mx-auto rounded-lg cursor-pointer"
              onClick={togglePlay}
              loop
              playsInline
            />
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              <button
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 backdrop-blur-sm transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <FaPause className="w-8 h-8" />
                ) : (
                  <FaPlay className="w-8 h-8 pl-1" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 pt-1">
        {post.content}
      </p>

      <div className="flex gap-2 flex-wrap mb-4">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full px-2 py-0.5 text-[12px] font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
            onClick={() => handleTagSearch(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>
      {/* Action Buttons */}
      <div className="action-btn flex justify-between px-2 py-1 mb-1">
        <div className="interactions flex gap-10">
          <button
            className="flex items-center"
            onClick={() => toggleLike(post.id)}
          >
            {isLike ? (
              <FaHeart className="w-5 h-5 text-gray-600 dark:text-red-500 hover:scale-115 transition-all duration-200" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-400 hover:scale-115 transition-all duration-200" />
            )}
          </button>
          <button
            className="flex items-center"
            onClick={() => toggleComment(post.id)}
          >
            <FaRegComment className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all duration-200" />
          </button>
          <button
            className="flex items-center"
            onClick={() => toggleSave(post.id)}
          >
            {isSave ? (
              <FaBookmark className="w-5 h-5 text-gray-600 dark:text-blue-500 hover:text-blue-600 hover:scale-115 transition-all duration-200" />
            ) : (
              <FaRegBookmark className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:scale-115 transition-all duration-200" />
            )}
          </button>
        </div>
        <div className="flex gap-4.5">
          {/* ✅ 4. Hide AddToAlbum icon if prop is true */}
          {!hideAddToAlbum && (
            <button
              className="flex items-center"
              onClick={() => setAddToAlbumModalOpen(true)}
            >
              <FaImages className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-all duration-200" />
            </button>
          )}

          <Link to={`/post/${post.id}/edit`} className="flex items-center">
            {state.currentUser?.userName === post.author && (
              <FiEdit className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-all duration-200" />
            )}
          </Link>
          <button
            className="flex items-center"
            onClick={() => handleDeletePost(post.id)}
          >
            {state.currentUser?.userName === post.author && (
              <MdOutlineDeleteOutline className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-all duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Likes Section (Updated to use localLikes) */}
      {localLikes > 0 && (
        <div className="liked-by flex gap-1 items-center px-1 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="like-profile flex -ml-4">
            {top3LikeUser.map((user) => (
              <span key={user.id} className="ml-1 -mr-2">
                <img
                  loading="lazy"
                  src={user.profilePicture}
                  alt={user.userName}
                  className="w-5 h-5 rounded-full object-cover border-2 border-white dark:border-gray-900"
                />
              </span>
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
            {isLike ? (
              <>
                Liked by{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  You
                </span>
                {localLikes > 1 && (
                  <>
                    {" "}
                    and{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {localLikes - 1} others
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                Liked by{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {firstLikerName}
                </span>
                {localLikes > 1 && (
                  <>
                    {" "}
                    and{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {localLikes - 1} others
                    </span>
                  </>
                )}
              </>
            )}
          </span>
        </div>
      )}

      {/* Comments Section */}
      {onCommentsPosts.includes(post.id) && (
        <div className="comments-section mt-4">
          {/* (Existing comment code unchanged) */}
          <button className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3 hover:text-gray-700 dark:hover:text-gray-300">
            View all {post.comments?.length || 0} comments
          </button>

          <div className="space-y-3">
            {post.comments?.map((comment, index) => {
              const isCommentLiked = likedCommentIds.includes(
                comment._id.toString()
              );
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img
                      loading="lazy"
                      src={state.currentUser?.profilePicture}
                      alt={state.currentUser?.userName || "User"}
                      className="size-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-1 flex justify-between items-center gap-3 transition-all duration-200">
                      <span className="text-gray-900 dark:text-white text-sm flex-1 break-words">
                        {comment.text}
                      </span>
                      <button
                        onClick={() =>
                          toggleLikeComment(
                            post.id,
                            comment._id,
                            isCommentLiked
                          )
                        }
                        className="flex items-center gap-1.5 transition-all duration-200 group"
                      >
                        {isCommentLiked ? (
                          <FaHeart className="w-3 h-3 text-red-500" />
                        ) : (
                          <FaRegHeart className="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                        )}
                        <span className="text-sm font-medium  text-gray-500 dark:text-gray-400">
                          {comment.likes || 0}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-1 px-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(comment.createdAt)}
                      </span>

                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                        Reply
                      </button>
                      {comment.author === state.currentUser?.userName && (
                        <button
                          onClick={() =>
                            handleDeleteComment(post.id, comment._id)
                          }
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-400 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <img
                loading="lazy"
                src={state.currentUser?.profilePicture}
                alt={state.currentUser?.userName || "User"}
                className="size-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Comment Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    handleAddComment(post.id);
                  }
                }}
                placeholder="Add a comment..."
                className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-0 px-0 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />

              {/* Post Button */}
              <button
                onClick={() => handleAddComment(post.id)}
                disabled={!text.trim()}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <AddToAlbumModal
        isOpen={isAddToAlbumModalOpen}
        onClose={() => setAddToAlbumModalOpen(false)}
        postId={post.id}
      />
    </div>
  );
}

export default Post;
