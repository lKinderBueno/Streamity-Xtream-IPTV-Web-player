import Cookies from 'js-cookie'

const streamFormatReducer = (state = Cookies.get("streamFormat")||"ts", action) => {
    switch(action.type){
        case "SET_STREAM_FORMAT":
            Cookies.set("streamFormat",action.payload,{ expires: 365 })
            return action.payload;
        default:
            return state;
    }
}

export default streamFormatReducer;
