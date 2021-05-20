import {getInfo} from "./user_info"
import {getDns} from "./axios"

export function generateUrl (type, id, extension){
    const dns = getDns();
    const user = getInfo().username;
    const pass = getInfo().password;
    return `${dns}${type}/${user}/${pass}/${id}.${extension}`
}

export function catchupUrlGenerator (url,time, duration){
    time = timeConverter(time)
    url = url.replace.replace("/live/","/").replace(/\.ts|\.m3u8/g,"")
    const splitted = url.split("/");

    const id = splitted[splitted.length-1];
    if(isNaN(id))
        return;
    const user = splitted[splitted.length-3];
    const pass = splitted[splitted.length-2];
    const domain = splitted.slice(0,splitted.length-3).join("/");

    return domain + "/timeshift/" + user + "/" + pass + "/" + duration + "/" + time.split(":").slice(0,-1).join(":").replace(" ",":") + "/" + id + ".m3u8";
}

const timeConverter = (time) =>{
    const a = new Date(time);
    const year = a.getFullYear();
    const month = a.getMonth()+1;
    const day = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();

    return year + "-" + (month < 10 ? "0"+month : month) + "-" + (day < 10 ? "0"+day : day) + " " + (hour < 10 ? "0"+hour : hour) + ':' + (min < 10 ? "0"+min : min) + ':' + (sec < 10 ? "0"+sec : sec);
};

export default {generateUrl, catchupUrlGenerator}
