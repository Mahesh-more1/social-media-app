import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useSocialMedia } from "./store/SocialMediaContext";
import { getUsersFromServer } from "./services/userServices";
import { LOAD_BOOKMARKS, LOAD_USERS } from "./store/actionTypes";
import { getBookmarksFromServer } from "./services/bookmarkServices";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch, getAlbums } = useSocialMedia();
  useEffect(() => {
    if (state.currentUser) {
      getAlbums(state.currentUser.id);
    }
  }, [state.currentUser, getAlbums]);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Fetch fresh users from backend
        const users = await getUsersFromServer();
        dispatch({ type: LOAD_USERS, payload: users });

        // ✅ Find current user in the fetched users array
        if (state.currentUser) {
          const freshCurrentUser = users.find(
            (u) => u.id === state.currentUser.id
          );

          // ✅ If found, update Redux with fresh following array from backend
          if (freshCurrentUser) {
            localStorage.setItem("user", JSON.stringify(freshCurrentUser));
            dispatch({
              type: "UPDATE_CURRENT_USER", // Add this action type
              payload: freshCurrentUser,
            });
          }
        }

        // Fetch bookmarks if logged in
        if (state.currentUser) {
          const bookmarksData = await getBookmarksFromServer();
          const bookmarkIds = bookmarksData.map((p) => p.id);
          dispatch({ type: LOAD_BOOKMARKS, payload: bookmarkIds });
        }
      } catch (error) {
        console.error("App init failed:", error);
      }
    };

    initializeApp();
  }, []);
  return (
    <div className="flex relative">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {state.currentUser && (
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      <div
        className={`flex flex-col min-h-screen w-full
          ${state.currentUser ? "md:ml-20 lg:ml-60 xl:ml-64 2xl:ml-72" : ""}
          transition-all duration-300 ease-in-out`}
      >
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default App;
