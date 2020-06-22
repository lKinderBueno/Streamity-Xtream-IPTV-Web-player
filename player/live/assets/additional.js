var someDate = new Date();
someDate = new Date(someDate.getFullYear(),someDate.getMonth(),someDate.getDate(),0,0,0,0);
var pageZero = true;
var page = 0;
this.addEventListener('load', function () {
    getEpg();
}, false);


function hideTimer(){
    var bounding = timerToHide.getBoundingClientRect();
    if(bounding.left<250)
        timerToHide.style.visibility="hidden";
    else timerToHide.style.visibility="unset";
}

async function setDay(html,date){
    //document.getElementById("fullLoader").style.display="";
    //document.getElementById("fullLoader").style.opacity=1;
    await sleep(300);
    document.getElementsByClassName("c-weekSchedule__item is-active c-weekSchedule__timeslot ng-star-inserted")[0].setAttribute("class","c-weekSchedule__item ng-star-inserted");
    html.setAttribute("class","c-weekSchedule__item is-active c-weekSchedule__timeslot ng-star-inserted");
    someDate.setDate(new Date().getDate()+date);
    document.getElementById("tool_day").innerHTML=someDate.getDate();
    document.getElementById("tool_month").innerHTML=someDate.getMonth()+1;
    if(date==0){
        pageZero=true;
        document.getElementById("timer_now").style.display="";
        await sleep(100);
        timerToHide.style.visibility="visible";
    }else{
        pageZero=false;
        document.getElementById("timer_now").style.display="none";
    }
    page = date;
    populateEpg();
    if(date==0){
        var timer=new Date();
        document.getElementById("scroll_width").scrollLeft=(timer.getHours()-1)*300;
    }
    //document.getElementById("fullLoader").style.opacity=0;
    //await sleep(300);
    //document.getElementById("fullLoader").style.display="none";
}

var timerToHide;
async function getEpg(){

    var timing = document.getElementById("timings");
    for(var i=0;i<=24;i++){
        var left=300*i;
        if(parent.h24=="24"){
            if(i==0)
                var date="";
            else if(i==24)
                var date = "00:00";
            else if(i>9)
                var date = i+":00";    
            else var date = "0"+i+":00";
        }else{
            if(i==0)
                var date="";
            else if(i==24)
                var date = "12:00AM";
            else if(i>12){
                var m=i-12;
                if(m>9)
                    var date = m+":00PM";  
                else
                    var date = "0"+m+":00PM";    
            }else if(i<=12){
                if(i>9)
                    var date = i+":00AM";  
                else
                    var date = "0"+i+":00AM";    
            }
        }
        var string = '<button class="c-timeline__timing ng-star-inserted" style="left:'+left+'"><div>'+date+'</div></button>';
        timing.innerHTML+=string;
    }
    populateEpg();
    var timer=new Date();
    document.getElementById("scroll_width").scrollLeft=(timer.getHours()-1)*300;
    await sleep(10); 
    syncEpgBar();
    timerToHide=document.getElementById("timer_now");
    document.getElementById("scroll_width").addEventListener("scroll",hideTimer);
    document.getElementById("tool_day").innerHTML=timer.getDate();
    document.getElementById("tool_month").innerHTML=timer.getMonth()+1;

    var month = new Array();
    month[0] = "Jan.";
    month[1] = "Feb.";
    month[2] = "Mar.";
    month[3] = "Apr.";
    month[4] = "May.";
    month[5] = "June.";
    month[6] = "July.";
    month[7] = "Aug.";
    month[8] = "Sept.";
    month[9] = "Oct.";
    month[10] = "Nov.";
    month[11] = "Dec.";

    timer.setDate(timer.getDate()+2);
    document.getElementById("2days").innerHTML=timer.getDate() + " " + month[timer.getMonth()];
    timer.setDate(timer.getDate()+1);
    document.getElementById("3days").innerHTML=timer.getDate() + " " + month[timer.getMonth()];
    timer.setDate(timer.getDate()+1);
    document.getElementById("4days").innerHTML=timer.getDate() + " " + month[timer.getMonth()];
    timer.setDate(timer.getDate()+1);
    document.getElementById("5days").innerHTML=timer.getDate() + " " + month[timer.getMonth()];
    timer.setDate(timer.getDate()+1);
    document.getElementById("6days").innerHTML=timer.getDate() + " " + month[timer.getMonth()];

    document.getElementById("fullLoader").style.opacity=0;
    await sleep(300);
    document.getElementById("fullLoader").style.display="none";
}


