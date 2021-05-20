import {loadEpg} from "./load-playlist" 
import {getIsIptveditor} from "./axios"

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


export async function downloadEpgData(chId, epgId, limit = 1, shift = 0){
    let available = isAvailable(epgId,limit);

    if(available === -1)
        return [];
    else if(available === 1)
        return getEpg(epgId, limit, shift);
    else{
        await loadEpg(epgId, limit).then(result=>{
            if(!result)
                return null;
            result = result.epg_listings;
            if(result.length > 0){
                result = convertEpgListing(result);

                const dataset = epgMap.has(epgId) ? epgMap.get(epgId) : {days:{},data:[]}
                mergeDay(dataset,result, limit);
                epgMap.set(epgId,dataset)

            }else{
                if(epgMap.has(epgId)){
                    if(!epgMap.get(epgId))
                        return [];
                    if(!epgMap.get(epgId).days)
                        epgMap.get(epgId).days = {}
                    epgMap.get(epgId).days[limit] = false;
                }else if(limit === 1)
                    epgMap.set(epgId,false);
                else{
                    let obj = {days:{},data:[]};
                    obj.days[limit] = false;
                    epgMap.set(epgId,obj);
                }
                return [];
            }
        })
    }
}

export function isAvailable(id, day=1){
    if(epgMap.has(id)){
        if(!epgMap.get(id).days || !epgMap.get(id).days[day])
            return 0;
        else if(epgMap.get(id).days[day]===false)
            return -1
        else if(epgMap.get(id).days[day]===true)
            return 1;
    }return 0;
}


export function getEpg(id, day = 1, shift = 0) {
    if (!id || isAvailable(id, day) !== 1)
        return [];
    let arr = epgMap.get(id).data.map((x) => ({...x}));;

    let start = new Date();
    start.setHours(0,0,0,0);
    start = start.getTime()+((day-1)*3600000*24)

    let end = new Date();
    end.setHours(23, 59, 59, 999);
    end = end.getTime()+((day-1)*3600000*24)

    if (shift !== 0) {
        arr.forEach(x => {
            const sh = shift * 60 * 60 * 1000;
            x.start += sh;
            x.end += sh
        })
    }

    return arr.filter(x=> (x.start >= start && x.start < end) ||  (x.start < start && x.end > start));
}

export function getSingleEpgNow (id, shift){
    let arr = getEpg(id,1,shift);   
    return arr.find(x=>x.start <= Date.now() &&  x.end > Date.now())
}

export function getEpgNow(id,shift){
    let arr = getEpg(id,1,shift);   
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    return arr.filter(x => 
        (x.start <= Date.now() && x.end > Date.now()) 
        || 
        (x.start > Date.now() && x.start < end.getTime()))
}



function convertEpgListing(data){
    return data.map(x=>{
        return{
            title : x.title,
            description : x.description,
            start : convertTimestamp(x.start_timestamp),
            end : convertTimestamp(x.stop_timestamp)
        }
    })
}

function convertTimestamp(time){
    return parseInt(time + "000");
}


function mergeDay(dataset,entries, day){
    dataset.days[day] = true
    dataset.data = dataset.data.concat(entries);
    dataset.data = dataset.data.sort((a,b)=>a.start-b.start).filter((x, index, self) =>
        index === self.findIndex((t) => (
            t.start === x.start
        ))
    )
    return dataset;
}