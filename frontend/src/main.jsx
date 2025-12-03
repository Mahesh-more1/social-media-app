import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import SocialMediaProvider from "./store/SocialMediaContext.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Messages from "./pages/Messages.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import Friends from "./pages/Friends.jsx";
import Photo from "./pages/Photo.jsx";
import Communities from "./pages/Communities.jsx";
import EditPost from "./pages/EditPost.jsx";
import Events from "./pages/Events.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Auth from "./pages/Auth.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <Auth />,
      },
      {
        path: "/create-post",
        element: <CreatePost />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
      },
      {
        path: "/bookmarks",
        element: <Bookmarks />,
      },
      {
        path: "/friends",
        element: <Friends />,
      },
      {
        path: "/photos",
        element: <Photo />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/communities",
        element: <Communities />,
      },
      {
        path: "post/:postId/edit",
        element: <EditPost />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/album/:albumId",
        element: <AlbumPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocialMediaProvider>
      <RouterProvider router={router} />
    </SocialMediaProvider>
  </StrictMode>
);
