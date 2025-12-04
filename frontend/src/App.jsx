import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import LandingHeader from "./components/LandingHeader";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { Outlet, useLocation } from "react-router-dom";
import { useSocialMedia } from "./store/SocialMediaContext";
import { getUsersFromServer } from "./services/userServices";
import { getPostsFromServer } from "./services/postServices";
import { LOAD_BOOKMARKS, LOAD_USERS, LOAD_POSTS } from "./store/actionTypes";
import { getBookmarksFromServer } from "./services/bookmarkServices";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, dispatch, getAlbums } = useSocialMedia();

  // Scroll to top on route change
  const { pathname } = useLocation();
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  // Load Albums when user changes
  useEffect(() => {
    if (state.currentUser) {
      getAlbums(state.currentUser.id);
    }
  }, [state.currentUser, getAlbums]);

  // GLOBAL DATA FETCHING
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Fetch Posts
        const posts = await getPostsFromServer();
        dispatch({ type: LOAD_POSTS, payload: posts });

        // 2. Fetch Users
        const users = await getUsersFromServer();
        dispatch({ type: LOAD_USERS, payload: users });

        // 3. Sync Current User
        if (state.currentUser) {
          const freshCurrentUser = users.find(
            (u) => u.id === state.currentUser.id
          );
          if (freshCurrentUser) {
            localStorage.setItem("user", JSON.stringify(freshCurrentUser));
            dispatch({
              type: "UPDATE_CURRENT_USER",
              payload: freshCurrentUser,
            });
          }

          // 4. Fetch Bookmarks
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
    <div className="flex relative h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      {state.currentUser && (
        <div className="hidden md:flex">
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      )}

      <div
        id="main-content"
        className={`flex flex-col h-full overflow-y-auto flex-1 relative
          ${state.currentUser ? "md:ml-20 lg:ml-60 xl:ml-64 2xl:ml-72" : ""}
          transition-all duration-300 ease-in-out pb-16 md:pb-0`}
      >
        {state.currentUser ? (
          <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        ) : (
          <LandingHeader />
        )}
        <Outlet />
        <Footer />

        {/* Bottom Navigation - Visible only on mobile */}
        <BottomNav />
      </div>
    </div>
  );
}

export default App;
