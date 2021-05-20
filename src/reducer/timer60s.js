const timer60Reducer = (state = Date.now(), action) => {
    switch(action.type){
        case "SET_TIMER_60":
            if(action.payload - state > 5000)
                return action.payload;
            return state;
        default:
            return state;
    }
}

export default timer60Reducer;