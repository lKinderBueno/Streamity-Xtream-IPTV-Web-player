<?php

function searchForId($id, $array) {
    for($i=0;$i<count($array);$i++){
        if ($array[$i]['Id'] === $id) {
           return $i;
       }
    }
   return null;
}


function getChannelsApi($url,$user,$pass){
    $group = array();
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
    $uri = $url."player_api.php?username=".$user."&password=".$pass."&action=get_live_categories";
    $m3ufile = file_get_contents($uri, false, $context);
    $m3ufile = json_decode($m3ufile);
    $groupTemp=[];
    foreach ($m3ufile as $ch) {
       $groupTemp["Id"]=(int)$ch->category_id;
       $groupTemp["Name"]=$ch->category_name;
       $groupTemp["EpgId"]=[];
       array_push($group,$groupTemp);
    }
    $uri = $url."player_api.php?username=".$user."&password=".$pass."&action=get_live_streams";
    $m3ufile = file_get_contents($uri, false, $context);
    $m3ufile = json_decode($m3ufile);
    setcookie("live", count($m3ufile), time() + 720000, "/");
    $channels = [];
    $channel=[];
    
    /*usort($m3ufile, function($a, $b) {
        return $a->category_id <=> $b->category_id;
    });*/

    $saveCounter = [];
    foreach ($m3ufile as $ch) {
        if($ch->category_id){
            $channel["EPG"]=$ch->epg_channel_id;
            $channel["Stream"]= $ch->stream_id;
            $channel["Image"]=$ch->stream_icon;
            $channel["Name"]=$ch->name;
            $channel["Order"]=(int)$ch->category_id;
            $channel["Type"]=$ch->stream_type;
            $channel["Order"]=searchForId($channel["Order"],$group);
            $channel["chNumber"]=$saveCounter[$channel["Order"]]++;;
            
            array_push($channels,$channel);
        }
    }
for($i=0;$i<count($group);$i++){
        $group[$i]['Id'] = $i;
    }

$globalitems =  array (
    'Group' => $group,
    'Channel' => $channels,
    );
  $globalist['Group'] = $group;
  $globalist['Channel'] = $channels;
    return json_encode($globalist);
   
}
    
?>