async function search(mode){
    var list = document.getElementsByClassName("c-channel-events ng-star-inserted");
    var search_where = $('input[name="search_mode"]:checked').val();
    var word = $('input[id="input_search"]').val();
    if(search_where==0){    
        if(mode){
            if(word==="" || !word)
                return;
            var regex = new RegExp(word, "i");
            loop1:
            for(var i = 0;i<list.length;i++){
                var titleList = list[i].getElementsByClassName("c-show__title ellipsis");
                var remove = true;
                loop2:
                for(var m = 0;m<titleList.length;m++){
                    try{
                        if(titleList[m].innerText.match(regex)){
                            remove = false;
                            titleList[m].parentElement.parentElement.className+=" searched";
                            //break loop2;
                        }
                    }catch(Ex){

                    }
                }
                if(remove)
                    list[i].style.display="none";

                if(pageZero){
                    document.getElementById("timer_now").style.display="none";
                }
            }
        }else{
            var i=0;
            if(pageZero)
                document.getElementById("timer_now").style.display="";
            for(i = 0;i<list.length;i++){
                list[i].style.display="";
            }
            Array.from(document.getElementsByClassName("c-show searched")).forEach((item) => {
                item.className="c-show";
            });
            Array.from(document.getElementsByClassName("c-show is-active searched")).forEach((item) => {
                item.className="c-show";
            });
        }
    }
    else{
        //document.getElementById("fullLoader").style.display="";
        //document.getElementById("fullLoader").style.opacity=1;
        //await sleep(300);
        if(mode){
            if(word==="" || !word)
                return;
            var i=0;
            var m=0;

            var list_start = document.getElementById("channel_container");
            while (list_start.firstChild) {
                list_start.removeChild(list_start.lastChild);
            }
            await sleep(3);
            var regex = new RegExp(word, "i");
            var unixDate = someDate.getTime();
            var unixDateEndDate = new Date(someDate);
            unixDateEndDate.setDate(unixDateEndDate.getDate()+1);
            unixDateEndDate = unixDateEndDate.getTime();
            var list = parent.json["Channel"].filter(o=> o["Name"].match(regex));
            for(var counter = 0; counter<list.length;counter++){
                if(counter%10==0){
                    if(pageZero)
                        syncEpgBar();
                    await sleep(3);
                }
                var item = list[counter];
                var channelNameStart = '<div class="c-channel-events"><div class="c-channel c-channel-events__channel" onclick="playChannel('+item['chNumber']+","+item['Order']+')"><a class="c-channel__container" href="javascript:void(0)"><div class="c-channel__logo"><img src="'+item["Image"]+'" onerror="this.onerror=null;this.src='+"'assets/nologo.png'"+'"></div><p class="c-channel__number">'+item["Name"]+'</p></a></div>';
                var channelEpgContainerStart = '<div class="c-channel-events__container" style="width: 7300px;">';
                var toAppend = channelNameStart+channelEpgContainerStart;
                try{
                    var listEpg = parent.epgJson[item["EPG"]];
                    loop1:
                    for(var count = 0; count<listEpg.length;count++){
                        try{
                            var item2 = listEpg[count];
                            var stop = item2["stop"];
                            var start = item2["start"];
                            if(stop>unixDate && start<unixDateEndDate){
                                var dateStart = new Date(start);
                                var dateStop = new Date(stop);
                                if(start < unixDate){
                                    var starter=0;
                                    var stopper = (stop - unixDate)*0.0000833;
                                }else {
                                    var starter = (start-unixDate)*0.0000833;
                                    if(stop > unixDateEndDate)
                                        var stopper = 7300;
                                    else var stopper = (stop-unixDate)*0.0000833;
                                }
                                var title =item2["title"];
                                if(stopper>7300)
                                    stopper=7300;
                                starter = starter.toFixed(2);
                                var width = (stopper-starter).toFixed(2);
                                var eventStart='<div class="c-channel-events__show ng-star-inserted event_parasite" gtvmodaldatatype="event" style="width: '+ width +'px;left:'+starter+'px"><div class="c-show" onclick="showData(this,'+item2['id']+",'"+item["EPG"]+"'"+')"><div class="c-show__body"><p class="c-show__title ellipsis"><a href="javascript:void(0)">'+title+'</a></p><p class="c-show__time ellipsis">'+ parent.getWellDate(dateStart,parent.h24) + " - " + parent.getWellDate(dateStop,parent.h24)+'</p></div><div class="ng-star-inserted" style="display:none"><progress max="" class="c-progress c-show__progress" value=""><span class="c-progress__fallback" style="width: 14%;"></span></progress></div></div></div>';
                                toAppend+=eventStart;
                            }else if(start>=unixDateEndDate)
                                break loop1;
                        }catch(ex){

                        }
                    }
                    var channelEpgContainerStop = '</div>';
                    toAppend+=channelEpgContainerStop;
                    list_start.innerHTML+=toAppend;
                }catch(ex){

                }
            }
            if(pageZero)
                syncEpgBar();
        }else{
            populateEpg();
        }
        /*document.getElementById("fullLoader").style.opacity=0;
        await sleep(300);
        document.getElementById("fullLoader").style.display="none";*/
    }
}


