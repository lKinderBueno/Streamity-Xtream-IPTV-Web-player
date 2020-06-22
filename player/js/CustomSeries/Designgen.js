var json;

var selectedGroup="";
var selectedGroupIndex=-1;
var selectedChannel=-1;

var serieInfo;
var selectedSeason=0;
var selectedEpisode=0;

var chrono = [];

var forceGroup = false;

window.onload = function() {
    if(!json||json.lenght==0){
        alert("Can't read list.");
        window.location = path+"dashboard";
    }
    document.getElementById("MoviesContainer").setAttribute("class","free-wall grid effect-3 videoSection");
    populateGroup();
    try{
        chrono = JSON.parse(window.localStorage.getItem('cseries'));
    }catch(ex){
        chrono = [];
    }
    if(!chrono || chrono.length==0){
        chrono = [];
        populateList(0);
    }else 
        try{
            historypopulate();
        }catch(ex){
            chrono = [];
            populateList(0);
        }
    document.getElementById("fullLoader").setAttribute("class","hideOnLoad");
    document.getElementById("loadmoredesk").setAttribute("onclick","loadMore()");
    document.getElementById("loadlessdesk").setAttribute("onclick","loadLess()");
    document.getElementById("vod_play").setAttribute("onclick","playChannel()");
    //document.getElementById("loadlessdesk").style.display="none";
    //document.getElementById("loadmoredesk").style.display="none";
    //document.getElementById("loadlessmobile").style.display="none";
    //document.getElementById("loadmoremobile").style.display="none";
    //playChannel(0);
}


function populateGroup(){
    var listHtml = document.getElementById("listGroup");
    var count = 0;
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute("onclick","historypopulate()");
    a.setAttribute("idgroup",-1);
    a.setAttribute("class","onloadCallCategory");
    a.innerHTML += "Last watched";
    li.appendChild(a);	
    listHtml.appendChild(li);
    
    Object.keys(json).forEach(function (item) {
        li = document.createElement('li');
        a = document.createElement('a');
        a.setAttribute("onclick","populateList("+count+")");
        a.setAttribute("idgroup",count);
        //class="active onloadCallCategory" quando selezionato
        a.setAttribute("class","onloadCallCategory");
        a.innerHTML += item;
        li.appendChild(a);	
        listHtml.appendChild(li);
        count++;
    });
}

async function closeinfo(){
    var display = document.getElementById("menuModal");
    display.style.opacity=0;
    await sleep(50);
    display.style.display="none";
}

async function closeplayer(){
    var display = document.getElementById("videoPlayer");
    player.pause();
    display.style.opacity=0;
    await sleep(50);
    display.style.display="none";
}

