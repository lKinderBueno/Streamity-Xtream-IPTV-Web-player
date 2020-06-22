var chTitle = document.getElementById("channeltitle");
var chDesc = document.getElementById("descrtitle");

document.addEventListener("fullscreenchange", function() {
  videoFullScreen();
});
document.addEventListener("mozfullscreenchange", function() {
  videoFullScreen();
});
document.addEventListener("webkitfullscreenchange", function() {
  videoFullScreen();
});
document.addEventListener("msfullscreenchange", function() {
  videoFullScreen();
});

function videoFullScreen(){
    if(player.isFullscreen()){
        chTitle.style.fontSize='30px';
        chDesc.style.fontSize='21px';
    }else{
        chTitle.style.fontSize='22px';
        chDesc.style.fontSize='17px';
    }
}

function epgBuilder(channelIndex,channel, refresh=false){
    var someDate = new Date();
    //var shift = parseInt(channel["EpgShift"]);
    //shift=shift*3600000;
    var firstRound = true;
    for(var i=1;i<8;i++){
        var epgSec = document.getElementById("TabNo"+i);
        try {
            while (epgSec.firstChild) {
                epgSec.removeChild(epgSec.lastChild);
            }
        } catch (e) {
            //Catch Statement
        }
    }
    for(i=1;i<8;i++){
        if(i==2 && refresh)
            return;
        epgSec = document.getElementById("TabNo"+i);
        try{        
            var list = epgJson[channel["EPG"]];
            if(list.length==0 && i==1){
                document.getElementById("channeltitle").innerHTML=channel["Name"];
                document.getElementById("descrtitle").innerHTML="";
                document.getElementById("progressp").style.display="none";
            }else if(list.length!=0)
                document.getElementById("progressp").style.display="";
        }catch(ex){
            document.getElementById("channeltitle").innerHTML=channel["Name"];
            document.getElementById("descrtitle").innerHTML="";
            document.getElementById("progressp").style.display="none";
            return;
        }
        try {
            if(i==2){
                someDate = new Date(someDate.getFullYear(),someDate.getMonth(),someDate.getDate(),0,0,0,0);
            }
            var unixDate = someDate.getTime();
            var unixDateEndDate = new Date(someDate.getFullYear(),someDate.getMonth(),someDate.getDate()+1,0,0,0,0).getTime();
            loop1:
            for(var count = 0; count<list.length;count++){
                var item = list[count];
                //var stop = item["stop"]+shift;
                //var start = item["start"]+shift;
                var stop = item["stop"];
                var start = item["start"];
                if(stop>unixDate && start<unixDateEndDate){
                    var dateStart = new Date(start);
                    var dateStop = new Date(stop);
                    if(dateStart.getDate()==someDate.getDate() || ((dateStart.getDate()<someDate.getDate())&& dateStop.getDate()==someDate.getDate())){
                        if(i==1 && !isToday(dateStart,dateStop,someDate)){

                        }else{
                            if(i==1 && firstRound){
                                document.getElementById("channeltitle").innerHTML=item["title"];
                                document.getElementById("descrtitle").innerHTML="";
                                var per = percentageFromData(dateStart,dateStop,someDate)+"%";
                                document.getElementById("progress_channel").style.width=per;
                            }
                            if((dateStart.getDate()<someDate.getDate())&& dateStop.getDate()==someDate.getDate()){
                                var toPrint = getWellDate(dateStart,h24,true) + " - " + getWellDate(dateStop,h24)+ '\t'+" " +item["title"]; 
                            }else var toPrint = getWellDate(dateStart,h24) + " - " + getWellDate(dateStop,h24)+ '\t'+" " +item["title"]; 
                            let div = document.createElement('div');
                            div.setAttribute("class", "epginfo");    
                            div.innerHTML=toPrint;

                            if(item["descr"]){
                                if(i==1 && firstRound){
                                    document.getElementById("descrtitle").innerHTML=item["descr"];
                                }
                                let divDesc = document.createElement('div');
                                divDesc.setAttribute("class", "epginfo_description");        
                                divDesc.innerHTML=item["descr"];
                                div.appendChild(divDesc);
                            }else if(i==1 && firstRound){
                                searchEpgDescription(item["title"]);
                            }
                            epgSec.appendChild(div);
                            firstRound = false;
                        }
                    }
                    else if(dateStart>someDate)
                        break loop1;
                }
                else if(start>=unixDateEndDate)
                    break loop1;
                
            }
        } catch (e) {
            continue;
        }
        someDate.setDate(someDate.getDate()+1);
    }
}


