export const setStreamFormat = (extension) => {
    return{
        type: "SET_STREAM_FORMAT",
        payload: extension === "m3u8" ? "m3u8" : "ts"
    }
}
