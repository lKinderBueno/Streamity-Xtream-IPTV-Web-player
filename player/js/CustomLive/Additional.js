function clearSearch(group){
    document.getElementById("clearsearch").setAttribute("class","clearSearch hideOnLoad rippler rippler-default");
    selectedGroup = -1;
    populateList(group,0,true);
}
window.onbeforeunload = function() { return "You work will be lost."; };


function search(){
    try{
        document.querySelector('[idgroup="'+selectedGroup+'"]').setAttribute("class","onloadCallCategory" );
    }catch(ex){}
    if(selectedGroup!=-1)
        document.getElementById("clearsearch").setAttribute("onclick","clearSearch("+selectedGroup+")");
    selectedGroup = -1;
    var word = document.getElementById("SearchData").value.toLowerCase();
    document.getElementById("closesearch").click();
    var listHtml = document.getElementById("listChannel");
    while (listHtml.firstChild) {
        listHtml.removeChild(listHtml.lastChild);
    }
    json["Channel"].filter(o=> o["Name"].toLowerCase().includes(word.toLowerCase())).sort(function(a,b){ return a["Name"] > b["Name"] ? 1 : -1; }).forEach(function (item) {
        let li = document.createElement('li');
        li.setAttribute("idchannel", item['chNumber']);
        //playingChanel
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
        img.setAttribute("onerror", "this.onerror=null;this.src='../images/nologo.jpg?"+version+"';");
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
        i.setAttribute("onclick", "playChannel("+item['chNumber']+",true)");
        li.appendChild(i);

        listHtml.appendChild(li);	
    });
    selectedChannel=-1;
    document.getElementById("clearsearch").setAttribute("class","clearSearch rippler rippler-default");
    document.getElementById("loadlessdesk").style.display="none";
    document.getElementById("loadlessmobile").style.display="none";
    document.getElementById("loadmoredesk").style.display="none";
    document.getElementById("loadmoremobile").style.display="none";
    
    if(mobile)
        openNav();
}

async function epgShortBuilder(streamId,epgId){
    var url = urlApi+"player_api.php?username="+userApi+"&password="+passApi+"&action=get_simple_data_table&stream_id="+streamId;
        let result = await getText(path+"player/proxy.php?url="+encodeURIComponent(url),10);
    var json = JSON.parse(result);
    var counter = 0;
    epgJson[epgId]=[];
    try{
    json["epg_listings"].forEach(function (item) {
        var array = [];
        array["start"]=(parseInt(item["start_timestamp"])+epgShiftDash)*1000;
        array["stop"]=(parseInt(item["stop_timestamp"])+epgShiftDash)*1000;
        array["title"]=b64DecodeUnicode(item["title"]);
        array["descr"]=b64DecodeUnicode(item["description"]);
        array["id"]=counter++;
        epgJson[epgId].push(array);
    });
    }catch(ex){}
}

async function getText(url,timeout=0) {
    var ret = false;
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        if(timeout)
            xhr.timeout = (timeout*1000);
        xhr.responseType = 'text';
        xhr.ontimeout = function() {resolve("4");};
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function percentageFromData(start,stop,date){
    var dater= date.getMinutes()+(date.getHours()*60);
    var starter= start.getMinutes()+(start.getHours()*60);
    if(start.getDate()<date.getDate() || start.getMonth()<date.getMonth())
        var starter= start.getMinutes()+((start.getHours()-24)*60);
    else var starter= start.getMinutes()+(start.getHours()*60);
    if(stop.getDate()>date.getDate() || stop.getMonth()>date.getMonth())
        var stopper= stop.getMinutes()+((stop.getHours()+24)*60);
    else var stopper= stop.getMinutes()+(stop.getHours()*60);
    var durata = stopper-starter;
    var trascorso = stopper-dater;
    
    return 100-((trascorso/durata)*100);
}

async function openEpgFrame(){
    document.getElementById("epgframe").setAttribute("class","open");
    if(document.getElementById("epgframe").getAttribute("lastgroup")!=selectedGroup){
        document.getElementById("epgframe").setAttribute("lastgroup",selectedGroup);
        await sleep(500);
        myIframe.src="epg.php";
    }
}

function closeEpgFrame(){
    document.getElementById("epgframe").setAttribute("class","");
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}