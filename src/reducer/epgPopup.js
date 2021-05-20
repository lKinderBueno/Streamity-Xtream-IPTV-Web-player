const epgPopupReducer = (state = null, action) => {
    switch(action.type){
        case "SET_EPG_POPUP":
            return action.payload;
        default:
            return state;
    }
}

export default epgPopupReducer;