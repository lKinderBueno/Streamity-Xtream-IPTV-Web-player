const playlistEpisodeReducer = (state = [], action) => {
    switch(action.type){
        case "SET_PLAYLIST_EPISODES":
            return action.payload;
        default:
            return state;
    }
}

export default playlistEpisodeReducer;