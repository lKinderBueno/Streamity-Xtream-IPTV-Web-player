import playingChannelReducer from "./playingChannel";
import playlistEpisodeReducer from "./playlist-episodes";

import groupsReducer from "./groups";
import playlistReducer from "./playlist";
import timer60Reducer from "./timer60s";
import timer5Reducer from "./timer5s";
import epgPopupReducer from "./epgPopup";
import h24Reducer from "./h24";
import streamFormatReducer from "./stream-format";
import {combineReducers} from "redux";

const allReducer = combineReducers({
    playingCh : playingChannelReducer,  // solo counterReducer => counterReducer :  counterReducer
    timer60 : timer60Reducer,
    timer5 : timer5Reducer,
    h24 : h24Reducer,
    streamFormat : streamFormatReducer,
    epgPopup : epgPopupReducer,
    groupsList : groupsReducer,
    playlist : playlistReducer,
    playlistEpisodes : playlistEpisodeReducer,
})

export default allReducer;