async function getText(url) {
    var ret = false;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'text';
        xhr.onerror = function() { resolve("4"); };
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                ret = true;
                resolve(xhr.responseText);
            }else resolve("2");
        };
        xhr.send();
    });
}




async function populateEpg(startCount=0,loadmore=false){
    var list_start = document.getElementById("channel_container");
    while (list_start.firstChild) {
        list_start.removeChild(list_start.lastChild);
    }

    var list = parent.json["Channel"].filter(o=> o["Order"]==parent.selectedGroup);
    start=parseInt(start);
    document.getElementById("loadlessEpg").style.display="none";
    document.getElementById("loadmoreEpg").style.display="none";
    
    if(list.length<=80 || start+80>=list.length){
        var end = list.length;
    }else {
        var end = parseInt(startCount)+80;
    }

    var unixDate = someDate.getTime();
    var unixDateEndDate = new Date(someDate);
    unixDateEndDate.setDate(unixDateEndDate.getDate()+1);
    unixDateEndDate = unixDateEndDate.getTime();

    try{
        for (startCount; startCount < end; startCount++) {   
            if(startCount%10==0)
                await sleep(3);
            var item=list[startCount];
            var channelNameStart = '<div class="c-channel-events ng-star-inserted" style="background-position: 5779.13px center;"><div class="c-channel c-channel-events__channel"  onclick="playChannel('+item['chNumber']+","+item['Order']+')"><a class="c-channel__container" href="javascript:void(0)"><div class="c-channel__logo"><img src="'+item["Image"]+'" onerror="this.onerror=null;this.src='+"'assets/nologo.png'"+'"></div><p class="c-channel__number">'+item["Name"]+'</p></a></div>';
            var channelEpgContainerStart = '<div class="c-channel-events__container">';
            var toAppend = channelNameStart+channelEpgContainerStart;
            try{
                var listEpg = parent.epgJson[item["EPG"]];
                loop1:
                for(var count = 0; count<listEpg.length;count++){
                    var item2 = listEpg[count];
                    var stop = item2["stop"];
                    var start = item2["start"];
                    if(stop>unixDate && start<unixDateEndDate){
                        var dateStart = new Date(start);
                        var dateStop = new Date(stop);
                        if(start < unixDate){
                            var starter=0;
                            var stopper = (stop - unixDate)*0.0000833;
                        }else {
                            var starter = (start-unixDate)*0.0000833;
                            if(stop > unixDateEndDate)
                                var stopper = 7300;
                            else var stopper = (stop-unixDate)*0.0000833;
                        }
                        var title =item2["title"];
                        if(stopper>7300)
                            stopper=7300;
                        starter = starter.toFixed(2);
                        var width = (stopper-starter).toFixed(2);
                        var eventStart='<div class="c-channel-events__show ng-star-inserted event_parasite" gtvmodaldatatype="event" style="width: '+ width +'px;left:'+starter+'px"><div class="c-show" onclick="showData(this,'+item2['id']+",'"+item["EPG"]+"'"+')"><div class="c-show__body"><p class="c-show__title ellipsis"><a href="javascript:void(0)">'+title+'</a></p><p class="c-show__time ellipsis">'+ parent.getWellDate(dateStart,parent.h24) + " - " + parent.getWellDate(dateStop,parent.h24)+'</p></div><div class="ng-star-inserted" style="display:none"><progress max="" class="c-progress c-show__progress" value=""><span class="c-progress__fallback" style="width: 14%;"></span></progress></div></div></div>';
                        toAppend+=eventStart;
                    }else if(start>=unixDateEndDate)
                        break loop1;
                }
            }catch(ex){

            }
            var channelEpgContainerStop = '</div>';
            toAppend+=channelEpgContainerStop;
            list_start.innerHTML+=toAppend;
        }
    }catch(ex){

    }
    if(pageZero)
        syncEpgBar();
    if(startCount>80)
        document.getElementById("loadlessEpg").style.display="block";
    if(startCount<list.length){
        var more = document.getElementById("loadmoreEpg");
        more.style.display="block";
        more.setAttribute("data-start",end);
    }
}



