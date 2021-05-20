exports.getEpg = (epg,id) => {
    let toReturn = id && epg && epg.find(x=>id === x.id && x.start <= Date.now() && x.end > Date.now());
    if(!toReturn)
        return {start:undefined}
    else return toReturn;
}

