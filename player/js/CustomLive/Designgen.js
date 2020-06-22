var selectedGroup=-1;
var selectedChannel=-1;
var myIframe;
async function start(){
    if(json["Channel"].lenght==0){
        alert("Can't read list.");
        window.location(path);
    }
    
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
    
    var someDate = new Date();
    var epgDate= document.getElementsByClassName("epgdate");
    epgDate[0].innerHTML="Today";
    epgDate[1].innerHTML="Tomorrow";
    someDate.setDate(someDate.getDate() + 2); 
    for (var i = 2, j = epgDate.length; i < j; i++) {
        var dd = someDate.getDate();
        var mm = someDate.getMonth();
        var someFormattedDate = dd + ' ' + month[mm];
        epgDate[i].innerHTML=someFormattedDate;
        someDate.setDate(someDate.getDate() + 1); 
    }
    document.getElementById("loadlessdesk").style.display="none";
    document.getElementById("loadmoredesk").style.display="none";
    document.getElementById("loadlessmobile").style.display="none";
    document.getElementById("loadmoremobile").style.display="none";
    if(((!epgJson||epgJson.length===0) && shortEpg==0)||shortEpg==1)
        document.getElementById("epg_viewer_btn").style.display="none";
    else myIframe = document.getElementById('iframe_epg');
    populateGroup();
    populateList(0,0,false,true);
    document.getElementById("fullLoader").setAttribute("class","hideOnLoad");
    playChannel(0,0);
   //openGroupBar();
   //document.getElementById("showLeft").click();
}

/*
<li>
            <a onclick="getData(&#39;57&#39;)" data-categoryid="57" data-pcon="0" >
            USA HD          </a>
        </li>
*/

function populateGroup(){
    var listHtml = document.getElementById("listGroup");
    json["Group"].forEach(function (item) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.setAttribute("onclick","populateList("+item['Id']+")");
        a.setAttribute("idgroup",item['Id']);
        //class="active onloadCallCategory" quando selezionato
        a.setAttribute("class","onloadCallCategory");
        a.innerHTML += item['Name'];
        li.appendChild(a);	
        listHtml.appendChild(li);	
    });
}

async function playChannel(channelIndex, group, force=false){
    if(!force && channelIndex==selectedChannel)
        return;
    try {
        document.querySelector('[idchannel="'+channelIndex+'"]').setAttribute("class","streamList Playclick rippler rippler-inverse playingChanel" );
        document.querySelector('[idchannel="'+selectedChannel+'"]').setAttribute("class","streamList Playclick rippler rippler-inverse" );
    } catch (e) {
    }
    document.getElementById("channeltitle").innerHTML="";
    document.getElementById("descrtitle").innerHTML="";
    selectedChannel = channelIndex;
    var channel = json["Channel"].filter(o=> o["Order"]==group);
    var url = urlApi + channel[selectedChannel]["Type"]+"/"+userApi+"/"+passApi+"/"+channel[selectedChannel]["Stream"]+".m3u8";
    try{
        play(url);
        await sleep(3); 
    }catch(e){}
    var logoChannel =document.getElementById("logovideo");
    logoChannel.setAttribute("src",channel[selectedChannel]["Image"]);
    logoChannel.setAttribute("onerror","this.onerror=null;this.src='../images/nologo.png?"+version+"';");
    if(shortEpg==1 && (!epgJson || !epgJson[channel[selectedChannel]["EPG"]])){
        for(var i=1;i<8;i++){
            var epgSec = document.getElementById("TabNo"+i);
            try {
                while (epgSec.firstChild) {
                    epgSec.removeChild(epgSec.lastChild);
                }
            } catch (e) {}
        }
        await sleep(3);
        await epgShortBuilder(channel[selectedChannel]["Stream"],channel[selectedChannel]["EPG"]);
        refreshEpg();
    }else epgBuilder(channelIndex,channel[selectedChannel]);
    if(mobile){
        closeNav();
    }
}


async function populateList(groupIndex, start=0,force=false,loadmore=false){
    if(selectedGroup==groupIndex && !force){
        if(mobile)
            openNav();
        return;
    }
    document.querySelector('[idgroup="'+groupIndex+'"]').setAttribute("class","active onloadCallCategory" );
    try {
        document.querySelector('[idgroup="'+selectedGroup+'"]').setAttribute("class","onloadCallCategory" );
    } catch (e) {
    }
    selectedGroup = groupIndex;
    if(!loadmore)
       document.getElementById("showLeft").click();

    var listHtml = document.getElementById("listChannel");
    listHtml.style.height='auto';
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }

    var list = json["Channel"].filter(o=> o["Order"]==groupIndex);
    start=parseInt(start);
    var downloadEpg = false;
    if(start==0){
        if(shortEpg==2){
            var temp  =new Set();
            list.forEach(y=>temp.add(y["EPG"]));
            downloadEpg=true;
        }
        document.getElementById("loadlessdesk").style.display="none";
        document.getElementById("loadlessmobile").style.display="none";
    }else{
        document.getElementById("loadlessdesk").style.display="block";
        document.getElementById("loadlessmobile").style.display="block";
    }

    if(list.length<=250 || start+250>=list.length){
        var end = list.length;
        document.getElementById("loadmoredesk").style.display="none";
        document.getElementById("loadmoremobile").style.display="none";
    }
    else {
        var end = start+250;
        var more = document.getElementById("loadmoredesk");
        more.style.display="block";
        more.setAttribute("data-start",end);
        document.getElementById("loadmoremobile").style.display="block";
        more.style.display="block";
        more.setAttribute("data-start",end);
    }

    listHtml.setAttribute("start",start);
    listHtml.setAttribute("stop",end);

    try{
        for (start; start < end; start++) {   
            listHtml.appendChild(createChannel(list[start]));
        }
    }catch(e){
    }
    document.querySelector('[class="channel-list desktop"]').scrollTop=0;
    document.getElementById('listChannel').scrollTop=0;
    document.getElementById('myGroupSidebar').scrollTop=0;
    selectedChannel=-1;
    if(mobile)
        openNav();
    if(downloadEpg){
        await sleep(3);
        var urlBase = location.href.substring(0, location.href.lastIndexOf("/")+1)
        var url = urlBase+"getepg.php?json="+encodeURIComponent(JSON.stringify(Array.from(temp)));
        epgJson = JSON.parse(await getText(url));
        refreshEpg();
    }
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

