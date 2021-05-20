
const fullScreenReducer = (state = "", action) => {
    switch(action.type){
        case "SET_FULLSCREEN":
            return action.payload;
        default:
            return state;
    }
}

export default fullScreenReducer;