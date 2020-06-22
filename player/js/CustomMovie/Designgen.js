var selectedGroup="";
var selectedGroupIndex=-1;
var selectedChannel=-1;
var chrono = [];
var forceGroup = false;

window.onload = function() {
    if(!json||json.lenght==0){
        alert("Can't read list.");
        window.location = path+"dashboard.php";
    }
    document.getElementById("MoviesContainer").setAttribute("class","free-wall grid effect-3 videoSection");
    populateGroup();
    try{
        chrono = JSON.parse(window.localStorage.getItem('cmovie'));
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
    
    //Populate provider groups
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


async function openInfo(groupIndex, channelIndex){
    selectedChannel = channelIndex;
    if(selectedGroupIndex!=groupIndex){
        selectedGroupIndex = groupIndex;
        groupName=Object.keys(json)[groupIndex];    
        selectedGroup = groupName;
    }
    var channel = json[selectedGroup][channelIndex];
    var star = document.getElementById("vod_star");
    while (star.firstChild) {
        star.removeChild(star.lastChild);
    }
    document.getElementById("vod_url2").setAttribute("href",channel["IP"]);
    
    resetEverything(channel["Name"]);
    document.getElementById("vod_img").src=channel["Image"];
    var display = document.getElementById("menuModal");
    display.style.opacity=0;
    display.style.display="block";
    display.style.paddingRight="4px;";
    await sleep(1);
    display.style.opacity=1;
    
    try{
        if(userApi!=0){
            var infoJson = await getInfoFilmApi(channel["Name"],channel["PlayID"]);
            if(isValidUrl(infoJson["backdrop_path"])){
                $('#modal-background').append('<style>.blur-background:before{background-image: url("'+infoJson["backdrop_path"]+'");}</style>');
            }else  $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
            document.getElementById("vod_title").innerHTML=channel["Name"];
            if(infoJson["vote_average"]){
                document.getElementById("vod_star_row").style.display="";
                for(var i=0;i<parseInt(infoJson["vote_average"]/2);i++){
                    let span = document.createElement('span');
                    span.setAttribute("class", "fa fa-star");
                    star.appendChild(span);	 
                }
            }else document.getElementById("vod_star_row").style.display="none";
            
            if(channel["Image"]=="../images/no-poster.jpg")
                channel["Image"]= infoJson["movie_image"];
            document.getElementById("vod_img").src=channel["Image"];
            
            if(infoJson["release_date"]){
                document.getElementById("vod_year").innerHTML=infoJson["release_date"];
                document.getElementById("vod_year").style.display="";
            }else document.getElementById("vod_year").style.display="none";

            if(infoJson["runtime"]){
                document.getElementById("vod_duration").innerHTML=infoJson["runtime"];
                document.getElementById("vod_duration").style.display="";
            }else document.getElementById("vod_duration").style.display="none";

            if(infoJson["genres"]){
                document.getElementById("vod_genere").innerHTML=infoJson["genres"];
                document.getElementById("vod_genere").style.display="";
            }else document.getElementById("vod_genere").style.display="none";

            if(infoJson["credits"]){
                document.getElementById("vod_cast").innerHTML=infoJson["credits"];
                document.getElementById("vod_cast_row").style.display="";
            }else document.getElementById("vod_cast_row").style.display="none";

            if(infoJson["director"]){
                document.getElementById("vod_director").style.display="";
                document.getElementById("vod_director").innerHTML=infoJson["director"];
            }else document.getElementById("vod_director").style.display="none";

            if(infoJson["overview"]){
                document.getElementById("vod_description").innerHTML=infoJson["overview"];
                document.getElementById("vod_description").style.display="";
            }else document.getElementById("vod_description").style.display="none";
            return;
        }
    }catch(ex){}


    if(isValidUrl(channel["Image"])){
        document.getElementById("vod_img").src=channel["Image"];
        try{
            var infoJson=await getInfoFilm(channel["Name"]);
            if(isValidUrl(infoJson["backdrop_path"])){
                $('#modal-background').append('<style>.blur-background:before{background-image: url("'+infoJson["backdrop_path"]+'");}</style>');
                //document.getElementById("modal-background").style.backgroundImage="url('"+infoJson["backdrop_path"]+"')";
            }else  $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
            document.getElementById("vod_title").innerHTML=channel["Name"];
            if(infoJson["vote_average"]){
                document.getElementById("vod_star_row").style.display="";
                for(var i=0;i<parseInt(infoJson["vote_average"]/2);i++){
                    let span = document.createElement('span');
                    span.setAttribute("class", "fa fa-star");
                    star.appendChild(span);	 
                }
            }else document.getElementById("vod_star_row").style.display="none";

            if(infoJson["release_date"]){
                document.getElementById("vod_year").innerHTML=infoJson["release_date"];
                document.getElementById("vod_year").style.display="";
            }else document.getElementById("vod_year").style.display="none";

            if(infoJson["runtime"]){
                document.getElementById("vod_duration").innerHTML=infoJson["runtime"]+" minutes";
                document.getElementById("vod_duration").style.display="";
            }else document.getElementById("vod_duration").style.display="none";

            if(infoJson["genres"][0]["name"]){
                document.getElementById("vod_genere").innerHTML=infoJson["genres"][0]["name"];
                document.getElementById("vod_genere").style.display="";
            }else document.getElementById("vod_genere").style.display="none";

            if(infoJson["credits"]["cast"][0]["name"]){
                document.getElementById("vod_cast").innerHTML=infoJson["credits"]["cast"][0]["name"];
                document.getElementById("vod_cast_row").style.display="";
            }else document.getElementById("vod_cast_row").style.display="none";

            var director ="";
            if(infoJson["credits"]["crew"]){
                var listDirector =infoJson["credits"]["crew"].filter(o=> o["job"]=="Director");
                if(listDirector.length>1){
                    for(var i=0;i<(listDirector.length-1);i++){
                        director+=(listDirector["credits"]["crew"][i]["name"]+", ");
                    }
                }
                director+=listDirector[listDirector.length-1]["name"];
                document.getElementById("vod_director").style.display="";
                document.getElementById("vod_director").innerHTML=director;
            }else document.getElementById("vod_director").style.display="none";

            if(infoJson["overview"]){
                document.getElementById("vod_description").innerHTML=infoJson["overview"];
                document.getElementById("vod_description").style.display="";
            }else document.getElementById("vod_description").style.display="none";

        }catch(e){
            document.getElementById("vod_year").style.display="none";;
            document.getElementById("vod_duration").style.display="none";;
            document.getElementById("vod_genere").style.display="none";;
            document.getElementById("vod_cast_row").style.display="none";;
            document.getElementById("vod_director").style.display="none";;
            document.getElementById("vod_description").innerHTML="";
            //document.getElementById("vod_play").innerHTML="";
        }
    }else resetEverything(channel["Name"]);

}


function resetEverything(title){
    document.getElementById("vod_title").innerHTML=title;
    document.getElementById("vod_img").src="";
    document.getElementById("vod_year").style.display="none";
    document.getElementById("vod_duration").style.display="none";
    document.getElementById("vod_genere").style.display="none";
    document.getElementById("vod_cast_row").style.display="none";
    document.getElementById("vod_director").style.display="none";
    document.getElementById("vod_description").style.display="none";
    $('#modal-background').append('<style>.blur-background:before{background-image: url();}</style>');
    //document.getElementById("vod_play").style.display="none";;
}

async function downloadChannel(){
    var channel = json[selectedGroup][selectedChannel];
    var url = channel["IP"];
    window.open(url, '_blank');
    addHistory(selectedGroup,url);

}


async function playChannel(){
    var channel = json[selectedGroup][selectedChannel];
    var url = channel["IP"];
    play(url);
    var display = document.getElementById("videoPlayer");
    display.style.opacity=0;
    display.style.display="block";
    display.style.paddingRight="4px;";
    await sleep(50);
    display.style.opacity=1;   
    addHistory(selectedGroup,url);
}


async function populateList(groupIndex, start=0,force=false){
    if(!forceGroup)
        if(selectedGroupIndex==groupIndex && !force)
            return;
    forceGroup = false;
    document.querySelector('[idgroup="'+groupIndex+'"]').setAttribute("class","active onloadCallCategory" );
    try {
        document.querySelector('[idgroup="'+selectedGroupIndex+'"]').setAttribute("class","onloadCallCategory" );
        document.querySelector('[idgroup="-1"]').setAttribute("class","onloadCallCategory" );
    } catch (e) {
    }
    selectedGroupIndex = groupIndex;
    groupName=Object.keys(json)[groupIndex];
    document.getElementById("SerchResult").setAttribute("class","SerchResult hideOnLoad");
    document.getElementById("group_title").style.display="inline-flex";
    document.getElementById("clear_chrono").style.display="none";
    document.getElementById("group_title").innerText=groupName;
    selectedGroup = groupName;
    if(!force)
        document.getElementById("showLeft").click();

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

    var list = json[selectedGroup];

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
            list[start]["Name"]=cleanName(list[start]["Name"]);
            //list[start]["Image"] = await imageAlt(list[start]);
            listHtml.appendChild(createChannel(list[start]));
            window.dispatchEvent(new Event('resize'));
        }
    }catch(e){
    }
    selectedChannel=-1;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.getElementById('myGroupSidebar').scrollTop=0;
    window.dispatchEvent(new Event('resize'));
}