window.setInterval(function(){
    if(pageZero)
        syncEpgBar();
}, 60000);

async function showData(html,epgID,epgGroup){
    var epgData=parent.epgJson[epgGroup][epgID];
    if(epgData["descr"].length==0)
        await getEventCover(epgData["title"],true);
    else{
        await getEventCover(epgData["title"],false);
        document.getElementById("info_descr").innerHTML=epgData["descr"];
    }
    document.getElementById("info_box").style.display="";
    var name = html.parentNode.parentNode.parentNode.firstChild.firstChild.childNodes[1].innerHTML;
    var hour = html.firstChild.childNodes[1].innerHTML;
    var logo = html.parentNode.parentNode.parentNode.firstChild.firstChild.firstChild.firstChild.attributes["src"].value;
    document.getElementById("info_title").innerHTML=epgData["title"];
    document.getElementById("info_channel").innerHTML=name;
    document.getElementById("info_hour").innerHTML=hour;
    document.getElementById("info_logo").setAttribute("src",logo);
    await sleep(100);
    document.getElementById("info_box").style.opacity=1;
}

async function getEventCover(name,descr){
    tmdbApi=parent.tmdbApi;
    if(!tmdbApi){
        document.getElementById("info_img").setAttribute("src","");
        document.getElementById("info_descr").innerHTML="";
    }else{
        var url = "https://api.themoviedb.org/3/search/tv?api_key="+tmdbApi+"f&query="+ name;
        if(descr){
            var language = navigator.language || navigator.userLanguage;
            url+="&language="+language;
        }
        let result = await getText(url);
        try{
            var logo = JSON.parse(result);
            if(logo["total_results"]==0){
                document.getElementById("info_img").setAttribute("src","");
                if(descr)
                    document.getElementById("info_descr").innerHTML="";
            }else{
                if(logo["results"][0]["poster_path"].length!=0)
                    document.getElementById("info_img").setAttribute("src","https://image.tmdb.org/t/p/original"+logo["results"][0]["poster_path"]);
                else document.getElementById("info_img").setAttribute("src","");
                if(descr)
                    document.getElementById("info_descr").innerHTML=logo["results"][0]["overview"];
            }
        }catch(ex){
            document.getElementById("info_img").setAttribute("src","");
            if(descr)
                document.getElementById("info_descr").innerHTML="";
        }
    }
}

