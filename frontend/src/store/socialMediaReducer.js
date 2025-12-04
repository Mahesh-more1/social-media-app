import { formatDate } from "../utils/dateTimes";
import {
  DELETE_POST,
  EDIT_POST,
  ADD_COMMENT,
  DELETE_COMMENT,
  TOGGLE_LIKE,
  TOGGLE_SAVE,
  ADD_POST,
  EDIT_PROFILE,
  SET_SEARCH_QUERY,
  LOAD_POSTS,
  LOGIN,
  LOGOUT,
  LOAD_USERS,
  LOAD_BOOKMARKS,
  TOGGLE_LIKE_COMMENT,
  FOLLOW_TOGGLE,
  LOAD_MESSAGES,
  ADD_MESSAGE,
  DELETE_MESSAGE,
  LOAD_CONVERSATIONS,
  LOAD_NOTIFICATIONS,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  DELETE_NOTIFICATION,
  LOAD_ALBUMS,
  CREATE_ALBUM,
} from "../store/actionTypes";

const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const initialState = {
  posts: [],
  bookmarks: getUserFromStorage()?.bookmarks || [],
  currentUser: getUserFromStorage() || null,
  users: [],
  searchQuery: "",
  messages: [],
  conversations: [],
  notifications: [],
  albums: [],
};

const socialMediaReducer = (state, action) => {
  switch (action.type) {
    case LOAD_POSTS:
      return { ...state, posts: action.payload };
    case LOAD_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case LOAD_BOOKMARKS:
      return {
        ...state,
        bookmarks: action.payload,
      };

    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case EDIT_PROFILE:
      return {
        ...state,
        currentUser: action.payload,
      };

    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case EDIT_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case DELETE_POST:
      const newPosts = state.posts.filter((post) => {
        return post.id !== action.payload;
      });

      return {
        ...state,
        posts: newPosts,
      };

    case TOGGLE_LIKE:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            const isLiked = post.likedBy.includes(action.payload.userId);
            return {
              ...post,
              likedBy: isLiked
                ? post.likedBy.filter((id) => id !== action.payload.userId)
                : [...post.likedBy, action.payload.userId],
              likes: isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        }),
      };

    case TOGGLE_SAVE:
      const isSavedByUser = state.bookmarks.includes(action.payload.postId);
      const newBookmarks = isSavedByUser
        ? state.bookmarks.filter((id) => id !== action.payload.postId)
        : [...state.bookmarks, action.payload.postId];

      if (state.currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...state.currentUser,
            bookmarks: newBookmarks,
          })
        );
      }

      return {
        ...state,
        bookmarks: newBookmarks,
      };

    case ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: [...post.comments, action.payload.comment], // Backend comment!
                commentsCount: (post.commentsCount || 0) + 1,
              }
            : post
        ),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (c) => c._id !== action.payload.commentId
                ),
                commentsCount: Math.max(
                  0,
                  (post.commentsCount || post.comments.length || 0) - 1
                ),
              }
            : post
        ),
      };

    case TOGGLE_LIKE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            return {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment._id === action.payload.commentId) {
                  const isLiked = comment.likedBy.includes(
                    action.payload.userId
                  );
                  return {
                    ...comment,
                    likedBy: isLiked
                      ? comment.likedBy.filter(
                          (userId) => userId !== action.payload.userId
                        )
                      : [...comment.likedBy, action.payload.userId],
                    likes: isLiked ? comment.likes - 1 : comment.likes + 1,
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        }),
      };
    case "UPDATE_CURRENT_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        currentUser: action.payload,
      };

    case FOLLOW_TOGGLE:
      const updatedCurrentUser = action.payload.currentUser;

      // ✅ SAVE to localStorage so it persists on refresh
      localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

      return {
        ...state,
        currentUser: updatedCurrentUser,
        users: state.users.map((user) =>
          user.id === action.payload.targetUser.id
            ? action.payload.targetUser
            : user
        ),
      };

    case LOGIN:
      return {
        ...state,
        currentUser: action.payload,
        bookmarks: action.payload.bookmarks || [],
      };

    case LOGOUT:
      return { ...state, currentUser: action.payload, bookmarks: [] };

    case LOAD_MESSAGES:
      return { ...state, messages: action.payload };

    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };

    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };

    case LOAD_CONVERSATIONS:
      return { ...state, conversations: action.payload };

    case LOAD_NOTIFICATIONS:
      return { ...state, notifications: action.payload };

    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),
      };

    case MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notif) => ({
          ...notif,
          isRead: true,
        })),
      };

    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notif) => notif.id !== action.payload
        ),
      };

    case LOAD_ALBUMS:
      return { ...state, albums: action.payload };

    case CREATE_ALBUM:
      return { ...state, albums: [action.payload, ...state.albums] };

    default:
      return state;
  }
};

export default socialMediaReducer;