function createChannel(item){
    let li = document.createElement('li');
    li.setAttribute("class","thumb-b animate streamList rippler rippler-default sectionNo226422 un-1");     
    li.setAttribute("idchannel", item['id']);
    li.setAttribute("onclick", "openInfo("+selectedGroupIndex+","+item['id']+")");

    let input1 = document.createElement('input');
    input1.setAttribute("type", "hidden");
    input1.setAttribute("class", "serch_key");
    input1.setAttribute("value",item["Name"] );
    li.appendChild(input1);	

    let input2 = document.createElement('input');
    input2.setAttribute("type", "hidden");
    li.appendChild(input2);	

    let div1 = document.createElement('div');
    //if(item["Image"]=="../images/no-poster.jpg?"+version)
    div1.setAttribute("class", "view view-tenth showEI");
    //else div1.setAttribute("class", "view view-tenth rippler rippler-default");


    let img = document.createElement('img');
    img.setAttribute("class", "iconImage rippler rippler-img rippler-bs-primary" );
    img.setAttribute("src", item["Image"] );
    img.setAttribute("alt", "" );
    img.setAttribute("onload","imageLoaded(this)");
    img.setAttribute("onerror","imageOnError(this,"+selectedGroupIndex+","+item['id']+")");

    //img.setAttribute("onerror", "this.src='../images/no-poster.jpg'" );
    img.setAttribute("style", "width: 185px; height: 278px;" );

    let div2 = document.createElement('div');
    div2.setAttribute("class", "mask " );
    let h2 = document.createElement('h2');
    h2.innerHTML=item['Name'];
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