function syncEpgBar(){
    var timer = new Date();
    var now = ((timer.getHours()*60)+timer.getMinutes())*5;
    var left = now+248;
    document.getElementById("timer_now").style.left=left;
    var data=parent.getWellDate(timer,parent.h24);
    document.getElementById("timer_now_clock").innerHTML=data;
    var list_start = document.getElementById("channel_container");
    list_start.childNodes.forEach(function (item) {
        var event_row=item.childNodes[1];
        event_row.childNodes.forEach(function (event_row) {
            var eventStart= parseInt(event_row.style.left.replace('px',''));
            var eventLength= parseInt(event_row.style.width.replace('px',''));
            var eventStop= eventLength+eventStart;
            if(event_row.firstChild.getAttribute("class").includes("searched"))
                var searched = " searched";
            else var serached ="";
            if(eventStart<=now && eventStop>now){
                event_row.firstChild.setAttribute("class","c-show is-active"+serached);
                event_row.firstChild.childNodes[1].style.display="";
                event_row.firstChild.childNodes[1].firstChild.setAttribute("max",eventLength);
                event_row.firstChild.childNodes[1].firstChild.setAttribute("value",now-eventStart);
            }else {
                event_row.firstChild.setAttribute("class","c-show"+serached);
                event_row.firstChild.childNodes[1].style.display="none";
            }
        });
    });
}

async function loadMoreEpg(html){
    /* document.getElementById("fullLoader").style.display="";
    document.getElementById("fullLoader").style.opacity=1;
    await sleep(300);
    */document.getElementById("scroll_width").scrollTop = 0;
    var start = html.getAttribute("data-start");
    populateEpg(start,true);
    /*document.getElementById("fullLoader").style.opacity=0;
    await sleep(300);
    document.getElementById("fullLoader").style.display="none";
*/}

async function loadLessEpg(html){
    document.getElementById("scroll_width").scrollTop = 0;
    var start = html.getAttribute("data-start");
    populateEpg(start,true);
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeInfo(){
    document.getElementById("info_box").style.opacity=0;
    await sleep(300);
    document.getElementById("info_box").style.display="none";
}

async function closeSettings(){
    var search_where = $('input[name="search_mode"]:checked').val();
    document.getElementById("settins_box").style.opacity=0;
    await sleep(300);
    document.getElementById("settins_box").style.display="none";
    if(search_where==1)
        document.getElementById("input_search").setAttribute("placeholder","Search channels");
    else document.getElementById("input_search").setAttribute("placeholder","Search events");

}

async function openSettings(){
    document.getElementById("settins_box").style.display="";
    await sleep(100);
    document.getElementById("settins_box").style.opacity=1;
}

function displayDesktop(){
    if(document.getElementById("desktop_day").style.display=="none")
        document.getElementById("desktop_day").style.display="flow-root";
    else document.getElementById("desktop_day").style.display="none";
}

async function moveBar(mode){
    var width = document.getElementById("scroll_width").scrollLeft;

    if(mode){
        var max = width+600;
        while(width<=max){
            width+=25;
            document.getElementById("scroll_width").scrollLeft=width;
            await sleep(3);
        }
    }
    else {
        var max = width-600;
        if(max<0)
            max=0;
        while(width>=max){
            width-=25;
            document.getElementById("scroll_width").scrollLeft=width;
            await sleep(3);
        }
    }
}

function playChannel(channel,group){
    parent.playChannel(channel,group);
    parent.closeEpgFrame();
}