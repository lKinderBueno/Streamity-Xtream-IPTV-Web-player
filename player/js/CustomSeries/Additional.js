window.onbeforeunload = function() { return "You work will be lost."; };

function videoEnded(){
    closeplayer();
    var next = document.getElementById("ep-" + (selectedEpisode+1));
    if(!next){
        var seasonList=document.getElementById("season_list");
        for(var i=0;i<seasonList.children.length;i++)
            seasonList.children[i].setAttribute("class","onloadCallCategory" );
        document.querySelector('[onclick="setSeason('+(selectedSeason+1)+')"]').setAttribute("class","active onloadCallCategory" );
        setSeason(selectedSeason+1);
        next = document.getElementById("ep-1");
    }
    next.click();
    chrono[0]["S"]=selectedSeason;
    chrono[0]["E"]=selectedEpisode;
    var toSave = "[";
    chrono.forEach(function(item){
        toSave+='{"Group":"'+item["Group"]+'","Name":"'+item["Name"]+'","S":'+item["S"]+',"E":'+item["E"]+'},';
    });
    toSave = toSave.substring(0, toSave.length - 1)+"]";
    window.localStorage.setItem('cseries', toSave);
}

function historypopulate(){
   document.querySelector('[idgroup="-1"]').setAttribute("class","active onloadCallCategory" );
    try {
        document.querySelector('[idgroup="'+selectedGroupIndex+'"]').setAttribute("class","onloadCallCategory" );
    } catch (e) {
    }
    
    document.getElementById("loadlessdesk").style.display="none";
    document.getElementById("loadmoredesk").style.display="none";
    document.getElementById("group_title").innerText="Last watched";
    document.getElementById("clear_chrono").style.display="";
    var listHtml = document.getElementById("MoviesContainer");
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }
    
    
    chrono.forEach(function(item){
        try{
            var channel = json[item["Group"]][item["Name"]];
            selectedGroupIndex = Object.keys(json).indexOf(item["Group"]);
            listHtml.appendChild(createChannel(item["Name"],channel));
            window.dispatchEvent(new Event('resize'));
        }catch(ex){
        }
    });
    selectedGroupIndex = -1;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('myGroupSidebar').scrollTop=0;
    selectedChannel=-1;
}

async function clear_chrono(){
    chrono=[];
    var toSave = "[]";
    window.localStorage.setItem('cseries', toSave);
    populateList(0);
}

function addHistory(group,name,season,episode){
    var toPush = [];
    toPush["Group"]=group;
    toPush["Name"]=name;
    toPush["S"]=season;
    toPush["E"]=episode;
    for(var i=0;i<chrono.length;i++)
        if(chrono[i]["Group"]==group && chrono[i]["Name"]==name){
            chrono.splice(i, 1);
            break;
        }
    if(chrono.length==10)
        chrono.splice(9, 1);
    chrono.unshift(toPush);
    var toSave = "[";
    chrono.forEach(function(item){
        toSave+='{"Group":"'+item["Group"]+'","Name":"'+item["Name"]+'","S":'+item["S"]+',"E":'+item["E"]+'},';
    });
    toSave = toSave.substring(0, toSave.length - 1)+"]";
    window.localStorage.setItem('cseries', toSave);
    forceGroup = true;
}

async function imageLoaded(htmlElement){
    var image = htmlElement.getAttribute("src");
    if(image=="../images/no-poster.jpg?"+version)
            htmlElement.parentElement.className='view view-tenth showEI';
    else {
        htmlElement.parentElement.className='view rippler rippler-default';
        await sleep(20);
        htmlElement.parentElement.className='view view-tenth rippler rippler-default';
    }
}

async function imageOnError(htmlElement,groupIndex,seriesName){
    var group = json[Object.keys(json)[groupIndex]];
    var channel = group[seriesName.replace('§',"'")];
    try{
        var name = htmlElement.parentNode.innerText;
        var image = await imageAlt(channel,name,true);
        htmlElement.setAttribute("src", image);
        channel["Image"]=image;
        if(image=="../images/no-poster.jpg?"+version)
            htmlElement.parentElement.className='view view-tenth showEI';
    }catch(ex){
        channel["Image"]="../images/no-poster.jpg?"+version;
        htmlElement.parentElement.className='view view-tenth showEI';
    }
}

