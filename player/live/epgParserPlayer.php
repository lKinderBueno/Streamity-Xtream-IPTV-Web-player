<?php

function getEpg($url,$shift){
    $shift =(int)$shift;
    $shift=$shift*60*60;
if(!$url){
    return "";
}
$options = array(
  'http'=>array(
    'timeout' => 20,
    'method'=>"GET",
    'header'=>"Accept-language: en\r\n" .
              "Cookie: foo=bar\r\n" .  // check function.stream-context-create on php.net
              "User-Agent: Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10\r\n" // i.e. An iPad 
  )
);
$context = stream_context_create($options);
$epgFile = file_get_contents($url, false, $context);
if(!$epgFile){
    return "";
}
$xmldata = simplexml_load_string($epgFile);
if(!$xmldata){
    return "";
}
unset($context);
unset($epgFile);
$epg=[];

$dateUnixNow = strtotime("yesteday");

foreach($xmldata->children() as $programme) {
    if($programme->getName()=="programme"){
        $id = (string)$programme['channel'];
            $start= (int)date(strtotime($programme['start']));
            if($start>=$dateUnixNow){
                $start = ($start+$shift)*1000;
                $stop= ((int)date(strtotime($programme['stop']))+$shift)*1000;
                $title = (string)$programme->title;
                $descr= (string)$programme->desc;
                $counter = count($epg[$id]);
                if($counter==0)
                    $epg[$id]=[];
		        $channel["start"]=$start;
                $channel["stop"]=$stop;
                $channel["title"]=$title;
                $channel["descr"]=$descr;
                $channel["id"]=$counter;
                array_push($epg[$id], $channel);
            
        }
    }
}
unset($xmldata);

return json_encode($epg);
}

function fetchNewEpg($url){
	file_put_contents("epg.json",getEpg($url,0));
}


function getEpgApi($url,$shift){
    $shift =(int)$shift;
    $shift=$shift*60*60;
    $filename = "epg.json";
	if (file_exists($filename)) {
		if(filemtime($filename) > strtotime("4 hours ago")){
			fetchNewEpg($url);
		}
		if($shift!==0){
		    return file_get_contents($filename);
		}
		$epg= file_get_contents($filename);
		$epg = json_decode($epg,true);
		foreach($epg as $ch){
			for($i=0;$i<count($epg[$ch]);$i++){
				$epg[$ch][$i]["stop"]+=$shift;
				$epg[$ch][$i]["start"]+=$shift;
			}			
		}		
		return json_encode($epg);
	}
	$epg = getEpg($url,0);
	file_put_contents("epg.json",$epg);
	$epg = json_decode($epg,true);
	if($shift!==0){
        foreach($epg as $ch){ 
		    for($i=0;$i<count($epg[$ch]);$i++){
			    $epg[$ch][$i]["stop"]+=$shift;
			    $epg[$ch][$i]["start"]+=$shift;
		    }			
	    }
	}
	return json_encode($epg);
}