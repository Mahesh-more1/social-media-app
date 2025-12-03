import { createContext, useReducer, useContext, useCallback, useEffect } from "react";
import socialMediaReducer, { initalState } from "./socialMediaReducer";
import { LOAD_ALBUMS, CREATE_ALBUM } from "./actionTypes";
import * as albumService from "../services/albumService";

const SocialMediaContext = createContext(null);

export const useSocialMedia = () => {
  return useContext(SocialMediaContext);
};

const SocialMediaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socialMediaReducer, initalState);

  const getAlbums = useCallback(async (userId) => {
    try {
      const albums = await albumService.getUserAlbums(userId);
      dispatch({ type: LOAD_ALBUMS, payload: albums });
    } catch (error) {
      console.error("Failed to load albums", error);
    }
  }, []);

  const createAlbum = async (albumData) => {
    try {
      const newAlbum = await albumService.createAlbum(albumData);
      dispatch({ type: CREATE_ALBUM, payload: newAlbum });
      return newAlbum;
    } catch (error) {
      console.error("Failed to create album", error);
      throw error;
    }
  };
  
  useEffect(() => {
    if (state.currentUser) {
      getAlbums(state.currentUser.id);
    }
  }, [state.currentUser, getAlbums]);

  return (
    <SocialMediaContext.Provider value={{ state, dispatch, getAlbums, createAlbum }}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export default SocialMediaProvider;

