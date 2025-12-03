import React, { use, useState } from "react";
import { getTimeAgo } from "../utils/dateTimes";
import { MdOutlineDeleteOutline, MdSave } from "react-icons/md";
import {
  FaRegHeart,
  FaRegComment,
  FaShare,
  FaHeart,
  FaSave,
  FaRegSave,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { FiBookmark, FiEdit, FiTrash2 } from "react-icons/fi";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  DELETE_POST,
  EDIT_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
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
import { FaImages } from "react-icons/fa";

function Post({ post }) {
  const { state, dispatch } = useSocialMedia();
  // const posts = state.posts;
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postTags, setPostTags] = useState("");
  const [onCommentsPosts, setOnCommentPosts] = useState([]);
  const [text, setText] = useState("");
  const [isAddToAlbumModalOpen, setAddToAlbumModalOpen] = useState(false);

  const isLike = post.likedBy.includes(state.currentUser?.id);
  const likedCommentIds = post.comments
    .filter((comment) =>
      comment.likedBy.some(
        (userId) => userId.toString() === state.currentUser?.id
      )
    )
    .map((comment) => comment._id.toString());

  const isSave = state.bookmarks.includes(post.id);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleDeletePost = async (postId) => {
    console.log("🔴 Deleting post with ID:", postId);
    console.log("🔴 Type:", typeof postId);

    const postToDeleteId = await deletePostFromServer(postId);

    dispatch({
      type: DELETE_POST,
      payload: postToDeleteId,
    });

    console.log("🔴 Dispatched DELETE_POST with payload:", postId);
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
      console.log("✅ Like toggled:", response);
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
    try {
      const response = await toggleLikePost(postId, isLike);
      dispatch({
        type: TOGGLE_LIKE,
        payload: {
          postId,
          userId: state.currentUser?.id,
        },
      });
      console.log("✅ Like toggled:", response);
    } catch (error) {
      console.error("❌ Like failed:", error);
      alert(error.message);
    }
  };

  const toggleSave = async (postId) => {
    try {
      const isBookmarked = state.bookmarks.includes(postId);

      console.log("🔖 Toggle bookmark:", { postId, isBookmarked });

      // ✅ CALL BACKEND API FIRST!
      if (isBookmarked) {
        await removeBookmarkFromServer(postId);
        console.log("✅ Removed from server");
      } else {
        await addBookmarkToServer(postId);
        console.log("✅ Added to server");
      }

      // ✅ THEN update local state
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
  const top3LikeUserId = post.likedBy.slice(0, 3);
  const top3LikeUser = top3LikeUserId
    .map((userId) => getUserById(userId))
    .filter((user) => user);
  const firstLiker = getUserById(post.likedBy[0]);
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
          src={
            authorProfile ||
            "https://ui-avatars.com/api/?name=User&background=random"
          }
          className="size-10 rounded-full object-cover cursor-pointer"
          onClick={() => navigate(`/profile/${post.authorId}`)}
        />

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {post.author}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getTimeAgo(post.timestamp)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 text-4 font-bold dark:text-gray-300 mb-4">
        {post.title}
      </p>
      <div className="relative flex justify-center">
        {/* Only show carousel if MULTIPLE images (2+) */}
        {post.postImages && post.postImages.length > 1 && (
          <div className="">
            {/* Image */}
            <img
              src={post.postImages[currentImgIndex]}
              alt=""
              className="rounded-lg w-full h-96 object-contain"
            />

            {/* Previous button - show if NOT on first image */}
            {currentImgIndex > 0 && (
              <button
                onClick={() => setCurrentImgIndex(currentImgIndex - 1)}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <IoIosArrowBack className="w-6 h-6" />
              </button>
            )}

            {/* Next button - show if NOT on last image */}
            {currentImgIndex < post.postImages.length - 1 && (
              <button
                onClick={() => setCurrentImgIndex(currentImgIndex + 1)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                <IoIosArrowForward className="w-6 h-6" />
              </button>
            )}

            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentImgIndex + 1} / {post.postImages.length}
            </div>
          </div>
        )}

        {/* Show single image if only 1 image */}
        {post.postImages && post.postImages.length === 1 && (
          <img
            src={post.postImages[0]}
            alt=""
            className="rounded-lg w-full h-96 object-contain"
          />
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

      <div className="flex gap-1">
        {post.tags?.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-400 rounded-sm p-1 mb-1 text-[12px] font-medium hover:text-blue-600 transition-all duration-200 cursor-pointer"
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
          <button
            className="flex items-center"
            onClick={() => setAddToAlbumModalOpen(true)}
          >
            <FaImages className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-all duration-200" />
          </button>
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

      {/* Likes Section */}
      {post.likes > 0 && (
        <div className="liked-by flex gap-1 items-center px-1 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="like-profile flex -ml-4">
            {top3LikeUser.map((user) => (
              <span key={user.id} className="ml-1 -mr-2">
                <img
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
                {post.likes > 1 && (
                  <>
                    {" "}
                    and{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {post.likes - 1} others
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
                {post.likes > 1 && (
                  <>
                    {" "}
                    and{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {post.likes - 1} others
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
