window.onbeforeunload = function() { return "You work will be lost."; };

function videoEnded(){
    closeplayer();
    chrono.shift();
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
    var listHtml = document.getElementById("MoviesContainer");
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }
    var groups = Object.keys(json);
    
    chrono.forEach(function(item){
        try{
            var channel = json[item["Group"]].find(element => element["IP"]==item["IP"]);
            selectedGroupIndex = Object.keys(json).indexOf(item["Group"]);
            channel["Name"]=cleanName(channel["Name"]);
            listHtml.appendChild(createChannel(channel));
            window.dispatchEvent(new Event('resize'));
        }catch(ex){
        }
    });
    selectedGroupIndex = -1;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('myGroupSidebar').scrollTop=0;
    selectedChannel=-1;
    forceGroup = true;
}

function addHistory(group,ip){
    var toPush = [];
    toPush["Group"]=group;
    toPush["IP"]=ip;
    for(var i=0;i<chrono.length;i++)
        if(chrono[i]["Group"]==group && chrono[i]["IP"]==ip){
            chrono.splice(i, 1);
            break;
        }
    if(chrono.length==10)
        chrono.splice(9, 1);
    chrono.unshift(toPush);
    var toSave = "[";
    chrono.forEach(function(item){
        toSave+='{"Group":"'+item["Group"]+'","IP":"'+item["IP"]+'"},';
    });
    toSave = toSave.substring(0, toSave.length - 1)+"]";
    window.localStorage.setItem('cmovie', toSave);
}

async function clear_chrono(){
    chrono=[];
    var toSave = "[]";
    window.localStorage.setItem('cmovie', toSave);
    populateList(0);
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

async function imageAlt(channel,error=false){
    if(!error){
        try{
            if(isValidUrl(channel["Image"]))
                return channel["Image"];
        }catch(e){
            return channel["Image"];
        }
    }

    try{
        if(!tmdbApi)
            return "../images/no-poster.jpg?"+version; 
        var url = "https://api.themoviedb.org/3/search/movie?api_key="+tmdbApi+"&query="+ channel["Name"];
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

async function getInfoFilmApi(name,id){
    var url = urlApi+"player_api.php?username="+userApi+"&password="+passApi+"&action=get_vod_info&vod_id="+id;
        let result = await getText(path+"player/proxy.php?url="+encodeURIComponent(url),10);
    var json = JSON.parse(result);
    var array = [];
    array["backdrop_path"]=json["info"]["backdrop_path"][0];
    array["release_date"]=json["info"]["releasedate"];
    array["runtime"]=json["info"]["duration"];
    array["genres"]=json["info"]["genre"];
    array["credits"]=json["info"]["cast"];
    array["director"]=json["info"]["director"];
    array["overview"]=json["info"]["plot"];
    array["vote_average"]=json["info"]["rating"];
    array["movie_image"]=json["info"]["movie_image"];
    if(!array["overview"]&& !array["backdrop_path"] )
        return null;
    return array;
}

async function getInfoFilm(name){
    if(!tmdbApi)
        return "";
    try{
        var url = "https://api.themoviedb.org/3/search/movie?api_key="+tmdbApi+"&query="+name;
        let result = await getText(url);
        var json = JSON.parse(result);
        var id = json["results"][0]["id"];
        var language = navigator.language || navigator.userLanguage;
        url = "https://api.themoviedb.org/3/movie/"+id+"?api_key="+tmdbApi+"&append_to_response=credits&language="+language;
        result = await getText(url);
        json = JSON.parse(result);
        json["backdrop_path"]="https://image.tmdb.org/t/p/original"+json["backdrop_path"];
        return json;
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


function search(){
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

    var list = Object.keys(json);
    for(var i=0;i<list.length;i++){
        selectedGroupIndex=i;
        json[list[i]].filter(o=>  o["Name"].toLowerCase().includes(word)).forEach(function (item) {
            try{
                item["Name"]=cleanName(item["Name"]);
                listHtml.appendChild(createChannel(item));
                window.dispatchEvent(new Event('resize'));

            }catch(e){
            }
        });
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
    }catch(ex){
        return false;
    }
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
    name =  name.replace(/_/g, " ");
    name =  name.replace(".mp4", " ");
    name =  name.replace(".mkv", " ");
    name =  name.split('.').join(' ');

    var toRemove = subStringGen(name,"[","]");
    name =  name.replace(toRemove, " ");

    /*toRemove = subStringGen(name,"2","");
    if(toRemove!=name)
        name =  name.replace("2"+toRemove, " ");
*/
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

async function imageOnError(htmlElement,groupIndex,id){
    try{
        var name = htmlElement.parentNode.innerText;
        var group = json[Object.keys(json)[groupIndex]];
        var image = await imageAlt(group[id],name,true);
        htmlElement.setAttribute("src", image);
        group[id]["Image"]=image;
        if(image=="../images/no-poster.jpg?"+version)
            htmlElement.parentElement.className='view view-tenth showEI';
    }catch(ex){
        group[id]["Image"]="../images/no-poster.jpg?"+version;
        htmlElement.parentElement.className='view view-tenth showEI';
    }
}