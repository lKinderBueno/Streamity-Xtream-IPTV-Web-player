import Axios from "axios";
import Cookies from 'js-cookie'
import qs from "qs"

let dns = null;
let proxyRequired = window.cors;
let isIptveditor = null;

setDns(window.dns);

export async function get(url, timeout = 1) {
    return Axios.get(url).catch(err=> err);
}

export async function post(url, params = {}, local) {
    if(!dns)
        return null;

    if(local === true && !window.location.origin.match(/iptveditor\.com|localhost/)){
        return Axios.post(url, qs.stringify(params)).catch(err=> err) 
    }

    if(isIptveditor === false){
        url += "?";
        for (const key in params) {
            url += key + "=" + encodeURIComponent(params[key])+ "&";
        }
    }
        
    if(proxyRequired === true && isIptveditor === true)
        url = "/proxy.php?url=" + encodeURIComponent(dns);
    else if(proxyRequired === true && isIptveditor === false)
        url = "/proxy.php?url=" + encodeURIComponent(dns + url);
    else if(isIptveditor === false)
        url = dns + url;
    else url = dns;

    return isIptveditor === true 
    ? 
    Axios.post(url, qs.stringify(params))
    : 
    Axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/6.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edge/86.0.622.28'
        },
        timeout: 25000
    }).catch(err => err);

}


export function setDns(data) {
    if(!data)
        return;
    if(window.location.protocol !== 'https:' && data.includes("https"))
        data = data.replace("https","http");
    else if(window.location.protocol === 'https:' && !data.includes("https"))
        data = data.replace("http","https");
    
    isIptveditor = !!data.match(/iptveditor\.com|localhost|192\.168\.178\.71\:3000/)

    if(isIptveditor && window.isDebug !== 1)
        data = "https://api.iptveditor.com/webplayer";
    else{
        if(data[data.length-1]!=="/")
            data +="/";
    }

    dns = data;
    Cookies.set("dns",data,{ expires: 365 })
}

export function getDns(){
    return dns;
}

export function getIsIptveditor(){
    return isIptveditor;
}