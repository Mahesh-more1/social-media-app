import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaEllipsisH,
  FaCheckDouble,
  FaArrowLeft,
  FaPaperPlane,
  FaSmile,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  LOAD_CONVERSATIONS,
  ADD_MESSAGE,
  LOAD_MESSAGES,
} from "../store/actionTypes";
import {
  getConversationsFromServer,
  getMessagesFromServer,
  sendMessageToServer,
} from "../services/messageServices";

function Messages() {
  const { state, dispatch } = useSocialMedia();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadConversations();
    const conversationInterval = setInterval(() => {
      loadConversations();
    }, 2000);
    return () => clearInterval(conversationInterval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversationId);
      const messageInterval = setInterval(() => {
        loadMessages(selectedConversation.conversationId);
      }, 1500);
      return () => clearInterval(messageInterval);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const convos = await getConversationsFromServer();
      dispatch({ type: LOAD_CONVERSATIONS, payload: convos });
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const messages = await getMessagesFromServer(conversationId);
      dispatch({ type: LOAD_MESSAGES, payload: messages });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessageText("");
    loadMessages(conversation.conversationId);
  };

  const handleSelectUserToChat = (user) => {
    const conversation = {
      conversationId: [state.currentUser.id, user.id].sort().join("-"),
      otherUser: {
        id: user.id,
        name: user.userName,
      },
      lastMessage: "",
      unreadCount: 0,
    };
    setSelectedConversation(conversation);
    dispatch({ type: LOAD_MESSAGES, payload: [] });
    setShowUserList(false);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      const newMessage = await sendMessageToServer(
        selectedConversation.otherUser.id,
        selectedConversation.otherUser.name,
        messageText
      );
      dispatch({ type: ADD_MESSAGE, payload: newMessage });
      setMessageText("");
      await loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = state.conversations.filter((convo) =>
    convo.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = state.users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.id !== state.currentUser?.id
  );

  // Show user list if search has results and search query exists
  const showUsers = searchQuery.trim() && showUserList;

  console.log("Conversations loaded:", state.conversations);
  console.log("Filtered conversations:", filteredConversations);

  if (selectedConversation) {
    return (
      <main className="flex-grow bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 min-h-screen flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${selectedConversation.otherUser.name}&background=random`}
                  alt={selectedConversation.otherUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.otherUser.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active now
                  </p>
                </div>
              </div>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <FaEllipsisH />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
            {state.messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              [...state.messages].reverse().map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === state.currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === state.currentUser.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === state.currentUser.id
                          ? "text-blue-100"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <FaSmile className="text-xl" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !messageText.trim()}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
        {/* Messages Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Messages
            </h1>
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              + New Message
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowUserList(true);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
              placeholder="Search messages or users..."
            />
          </div>
        </div>

        {/* User List (to start new conversations) */}
        {showUsers && (
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 py-2">
                SELECT USER TO CHAT
              </p>
              {filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUserToChat(user)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded flex items-center gap-2"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.userName}&background=random`}
                      alt={user.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.userName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Conversations List */}
        {!showUsers && (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No conversations yet
                </p>
                <button
                  onClick={() => setShowUserList(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Start a Conversation
                </button>
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <div
                  key={convo.conversationId}
                  onClick={() => handleSelectConversation(convo)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${convo.otherUser.name}&background=random`}
                      alt={convo.otherUser.name}
                      className="w-12 h-12 rounded-full"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {convo.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(convo.lastMessageTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {convo.lastMessage}
                        </p>
                        {convo.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Messages;
