import * as axios from "./axios";
import { getInfo } from "./user_info"
import { getVodTmdbData, getSeriesTmdbData, clearEpisodeName } from "./tmdb"
import { downloadEpgDataFromCategories } from "./epg-database";
import { groupBy } from './group-by';
import Axios from "axios";

export async function loadGroup(mode) {
    return await axios.post("player_api.php", {
        username: getInfo().username,
        password: getInfo().password,
        action: getAddress(mode, true)
    }).then(res => res.data).catch(err => [])
}

export async function loadPlaylist(mode, group) {
    const result = await axios.post("player_api.php", {
        username: getInfo().username,
        password: getInfo().password,
        action: getAddress(mode, false),
        category_id: isNaN(group) ? "*" : group
    }).then(res => res.data).catch(err => [])
    if (mode === "live" && !isNaN(group) && axios.getIsIptveditor() === true) {
        await downloadEpgDataFromCategories(result)
    }
    //else if(mode==="movie")
    //    result.data = result.data.sort((a,b)=>b.added-a.added)
    //else if(mode==="series")
    //    result.data = result.data.sort((a,b)=>b.last_modified-a.last_modified)
    return result;
}

export async function loadEpg(epg_id, limit = 1) {
    let now = new Date();

    if (axios.getIsIptveditor() === true) return [];

    return await axios.post("/epg.php", {
        username: getInfo().username,
        password: getInfo().password,
        action: "get_simple_data_table",
        epg_id: epg_id,
        limit: limit,
        start: parseInt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + limit - 1, 0, 0, 0, 0).getTime() / 1000),
        stop: parseInt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + limit - 1, 23, 59, 59, 9999).getTime() / 1000),
    }, true).catch(err => [])
        .then(result => {
            return result.data;
        });
}


export async function loadEpgArray(epg_ids, limit = 2) {
    if (axios.getIsIptveditor() === false) return []
    let now = new Date();
    const programmes = [];

    const set = new Set()
    const map = {}

    epg_ids.filter(x=>!!x).forEach(x=> {
        const id = x.replace(/\.(plus|minus)\d+$/,"")
        set.add(id)

        const shift = x.match(/\.(plus|minus)(?<number>\d+)$/)
        if(shift && shift.groups){
            const list = map[id] || []
            list.push(shift.groups.number)
            map[id] = list
        }
    })
    epg_ids = Array.from(set)

    for (let i = 0, j = epg_ids.length; i < j; i += 50) {
        let sliced = epg_ids.slice(i, i + 50)

        const result = await Axios.post( `${process.env.REACT_APP_IPTVEDITOR_API}webplayer`, {
                username: getInfo().username,
            password: getInfo().password,
            action: "get_simple_data_table_array",
            epg_ids: sliced,
            limit: limit,
            start: parseInt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + limit - 1, 0, 0, 0, 0).getTime() / 1000),
            stop: parseInt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + limit - 1, 23, 59, 59, 9999).getTime() / 1000),
        }).then(result=> result.data).catch(err=> [])
        
        Object.keys(map).filter(c=> sliced.includes(c)).forEach(c=>{
            const pgs = result.filter(x=>x.id === c)
            map[c].forEach(shift => {
                const id = c + (shift > 0 ? `.plus${shift}` : `.minus${shift}`)
                pgs.forEach(p=> result.push({
                    ...p,
                    id,
                    start: p.start + (shift * 3600),
                    stop: p.stop + (shift * 3600)
                }))
            })
            
        })

        result.forEach(p=> programmes.push(p))
    }

    const toReturn = groupBy(programmes, "id")

    return toReturn;
}

export async function getVodInfo(vod_id, name, existingTmdb) {
    let result = null;
    if (axios.getIsIptveditor() === false) {
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

    if (result && result.info && result.info.cover_big)
        return result;

    return await getVodTmdbData(name, existingTmdb)
}

export async function getSeriesInfo(series_id, name, only_info, existingTmdb) {
    let result = null;
    if (axios.getIsIptveditor() === false || only_info === false) {
        result = await axios.post("player_api.php", {
            username: getInfo().username,
            password: getInfo().password,
            action: "get_series_info",
            series_id: series_id,
        }).catch(err => null)
            .then(result => {
                if (result.data && Array.isArray(result.data)) {
                    result.data.forEach(x => {
                        if (!x.episode_num && x.episode)
                            x.episode_num = x.episode
                    })
                }
                return result.data;
            });
    }

    if (axios.getIsIptveditor() === true)
        return await getSeriesTmdbData(name, result, existingTmdb)
    else if (only_info === false)
        clearEpisodeName(name, result)
    return result;
}


const getAddress = (mode, group) => {
    switch (mode) {
        case "live":
            if (!group)
                return "get_live_streams"
            else return "get_live_categories"
        case "movie":
            if (!group)
                return "get_vod_streams"
            else return "get_vod_categories"
        case "series":
            if (!group)
                return "get_series"
            else return "get_series_categories"
        default:
            return "";
    }
}