function reassignEpg(){
    h24 = $('input[name="epgtime"]:checked').val();
    var channel = json["Channel"].filter(o=> o["Order"]==selectedGroup);
    epgBuilder(selectedChannel,channel[selectedChannel]);
    document.getElementById("close_settings").click();
}

function isToday(dateStart,dateStop,date){
    return (dateStart<=date && dateStop>date)||dateStop>date;
}


/*
function dateConvert(date,shift){
    var date = new Date(date);
    if(shift!="+0"){
        if(parseInt(shift)>=24)
            shift=parseInt(shift)-24;
        date.setHours(parseInt(date.getHours())+parseInt(shift));
    }
    //date.setMinutes(date.getMinutes()+new Date().getTimezoneOffset());
    return date;
}*/

function dateConvert(date){
    return new Date(date);
}


function getWellDate(date,h24,yesteday=false){
    var HH = date.getHours();
    var ampm="";
    if(HH<10)
        HH="0"+HH.toString();
    if(h24==12){
        if(HH=="00"){
            HH="12";
            ampm="AM";
        }else if(HH=="12"){
            HH="12";
            ampm="PM";
        }else if(HH>12){
            HH-=12;
            ampm="PM";
        }else ampm="AM";
    }
    var mm = date.getMinutes();
    if(mm<10)
        mm="0"+mm.toString();
    if(yesteday)
        return date.getDate()+"/"+(parseInt(date.getMonth()+1))+" "+HH+":"+mm+ampm;
    else return HH+":"+mm+ampm;
}

function searchEpg(channel){
    var someDate = new Date();
    //if(parseInt(channel["EpgShift"])>=24)
    //    someDate.setDate(parseInt(someDate.getDate())-1);
    var firstRound = true;
    try {
        var list = epgJson[channel["EPG"]];
        for (var i = 0; i < list.length; ++i) {
            //var dateStart = dateConvert(list[i]["start"],channel["EpgShift"]);
            var dateStart = dateConvert(list[i]["start"]);
            //var dateStop = dateConvert(list[i]["stop"],channel["EpgShift"]);
            var dateStop = dateConvert(list[i]["stop"]);
            if(dateStart<= someDate && someDate<dateStop){
                return list[i]["title"];
            }
        }
    } catch (e) {
    }
    return "";
}

function refreshEpg(){
    try{
        var listEpg = document.getElementsByClassName("epgontitle");
        var listHtml = document.getElementById("listChannel");
        var start = listHtml.getAttribute("start");
        var stop = listHtml.getAttribute("stop");    
        var list = json["Channel"].filter(o=> o["Order"]==selectedGroup);
        var i=0;
        for (start; start<stop; start++) {
            var epgtitle = searchEpg(list[start]);
            listEpg[i++].innerHTML=epgtitle;
        }
    }catch(ex){}
    try{
        epgBuilder(selectedChannel,list[selectedChannel], true);
    }catch(ex){}
}

async function searchEpgDescription(name){
    if(tmdbApi==0)
        return;
    var url = "https://api.themoviedb.org/3/search/tv?api_key="+tmdbApi+"&query="+ name;
    var language = navigator.language || navigator.userLanguage;
    url+="&language="+language;
    
    let result = await getText(url);
    try{
        var logo = JSON.parse(result);
        if(logo["total_results"]!=0){
            document.getElementById("descrtitle").innerHTML=logo["results"][0]["overview"];
        }
    }catch(ex){

    }
}