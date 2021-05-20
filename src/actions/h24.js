export const setH24 = (h24) => {
    return{
        type: "SET_H24",
        payload: h24 ? "HH:MM" : "hh:MM TT"
    }
}