function loadMore(){
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    var start = document.getElementById("loadmoredesk").getAttribute("data-start");
    populateList(selectedGroup,start,true,true);
}

function loadLess(){
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    var start = document.getElementById("loadmoredesk").getAttribute("data-start")-250;
    if(start<0){
        start=0;
        document.getElementById("loadlessdesk").style.display="none";
        document.getElementById("loadlessmobile").style.display="none";
    }
    populateList(selectedGroup,start-250,true,true);

}

function createChannel(item){
    let li = document.createElement('li');
    li.setAttribute("idchannel", item['chNumber']);
    //playingChanel
    li.setAttribute("id", "channel"+item['chNumber']);
    li.setAttribute("class", "streamList Playclick rippler rippler-inverse");
    li.setAttribute("onclick", "playChannel("+item['chNumber']+","+item['Order']+")");

    let span1 = document.createElement('span');
    //span1.setAttribute("style", "font-weight: bold;width: 50px;text-align: center;padding-top: 8px;");
    span1.setAttribute("class", "spanNumero");
    span1.innerHTML = item['chNumber']+1;
    li.appendChild(span1);	

    let span2 = document.createElement('span');
    span2.setAttribute("class", "number");
    let img = document.createElement('img');
    img.setAttribute("src", item['Image']);
    img.setAttribute("onerror", "this.onerror=null;this.src='../images/nologo.png?"+version+"';");
    img.setAttribute("align", "middle");		
    img.setAttribute("class", "spanLogoCanale");


    span2.appendChild(img);
    li.appendChild(span2);

    let label = document.createElement('div');
    label.setAttribute("class", "channeltitle");
    label.innerHTML = item["Name"];

    let label2 = document.createElement('div');
    label2.setAttribute("class","epgontitle");
    var epgtitle = searchEpg(item)
    label2.innerHTML = epgtitle;

    label.appendChild(label2);
    li.appendChild(label);

    let i = document.createElement('i');
    i.setAttribute("class", "fa fa-repeat");
    i.setAttribute("aria-hidden", "true");
    i.setAttribute("style", "float: right;");
    i.setAttribute("onclick", "playChannel("+item['chNumber']+","+item['Order']+",true)");
    li.appendChild(i);

    return li;
}


var mobile=false;
var init = true;
function switchToMobile(x) {
    var element = document.getElementById("menuchannels");
    if(init){
        if(getComputedStyle(element).getPropertyValue('display')!="none"){
            mobile=true; document.getElementById("listChannelMobile").setAttribute("id","listChannel");
            var desk =  document.getElementById("listChannelDesktop")
            desk.setAttribute("id","listDisable");
            desk.style.display="none";
        }else{
            mobile=false; document.getElementById("listChannelMobile").setAttribute("id","listDisable");
            document.getElementById("listChannelDesktop").setAttribute("id","listChannel");
        }
        init=false;
    }else if(mobile==x.matches)
        return;
    else{
        mobile=x.matches;
        var listHtml = document.getElementById("listChannel");
        try{
            while (listHtml.firstChild) {
                listHtml.removeChild(listHtml.lastChild);
            }
        }catch(ex){}
        if(x.matches){
            var newList = document.getElementById("listDisable");
            newList.setAttribute("id","listChannel");
            newList.style.display="";
            listHtml.setAttribute("id","listDisable");
            listHtml.style.display="none";
        }else{
            var newList = document.getElementById("listDisable");
            newList.setAttribute("id","listChannel");
            newList.style.display="";
            listHtml.setAttribute("id","listDisable");
            listHtml.style.display="none";
        }
        populateList(selectedGroup,0,true);
    }
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

async function openNav() {
    console.log("apro");
    var elem=document.getElementById("mySidenav");
    elem.style.width = "0";
    elem.style.display="block";
    await sleep(5);
    elem.style.width = "100%";
}

async function closeNavGroup() {
    var elem=document.getElementById("myGroupSidebar");
    elem.style.height="0";
    await sleep(500);
    elem.style.display="none";
}

async function closeNav() {
    var elem=document.getElementById("mySidenav");
    elem.style.width = "0";
    await sleep(400);
    elem.style.display="none";
}