async function getInfoFilmApi(id){
    try{
    var url = urlApi+"player_api.php?username="+userApi+"&password="+passApi+"&action=get_series_info&series_id="+id;
    let result = await getText(path+"player/proxy.php?url="+encodeURIComponent(url),20);
    var json = JSON.parse(result);
    var newArray = [];
    
    var disableNewArray=true;
    
    newArray["backdrop_path"]=json["info"]["backdrop_path"][0];
    newArray["vote_average"]=json["info"]["rating"];
    newArray["first_air_date"]=json["info"]["releaseDate"];
    newArray["genres"]=json["info"]["genre"];
    newArray["overview"]=json["info"]["plot"];
    
    Object.keys(json["episodes"]).forEach(function (item) {
        newArray[item]=[];
        newArray["season/"+item]=[];
        newArray["season/"+item]["episodes"]=[];
        json["episodes"][item].forEach(function (item2) {
            var episode = item2["episode_num"];
            newArray["season/"+item]["episodes"][episode]=[];
            if(item2["info"]["overview"]!="" && item2["info"]["overview"]!=null)
                disableNewArray=false;
            newArray["season/"+item]["episodes"][episode]["overview"]=item2["info"]["overview"];
        });
        
    });
    
    if(disableNewArray)
        return null;
    else return newArray;
    
        
    }catch(ex){
        return null;
    }
}

async function imageAlt(channel,name,error=false){
    if(!error){
        try{
            if(isValidUrl(channel["Image"]))
                return channel["Image"];
        }catch(e){  }
    }
    try{
        if(!tmdbApi)
            return "../images/no-poster.jpg?"+version; ;
        var url = "https://api.themoviedb.org/3/search/tv?api_key="+tmdbApi+"&query="+ name;
        let result = await getText(url);
        var logo = JSON.parse(result);
        if(logo["total_results"]==0)
            var image = "../images/no-poster.jpg?"+version;
        else if(logo["results"][0]["poster_path"])
            var image = "https://image.tmdb.org/t/p/original"+logo["results"][0]["poster_path"];
        else var image = "../images/no-poster.jpg?"+version; 
    }catch(ex){
        var image = "../images/no-poster.jpg?"+version; 
    }
    return image;
}


async function getSeasonInfo(id){
    try{
    var array = [];
    var url = urlApi+"player_api.php?username="+userApi+"&password="+passApi+"&action=get_series_info&series_id="+id;
        let result = await getText(path+"player/proxy.php?url="+encodeURIComponent(url,20));
    var json = JSON.parse(result);
    
    var newArray = [];
    var disableNewArray=true;
    
    newArray["backdrop_path"]=json["info"]["backdrop_path"][0];
    newArray["vote_average"]=json["info"]["rating"];
    newArray["first_air_date"]=json["info"]["releaseDate"];
    newArray["genres"]=json["info"]["genre"];
    newArray["overview"]=json["info"]["plot"];
    
    Object.keys(json["episodes"]).forEach(function (item) {
        array[item]=[];
        newArray["season/"+item]=[];
        newArray["season/"+item]["episodes"]=[];
        json["episodes"][item].forEach(function (item2) {
            var episode = item2["episode_num"];
            newArray["season/"+item]["episodes"][episode]=[];
            var title = item2["title"];
            try{
                var toRemove = title.match("^(.)*(S[0-9]{0,}E[0-9]{0,})(\W{0,})")[0];
                title = title.replace(toRemove,"");
                title = title.replace("-","");
                title = title.trim();
                if(!title)
                    title=null;
            }catch(ex){
            }
            var ip = urlApi+"series/"+userApi+"/"+passApi+"/"+item2["id"]+"."+item2["container_extension"];
            var name = item2["episode_num"];
            array[item][episode]=[];
            array[item][episode]["IP"]=ip;
            array[item][episode]["Title"]=title;
            if(item2["info"]["overview"]!="" && item2["info"]["overview"]!=null)
                disableNewArray=false;
            newArray["season/"+item]["episodes"][episode]["overview"]=item2["info"]["overview"];
        });
        
    });
    
    if(disableNewArray)
        serieInfo=null;
    else serieInfo=newArray;
    
    return array;
    }catch(ex){
        array[0]=[];
        array[0][1]=[];
        array[0][1]["Title"]="No episode avaible."
        return array;
    }
}


