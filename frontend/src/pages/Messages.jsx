import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaEllipsisH,
  FaCheckDouble,
  FaArrowLeft,
  FaPaperPlane,
  FaSmile,
  FaPlus,
  FaImage,
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
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    setShowUserList(false);
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
    setSearchQuery("");
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

  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-900 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex shadow-xl overflow-hidden bg-white dark:bg-gray-800 rounded-none md:rounded-2xl md:my-4 md:border border-gray-200 dark:border-gray-700">
        {/* Sidebar (Conversation List) */}
        <div
          className={`${
            selectedConversation ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Messages
              </h1>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <FaPlus />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setShowUserList(true);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {showUserList && searchQuery ? (
              <div className="p-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start New Chat
                </p>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUserToChat(user)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors mx-2"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.userName}&background=random`}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.userName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-10 px-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No conversations yet.
                    </p>
                    <button
                      onClick={() => setShowUserList(true)}
                      className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                      Start a new chat
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((convo) => (
                    <div
                      key={convo.conversationId}
                      onClick={() => handleSelectConversation(convo)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        selectedConversation?.conversationId ===
                        convo.conversationId
                          ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={`https://ui-avatars.com/api/?name=${convo.otherUser.name}&background=random`}
                          alt={convo.otherUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {convo.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3
                            className={`font-semibold truncate ${
                              selectedConversation?.conversationId ===
                              convo.conversationId
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {convo.otherUser.name}
                          </h3>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(
                              convo.lastMessageTime
                            ).toLocaleDateString() ===
                            new Date().toLocaleDateString()
                              ? new Date(
                                  convo.lastMessageTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : new Date(
                                  convo.lastMessageTime
                                ).toLocaleDateString()}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${
                            convo.unreadCount > 0
                              ? "font-semibold text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {convo.lastMessage || "Started a conversation"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          className={`${
            !selectedConversation ? "hidden md:flex" : "flex"
          } flex-1 flex-col bg-gray-50/50 dark:bg-gray-900/50`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    <FaArrowLeft />
                  </button>
                  <img
                    src={`https://ui-avatars.com/api/?name=${selectedConversation.otherUser.name}&background=random`}
                    alt={selectedConversation.otherUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      {selectedConversation.otherUser.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-pattern">
                {state.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <img
                      src={`https://ui-avatars.com/api/?name=${selectedConversation.otherUser.name}&background=random&size=128`}
                      className="w-24 h-24 rounded-full mb-4 opacity-75"
                      alt=""
                    />
                    <p className="text-gray-500 dark:text-gray-400">
                      Say hello to{" "}
                      <span className="font-bold">
                        {selectedConversation.otherUser.name}
                      </span>
                      ! 👋
                    </p>
                  </div>
                ) : (
                  state.messages.map((msg, index) => {
                    const isMe = msg.senderId === state.currentUser.id;
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        } group`}
                      >
                        <div
                          className={`flex flex-col max-w-[75%] ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed break-words ${
                              isMe
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span
                            className={`text-[10px] mt-1 px-1 ${
                              isMe ? "text-gray-400" : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isMe && (
                              <FaCheckDouble className="inline ml-1 text-blue-500" />
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <FaPlus />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <FaSmile />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || loading}
                    className={`p-2 rounded-full transition-all ${
                      messageText.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State (Desktop) */
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <FaPaperPlane className="text-4xl text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Messages
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Select a conversation from the list or start a new one to
                connect with your friends.
              </p>
              <button
                onClick={() => setShowUserList(true)}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start New Message
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Messages;
