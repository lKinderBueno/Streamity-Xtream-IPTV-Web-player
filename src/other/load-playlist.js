import * as axios from "./axios";
import {getInfo} from "./user_info"
import {getVodTmdbData, getSeriesTmdbData, clearEpisodeName} from "./tmdb"

export async function loadGroup(mode){
    return await axios.post("player_api.php",{
        username: getInfo().username,
        password : getInfo().password,
        action: getAddress(mode, true)
    }).catch(err => [])
    .then(result =>{
        return result.data;
    });
}

export async function loadPlaylist(mode,group){
    return await axios.post("player_api.php",{
        username: getInfo().username,
        password : getInfo().password,
        action: getAddress(mode, false),
        category_id : isNaN(group) ? "*" : group
    }).catch(err => [])
    .then(result =>{
        return result.data;
    });
}

export async function loadEpg(epg_id, limit = 1){
    let now = new Date();
    

    return await axios.post("/epg.php",{
        username: getInfo().username,
        password : getInfo().password,
        action: "get_simple_data_table",
        epg_id : epg_id,
        limit : limit,
        start: parseInt(new Date(now.getFullYear(),now.getMonth(), now.getDate()+limit-1, 0,0,0,0).getTime()/1000),
        stop: parseInt(new Date(now.getFullYear(),now.getMonth(), now.getDate()+limit-1, 23,59,59,9999).getTime()/1000),
    }, true).catch(err => [])
    .then(result =>{
        return result.data;
    });
}

export async function getVodInfo(vod_id, name) {
    let result = null;
    if (axios.getIsIptveditor()===false) {
        result = await axios.post("player_api.php", {
                username: getInfo().username,
                password: getInfo().password,
                action: "get_vod_info",
                vod_id: vod_id,
            }).catch(err => null)
            .then(result => {
                return result.data;
            });
    }

    if(result && result.info && result.info.cover_big)
        return result;

    return await getVodTmdbData(name)
}

export async function getSeriesInfo(series_id, name, only_info) {
    let result = null;
    if (axios.getIsIptveditor()===false || only_info === false) {
        result = await axios.post("player_api.php", {
            username: getInfo().username,
            password: getInfo().password,
            action: "get_series_info",
            series_id: series_id,
        }).catch(err => null)
        .then(result => {
            return result.data;
        });
    }
    
    if(axios.getIsIptveditor()===true)
        return await getSeriesTmdbData(name, result)
    else if(only_info===false)
        clearEpisodeName(name, result)
    return result;
}


const getAddress = (mode,group) =>{
    switch(mode){
        case "live":
            if(!group)
                return "get_live_streams"
            else return "get_live_categories"
        case "movie":
            if(!group)
                return "get_vod_streams"
            else return "get_vod_categories"
        case "series":
            if(!group)
                return "get_series"
            else return "get_series_categories"
        default:
            return "";
    }
}


