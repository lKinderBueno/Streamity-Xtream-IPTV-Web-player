
const volumeReducer = (state = 50, action) => {
    switch(action.type){
        case "SET_VOLUME":
            let newVolume = state + action.payload;
            if((state >= 100 && newVolume >=100)||(state <= 0 && newVolume <=0))
                return state
            else if(newVolume > 100)
                newVolume = 100;
            else if(newVolume < 0)
                newVolume = 0;
            return newVolume;
        default:
            return state;
    }
}

export default volumeReducer;