async function getInfoFilm(name,season){
    if(!tmdbApi)
        return "";
    try{
        var url = "https://api.themoviedb.org/3/search/tv?api_key="+tmdbApi+"&query="+name;
        let result = await getText(url);
        var json = JSON.parse(result);
        var id = json["results"][0]["id"];
        var language = navigator.language || navigator.userLanguage;
        var episodelist = Object.keys(this.json[selectedGroup][selectedChannel]["Season"]);
        url = "https://api.themoviedb.org/3/tv/"+id+"?api_key="+tmdbApi+"&append_to_response=images";
        if(episodelist.length<20){
            for(var i=0;i<episodelist.length;i++){
                url+=",season/"+episodelist[i];
            }
            url+="&language="+language;
            result = await getText(url);
            var json2 = JSON.parse(result);
        }else{
            for(var i=0;i<19;i++){
                url+=",season/"+episodelist[i];
            }
            url+="&language="+language;
            result = await getText(url);
            var json2 = JSON.parse(result);
            url = "https://api.themoviedb.org/3/tv/"+id+"?api_key=a2764023c82b647eac48485b4deac0bf&append_to_response=images";
            while(i<episodelist.length){
                if(i+19>episodelist.length)
                    var finish = episodelist.length;
                else var finish = i+19;
                for(var start = i;start<finish;start++){
                    url+=",season/"+episodelist[start];
                }
                url+="&language="+language;
                result = await getText(url);
                var json3 = JSON.parse(result);
                url = "https://api.themoviedb.org/3/tv/"+id+"?api_key=a2764023c82b647eac48485b4deac0bf&append_to_response=images";
                for(var start = i;start<finish;start++){
                    if(json3["season/"+(start+1)])
                        json2["season/"+(start+1)]=json3["season/"+(start+1)];
                }
                i+=19;
            }
        }
        json2["backdrop_path"]="https://image.tmdb.org/t/p/original"+json2["backdrop_path"];       
        json2["poster_path"]="https://image.tmdb.org/t/p/original"+json2["poster_path"];
        return json2;
    }catch(ex){
        return ""; 
    }
}

var oldGroupIndex;
function clearSearch(){
    document.getElementById("SerchResult").setAttribute("class","SerchResult hideOnLoad");
    selectedGroupIndex=oldGroupIndex;
    if(selectedGroupIndex==-1)
        selectedGroupIndex=0;
    populateList(selectedGroupIndex,0,true); 
    document.getElementById("group_title").style.display="inline-flex";
}


async function search(){
    oldGroupIndex = selectedGroupIndex;
    var word = document.getElementById("SearchData").value;
    word = word.trim();
    document.getElementById("searchOf").innerHTML=word;
    word = word.toLowerCase();
    document.getElementById("closesearch").click();

    var listHtml = document.getElementById("MoviesContainer");
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }
    try{
        document.querySelector('[idgroup="'+selectedGroupIndex+'"]').setAttribute("class","onloadCallCategory" );
    }catch(ex){}
    document.querySelector('[idgroup="-1"]').setAttribute("class","onloadCallCategory" );
    document.getElementById("loadlessdesk").style.display="none";
    document.getElementById("loadmoredesk").style.display="none";

    var groups = Object.keys(json);
    var toSearch = cleanNameSearch(word);
    for(var i=0;i<groups.length;i++){
        var series = Object.keys(json[groups[i]]);
        selectedGroupIndex=i;
        for(var m=0;m<series.length;m++){
            if(cleanNameSearch(series[m]).includes(toSearch)){
                var dataInfo=json[groups[i]][series[m]];
                listHtml.appendChild(createChannel(series[m],dataInfo));
                window.dispatchEvent(new Event('resize'));
            }
        }
    }
    selectedChannel=-1;
    document.getElementById("SerchResult").setAttribute("class","SerchResult");
    document.getElementById("searchOf").innerHTML=word;
    document.getElementById("clear_chrono").style.display="none";
    document.getElementById("group_title").style.display="none";
    forceGroup = true;
}