async function setSeason(season){
    if(selectedSeason==season)
        return;
    else selectedSeason=season;
    var dataInfo=json[selectedGroup][selectedChannel];
    var episodeList = document.getElementById("episode_list");
    while (episodeList.firstChild) {
        episodeList.removeChild(episodeList.lastChild);
    }
    
    selectedEpisode = -1;
    
    Object.keys(dataInfo["Season"][season]).forEach(function (item) {
        if(dataInfo["Season"][selectedSeason][item]["Title"]!=null && dataInfo["Season"][selectedSeason][item]["Title"]!=""){
            var name=dataInfo["Season"][selectedSeason][item]["Title"];
        }else{
            try{
                var name = serieInfo["season/"+selectedSeason]["episodes"][parseInt(item-1)]["name"];
                if(!name)
                    name = "Episode "+item;
            }catch(ex){
                var name = "Episode "+item;
            }
        }
        let li = document.createElement('li');
        li.setAttribute("class","rippler rippler-default");
        li.setAttribute("onclick",'setEpisode(this,'+item+',"'+name.replace(/'/g, '§')+'")');  
        li.setAttribute("id",'ep-'+item);  
        
        let a = document.createElement('a');
        a.setAttribute("aria-expanded","true");  

        let b = document.createElement('b');
        b.innerHTML=item;
        let label = document.createElement('label');
        label.innerHTML=name;

        a.appendChild(b);
        a.appendChild(label);

        li.appendChild(a);
        episodeList.appendChild(li);
    });
    document.querySelector('[class="column episodes"]').scrollTop=0;
    document.getElementById("serie_play_column").style.display="none";
}

async function setEpisode(element,episode,name){
    if(selectedEpisode==episode)
        return;
    else selectedEpisode=episode;
    name = name.replace('§',"'");
    try {
        document.querySelector('[class="active rippler rippler-default"]').setAttribute("class","rippler rippler-default" );
    } catch (e) {
    }
    if(element!=null){
        element.setAttribute("class","active rippler rippler-default");
    }

    var dataInfo=json[selectedGroup][selectedChannel]["Season"][selectedSeason][episode];
    
    document.getElementById("vod_url2").setAttribute("href",dataInfo["IP"] );
    
    document.getElementById("episode_name").innerHTML=name;
    try{
        var desc = serieInfo["season/"+selectedSeason]["episodes"][episode]["overview"]
        if(desc){
            document.getElementById("episode_description").innerHTML=desc;
            document.getElementById("episode_description").style.display="";
        }else document.getElementById("episode_description").style.display="none";
    }catch(ex){
        document.getElementById("episode_description").style.display="none";
    }
    document.getElementById("episode_number").innerHTML=episode;
    document.getElementById("serie_play_column").style.display="";
    document.getElementById('episode_description').scrollTop=0;
}


async function openInfo(groupIndex, nameSerie){
    serieInfo=null;
    nameSerie=nameSerie.replace('§',"'");
    selectedChannel = nameSerie;
    if(selectedGroupIndex!=groupIndex){
        selectedGroupIndex = groupIndex;
        groupName=Object.keys(json)[groupIndex];    
        selectedGroup = groupName;
    }
    var list = Object.keys(json[selectedGroup]);
    var data = json[selectedGroup];
    var dataInfo=json[selectedGroup][nameSerie];
    if(!dataInfo["Season"] && urlApi!=0){
        dataInfo["Season"]=await getSeasonInfo(dataInfo['PlayID']);
        if(serieInfo!=null)
            dataInfo["useapi"]=true;
        else dataInfo["useapi"]=false;
    }
    var star = document.getElementById("vod_star_row");
    while (star.firstChild) {
        star.removeChild(star.lastChild);
    }
    
    resetEverything(nameSerie);
    document.getElementById("vod_img").src=dataInfo["Image"];
    selectedSeason = -1;
    selectedEpisode = -1;
    var info = chrono.filter(item => item["Group"]== selectedGroup && item["Name"]==nameSerie)[0];
    if(info && dataInfo["Season"][info["S"]][info["E"]]){
        var season = info["S"];
        var episode = info["E"];
    } else {
        var season = Object.keys(dataInfo["Season"])[0];
        var episode = Object.keys(dataInfo["Season"][season])[0];
    }
    var seasonList=document.getElementById("season_list");
    while (seasonList.firstChild) {
        seasonList.removeChild(seasonList.lastChild);
    }
    Object.keys(dataInfo["Season"]).forEach(function (item) {
        let li = document.createElement('li');
        if(item==season)
            li.setAttribute("class","rippler rippler-default active"); 
        else li.setAttribute("class","rippler rippler-default");     
        //li.setAttribute("id","ss"+item);  
        li.setAttribute("onclick","setSeason("+item+")");  
        let a = document.createElement('a');
        a.setAttribute("data-toggle","tab");  
        a.setAttribute("aria-expanded","true");  
        a.innerHTML="Season "+item;
        li.appendChild(a);	
        seasonList.appendChild(li);
    });
    setSeason(season);
    document.getElementById("serie_play_column").style.display="none";
    var display = document.getElementById("menuModal");
    display.style.opacity=0;
    display.style.display="block";
    display.style.paddingRight="4px;";
    await sleep(1);
    display.style.opacity=1;
    
    
    
    if(userApi!=0 && serieInfo==null && dataInfo["useapi"]==true){
        serieInfo =  await getInfoFilmApi(dataInfo['PlayID']);
    }
        
    
    try{
        if(userApi!=0 && dataInfo["useapi"]==true){
            if(isValidUrl(serieInfo["backdrop_path"])){
                $('#modal-background').append('<style>.blur-background:before{background-image: url("'+serieInfo["backdrop_path"]+'");}</style>');
            }else  $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
            document.getElementById("vod_title").innerHTML=nameSerie;
            if(serieInfo["vote_average"]){
                document.getElementById("vod_star_row").style.display="";
                for(var i=0;i<parseInt(serieInfo["vote_average"]/2);i++){
                    let span = document.createElement('span');
                    span.setAttribute("class", "fa fa-star");
                    star.appendChild(span);	 
                }
            }else document.getElementById("vod_star_row").style.display="none";

            if(serieInfo["first_air_date"]){
                document.getElementById("vod_year").innerHTML=serieInfo["first_air_date"];
                document.getElementById("vod_year").style.display="";
            }else document.getElementById("vod_year").style.display="none";


            if(serieInfo["genres"]){
                document.getElementById("vod_genere").innerHTML=serieInfo["genres"];
                document.getElementById("vod_genere").style.display="";
            }else document.getElementById("vod_genere").style.display="none";


            if(serieInfo["overview"]){
                document.getElementById("vod_description").innerHTML=serieInfo["overview"];
                document.getElementById("vod_description").style.display="";
                document.getElementById("descHeading").style.display="";
            }else{ 
                document.getElementById("vod_description").style.display="none";
                document.getElementById("descHeading").style.display="none";
            }
        }
    }catch(ex){
        serieInfo=null;
    }
    if(isValidUrl(dataInfo["Image"]) && serieInfo==null){
        try{
            var infoJson=await getInfoFilm(nameSerie);
            serieInfo=infoJson;
            if(isValidUrl(infoJson["backdrop_path"])){
                $('#modal-background').append('<style>.blur-background:before{background-image: url("'+infoJson["backdrop_path"]+'");}</style>');
                //document.getElementById("modal-background").style.backgroundImage="url('"+infoJson["backdrop_path"]+"')";
            }else  $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
            document.getElementById("vod_title").innerHTML=nameSerie;
            if(infoJson["vote_average"]){
                document.getElementById("vod_star_row").style.display="";
                for(var i=0;i<parseInt(infoJson["vote_average"]/2);i++){
                    let span = document.createElement('span');
                    span.setAttribute("class", "fa fa-star");
                    star.appendChild(span);	 
                }
            }else document.getElementById("vod_star_row").style.display="none";

            if(infoJson["first_air_date"]){
                document.getElementById("vod_year").innerHTML=infoJson["first_air_date"];
                document.getElementById("vod_year").style.display="";
            }else document.getElementById("vod_year").style.display="none";


            if(infoJson["genres"][0]["name"]){
                document.getElementById("vod_genere").innerHTML=infoJson["genres"][0]["name"];
                document.getElementById("vod_genere").style.display="";
            }else document.getElementById("vod_genere").style.display="none";


            if(infoJson["overview"]){
                document.getElementById("vod_description").innerHTML=infoJson["overview"];
                document.getElementById("vod_description").style.display="";
                document.getElementById("descHeading").style.display="";
            }else{ 
                document.getElementById("vod_description").style.display="none";
                document.getElementById("descHeading").style.display="none";
            }
            selectedSeason = -1;
            setSeason(season);

        }catch(e){
            document.getElementById("vod_year").style.display="none";;
            document.getElementById("vod_genere").style.display="none";;
            document.getElementById("vod_description").innerHTML="";
        }
    }else if(serieInfo==null)
        resetEverything(nameSerie);
    document.getElementById("ep-"+episode).click();
   
}


function resetEverything(title){
    document.getElementById("vod_title").innerHTML=title;
    document.getElementById("vod_img").src="";
    document.getElementById("descHeading").style.display="none";
    document.getElementById("vod_year").style.display="none";
    document.getElementById("vod_genere").style.display="none";
    document.getElementById("vod_description").style.display="none";
    document.getElementById("descHeading").style.display="none";
    document.getElementById("modal-background").style.backgroundImage="";
    $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
}

async function downloadChannel(){
    var url = json[selectedGroup][selectedChannel]["Season"][selectedSeason][selectedEpisode]["IP"];
    window.open(url, '_blank');
    addHistory(selectedGroup,selectedChannel,selectedSeason,selectedEpisode);
}


async function playChannel(){
    var url = json[selectedGroup][selectedChannel]["Season"][selectedSeason][selectedEpisode]["IP"];
    play(url);
    var display = document.getElementById("videoPlayer");
    display.style.opacity=0;
    display.style.display="block";
    display.style.paddingRight="4px;";
    await sleep(50);
    display.style.opacity=1;
    addHistory(selectedGroup,selectedChannel,selectedSeason,selectedEpisode);
}


async function populateList(groupIndex, start=0,force=false){
    if(!forceGroup)
        if(selectedGroupIndex==groupIndex && !force)
            return;
    document.querySelector('[idgroup="'+groupIndex+'"]').setAttribute("class","active onloadCallCategory" );
    try {
        document.querySelector('[idgroup="'+selectedGroupIndex+'"]').setAttribute("class","onloadCallCategory" );
        document.querySelector('[idgroup="-1"]').setAttribute("class","onloadCallCategory" );
    } catch (e) {
    }
    document.getElementById("showLeft").click();
    selectedGroupIndex = groupIndex;
    selectedGroup=Object.keys(json)[groupIndex];    
    document.getElementById("SerchResult").setAttribute("class","SerchResult hideOnLoad");
    document.getElementById("group_title").style.display="inline-flex";
    document.getElementById("group_title").innerText=selectedGroup;
    document.getElementById("clear_chrono").style.display="none";
    var listHtml = document.getElementById("MoviesContainer");
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }

    start=parseInt(start);
    if(start==0){
        document.getElementById("loadlessdesk").style.display="none";
    }else{
        document.getElementById("loadlessdesk").style.display="";
    }

    var list = Object.entries(json[selectedGroup]);
    list = list.sort((a, b) => a[1]["id"] - b[1]["id"]);

    if(list.length<=81 || start+81>=list.length){
        var end = list.length;
        document.getElementById("loadmoredesk").style.display="none";
    }
    else {
        var end = start+81;
        var more = document.getElementById("loadmoredesk");
        more.style.display="";
        more.setAttribute("data-start",end);
    }


    try{
        for (start; start < end; start++) { 
            listHtml.appendChild(createChannel(list[start][0],list[start][1]));
            window.dispatchEvent(new Event('resize'));
        }
    }catch(e){
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('myGroupSidebar').scrollTop=0;
    selectedChannel=-1;
    window.dispatchEvent(new Event('resize'));

}

function createChannel(name,item){
    let li = document.createElement('li');
    li.setAttribute("class","thumb-b animate streamList rippler rippler-default");
    li.setAttribute("id_serie",item['id']);
    li.setAttribute("onclick", "openInfo("+selectedGroupIndex+",'"+name.replace(/'/g, '§')+"')");

    let div1 = document.createElement('div');
    //if(item["Image"]=="../images/no-poster.jpg?"+version)
    div1.setAttribute("class", "view view-tenth showEI");
    //else div1.setAttribute("class", "view view-tenth rippler rippler-default");


    let img = document.createElement('img');
    img.setAttribute("class", "iconImage rippler rippler-img rippler-bs-primary" );
    img.setAttribute("src", item["Image"] );
    img.setAttribute("alt", "" );
    img.setAttribute("onload","imageLoaded(this)");
    img.setAttribute("onerror","imageOnError(this,"+selectedGroupIndex+",'"+cleanName(name.replace(/'/g, '\\'))+"')");

    img.setAttribute("style", "width: 185px; height: 278px;" );

    let div2 = document.createElement('div');
    div2.setAttribute("class", "mask " );
    let h2 = document.createElement('h2');
    h2.innerHTML=cleanName(name);
    div2.appendChild(h2);
    div1.appendChild(div2);
    div1.appendChild(img);	        
    li.appendChild(div1);
    return li;
}



function loadMore(){
    var start = document.getElementById("loadmoredesk").getAttribute("data-start");
    populateList(selectedGroupIndex,start,true);
}

function loadLess(){
    var start = document.getElementById("loadmoredesk").getAttribute("data-start")-81;
    if(start<0){
        start=0;
        document.getElementById("loadlessdesk").style.display="none";
    }
    populateList(selectedGroupIndex,start-81,true);
}

$('#loadmoredesk').click(function(){
    loadMore();
});

$('#loadlessdesk').click(function(){
    loadLess();
});

$('#loadmoremobile').click(function(){
    loadMore();
});

$('#loadlessmobile').click(function(){
    loadLess();
});