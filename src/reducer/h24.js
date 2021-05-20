import Cookies from 'js-cookie'

const h24Reducer = (state = Cookies.get("h24")||"HH:MM", action) => {
    switch(action.type){
        case "SET_H24":
            Cookies.set("h24",action.payload,{ expires: 365 })
            return action.payload;
        default:
            return state;
    }
}

export default h24Reducer;