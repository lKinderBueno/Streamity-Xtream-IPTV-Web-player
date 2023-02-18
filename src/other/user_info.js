import Cookies from 'js-cookie'
import * as Axios from "./axios"

const userInfo = {};

export function getInfo(){
    return userInfo;
}

export function setInfo(data, serverInfo){
    userInfo.expiry = new Date(parseInt(data.exp_date+"000"));
    userInfo.username = data.username;
    userInfo.password = data.password;
    userInfo.max_connections = data.max_connections;
    userInfo.message = data.message;

    Axios.post("/epg.php",{init:1, username: userInfo.username, password: userInfo.password, 
        dns: `${serverInfo.server_protocol}://${serverInfo.url}:${serverInfo.port}`
    },true);

    Cookies.set("username",data.username,{ expires: 365 });
    Cookies.set("password",data.password,{ expires: 365 });
}

export function logout(){
    Cookies.remove("dns");
    Cookies.remove("username");
    Cookies.remove("password");
    window.location = "/";
}