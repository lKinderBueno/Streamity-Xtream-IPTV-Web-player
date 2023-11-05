import { loadEpg, loadEpgArray } from "./load-playlist"
import { getIsIptveditor } from "./axios"

const epgMap = new Map();
/*
epgMap (map -> key id string)
------id (string -> object)
------------day1  (object -> array)
------------------title
------------------description
------------------start
------------------end

------------day2
------------------title
------------------description
------------------start
------------------end

------------day3
------------------title
------------------description
------------------start
------------------end
*/


export async function downloadEpgData(chId, epgId, limit = 1, shift = 0) {
    if(epgId === "NULL" || !epgId)
        return []
    let available = isAvailable(epgId, limit);

    if (available === -1 || !epgId)
        return [];
    else if (available === 1)
        return getEpg(epgId, limit, shift);
    else {
        await loadEpg(epgId, limit).then(result => {
            if (!result)
                return null;
            result = result.epg_listings;
            if (result && result.length > 0) {
                result = convertEpgListing(result);

                const dataset = epgMap.has(epgId) ? epgMap.get(epgId) : { days: {}, data: [] }
                mergeDay(dataset, result, limit);
                epgMap.set(epgId, dataset)

            } else {
                if (epgMap.has(epgId)) {
                    if (!epgMap.get(epgId))
                        return [];
                    if (!epgMap.get(epgId).days)
                        epgMap.get(epgId).days = {}
                    epgMap.get(epgId).days[limit] = false;
                } else if (limit === 1)
                    epgMap.set(epgId, false);
                else {
                    let obj = { days: {}, data: [] };
                    obj.days[limit] = false;
                    epgMap.set(epgId, obj);
                }
                return [];
            }
        })
    }
}

export function isAvailable(id, day = 1) {
    if (epgMap.has(id)) {
        if (!epgMap.get(id).days || !epgMap.get(id).days[day])
            return 0;
        else if (epgMap.get(id).days[day] === false)
            return -1
        else if (epgMap.get(id).days[day] === true)
            return 1;
    }
    return 0;
}


/*
epgs_multiple:[
    {id: "ciao.it", data:[{title:"...."}]}
]
*/

export async function downloadEpgDataFromCategories(channels) {
    const limit = 1
    let epgIds = Array.from(new Set(channels.map(x => x.epg_channel_id))).filter(x=>x && x !== "NULL")
    let toDownload = isAvailableArray(epgIds);

    if (toDownload.length === 0)
        return;
    else {
        const result = await loadEpgArray(toDownload, limit)
        toDownload.forEach(id => {
            let data = result[[id]]
            if (data && data.length > 0) {
                data = convertEpgListing(data);
                const dataset = epgMap.has(id) ? epgMap.get(id) : { days: {}, data: [] }
                mergeDay(dataset, data, limit);
                epgMap.set(id, dataset)
            } else {
                if (epgMap.has(id)) {
                    if (!epgMap.get(id)){

                    }
                    if (!epgMap.get(id).days)
                        epgMap.get(id).days = {}
                    epgMap.get(id).days[limit] = false;
                } else if (limit === 1)
                    epgMap.set(id, false);
                else {
                    let obj = { days: {}, data: [] };
                    obj.days[limit] = false;
                    epgMap.set(id, obj);
                }
            }
        })

    }
}


export function isAvailableArray(ids) {
    const toReturn = []
    ids.forEach(id => {
        if (!epgMap.has(id)) {
            toReturn.push(id)
        }
    })
    return toReturn
}



export function getEpg(id, day = 1, shift = 0) {
    if (!id || isAvailable(id, day) !== 1)
        return [];
    let arr = epgMap.get(id).data.map((x) => ({ ...x }));;

    let start = new Date();
    start.setHours(0, 0, 0, 0);
    start = start.getTime() + ((day - 1) * 3600000 * 24)

    let end = new Date();
    end.setHours(23, 59, 59, 999);
    end = end.getTime() + ((day - 1) * 3600000 * 24)

    if (shift !== 0) {
        arr.forEach(x => {
            const sh = shift * 60 * 60 * 1000;
            x.start += sh;
            x.end += sh
        })
    }

    return arr.filter(x => (x.start >= start && x.start < end) || (x.start < start && x.end > start));
}

export function getSingleEpgNow(id, shift) {
    let arr = getEpg(id, 1, shift);
    return arr.find(x => x.start <= Date.now() && x.end > Date.now())
}

export function getEpgNow(id, shift) {
    let arr = getEpg(id, 1, shift);
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    return arr.filter(x =>
        (x.start <= Date.now() && x.end > Date.now()) ||
        (x.start > Date.now() && x.start < end.getTime()))
}



function convertEpgListing(data) {
    return data.map(x => {
        return {
            title: x.title,
            description: x.description,
            start: convertTimestamp(x.start || x.start_timestamp),
            end: convertTimestamp(x.stop || x.stop_timestamp)
        }
    })
}

function convertTimestamp(time) {
    return parseInt(time + "000");
}


function mergeDay(dataset, entries, day) {
    dataset.days[day] = true
    dataset.data = dataset.data.concat(entries);
    dataset.data = dataset.data.sort((a, b) => a.start - b.start).filter((x, index, self) =>
        index === self.findIndex((t) => (
            t.start === x.start
        ))
    )
    return dataset;
}