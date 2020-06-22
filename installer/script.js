async function testDatabase(){
    var url =encodeURIComponent(document.getElementById("epg_db_url").value);
    var dB =encodeURIComponent(document.getElementById("epg_db_name").value);
    var user =encodeURIComponent(document.getElementById("epg_db_user").value);
    var pass =encodeURIComponent(document.getElementById("epg_db_pass").value);
    var uri = location.href.substring(0, location.href.lastIndexOf("/")+1)+"/installer/helper.php?mode=1&url="+url+"&db="+dB+"&user="+user+"&pass="+pass;
    var result = await getText(uri);
    var html = document.getElementById("epg_db_result");
    html.style.visibility="visible";
    if(result==1){
        html.innerText="Connected successfully to database "+dB;
        html.style.color="blue";
    }else{
        html.innerText="Can't connect to the database";
        html.style.color="red";
    }
    
}

async function createEpg(){
    var uri = location.href.substring(0, location.href.lastIndexOf("/")+1)+"player/live/epgScraper.php";
    var win = window.open(uri, '_blank');
     win.focus();
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

window.addEventListener('load', function () {
  var url = location.href.substring(0, location.href.lastIndexOf("/")+1);
  var domain = window.location.hostname;
  url = url.split(domain+"/")[1];
 document.getElementById("path").value=url;
})