import Axios from "axios";
import Cookies from 'js-cookie'
import qs from "qs"

let dns = null;
let proxyRequired = window.cors;
let isIptveditor = null;

setDns(window.dns);

export async function get(url, timeout = 1) {
    return Axios.get(url).catch(err => err);
}

export async function post(url, params = {}, local, useProxy) {
    if (!dns)
        return null;

    let uri = url

    if (local === true && !window.location.origin.match(/iptveditor\.com|localhost/)) {
        return Axios.post(uri, qs.stringify(params)).catch(err => err)
    }

    if (isIptveditor === false) {
        uri += "?";
        for (const key in params) {
            uri += key + "=" + encodeURIComponent(params[key]) + "&";
        }
    }

    if ((proxyRequired || useProxy) === true && isIptveditor === true)
        uri = "/proxy.php?url=" + encodeURIComponent(dns);
    else if ((proxyRequired || useProxy) === true && isIptveditor === false)
        uri = "/proxy.php?url=" + encodeURIComponent(dns + uri);
    else if (isIptveditor === false)
        uri = dns + uri;
    else uri = dns;

    return isIptveditor === true && !(proxyRequired || useProxy)?
        Axios.post(uri, qs.stringify(params)) :
        Axios.get(uri, {
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edge/86.0.622.28'
            },
            timeout: 25000
        }).catch(err => {
            if(proxyRequired === false && !useProxy && !err.response)
                return post(url, params, local, true)
            return err
        });

}


export function setDns(data) {
    if (!data)
        return;
    if (window.location.protocol !== 'https:' && data.includes("https"))
        data = data.replace("https", "http");
    else if (window.location.protocol === 'https:' && !data.includes("https"))
        data = data.replace("http", "https");

    isIptveditor = !!data.match(/iptveditor\.com|xtream-ie|opop\.pro|localhost|192\.168\.178\.71\:3100/)

    if (window.isDebug === 1)
        data = window.dns;
    else if (isIptveditor === true && window.isDebug !== 1)
        data = `${process.env.REACT_APP_IPTVEDITOR_API}webplayer`;
    else {
        if (data[data.length - 1] !== "/")
            data += "/";
    }

    dns = data;
    Cookies.set("dns", data, { expires: 365 })
}

export function getDns() {
    return dns;
}

export function getIsIptveditor() {
    return isIptveditor;
}