async function getText(url,timeout=0) {
    var ret = false;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        if(timeout)
            xhr.timeout = (timeout*1000);
        xhr.responseType = 'text';
        xhr.onerror = function() { resolve("4"); };
         xhr.ontimeout = function() {resolve("4");};
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidUrl(str){
    if(!str)
        return false;
    try{
        return (str.includes("http") && str.includes("://") && str.includes("."));
    }catch(ex){return false;}
}

function cleanName(name){
    name = regexRemove("vod",name);
    name = regexRemove("fhd",name);
    name = regexRemove("hd",name);
    name = regexRemove("360p",name);
    name = regexRemove("4k",name);
    name = regexRemove("h264",name);
    name = regexRemove("h265",name);
    name = regexRemove("24fps",name);
    name = regexRemove("60fps",name);
    name = regexRemove("720p",name);
    name = regexRemove("1080p",name);
    name =  name.replace("vod", "");
    name =  name.replace(".avi", " ");
    name =  name.replace(".mp4", " ");
    name =  name.replace(".mkv", " ");
    name =  name.replace(/_/g, " ");
    name =  name.split('.').join(' ');

    var toRemove = subStringGen(name,"[","]");
    name =  name.replace(toRemove, " ");

    /*toRemove = subStringGen(name,"2","");
    if(toRemove!=name)
        name =  name.replace("2"+toRemove, " ");*/

    toRemove = subStringGen(name,"(",")");
    if(toRemove!=name)
        name =  name.replace(toRemove, " ");

    toRemove = subStringGen(name,"{","}");
    if(toRemove!=name)
        name =  name.replace(toRemove, " ");

    toRemove = subStringGen(name,"-","");
    if(toRemove!=name)
        name =  name.replace(toRemove, " ");

    name =  name.replace("(", " ");
    name =  name.replace(")", " ");
    name = regexRemove("-",name);
    name = regexRemove("_",name);
    name =  name.replace("{", " ");
    name =  name.replace("}", " ");
    name =  name.replace("[", " ");
    name =  name.replace("]", " ");
    name =  name.replace("   ", " ");
    name =  name.replace("  ", " ");
    return name.trim();
}


function regexRemove(your_variable,str){
    var pattern = new RegExp(your_variable, 'gi');
    var str = str.replace(pattern, ' ');
    return str;
}

function subStringGen(word,first,second){
    return word.substring(
        word.lastIndexOf(first) + 1, 
        word.lastIndexOf(second)
    );
}

async function openGroupBar() {
    if(document.getElementById("showLeft").className=="cat-toggle"){
        var elem=document.getElementById("myGroupSidebar");
        elem.style.height = "0";
        elem.style.display="block";
        await sleep(5);
        elem.style.height = "100%";
    }else closeNavGroup();
}

async function closeNavGroup() {
    var elem=document.getElementById("myGroupSidebar");
    elem.style.height="0";
    await sleep(500);
    elem.style.display="none";
}

function cleanNameSearch(name){
    name =  name.toLowerCase();
    name =  name.replace("(", "");
    name =  name.replace(".", "");
    name =  name.replace(",", "");
    name =  name.replace("_", "");
    name =  name.replace("-", "");
    name =  name.replace(")", "");
    name =  name.replace("{", "");
    name =  name.replace("}", "");
    name =  name.replace("[", "");
    name =  name.replace("]", "");
    name =  name.replace("-", "");
    name =  name.replace(" ", "");
    name =  name.replace(/_/g, " ");
    return name;
}