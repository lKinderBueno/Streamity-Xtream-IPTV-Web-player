export const setVolume = (add = false) => {
    return{
        type: "SET_VOLUME",
        payload: add ? 10 : -10
    }
}
