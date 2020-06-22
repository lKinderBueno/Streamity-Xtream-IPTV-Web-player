<?php
function searchForGroup($id, $array) {
    for ($i = 0;$i < count($array);$i++) {
        if ($array[$i]['Id'] === $id) {
            return $array[$i]['Name'];
        }
    }
}



function getChannelsApi($url, $user, $pass) {
    $options = array('http' => array('method' => "GET", 'header' => "Accept-language: en\r\n" . "Cookie: foo=bar\r\n" . // check function.stream-context-create on php.net
    "User-Agent: Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10\r\n"
    // i.e. An iPad
    ));
    $context = stream_context_create($options);
    $uri = $url . "player_api.php?username=" . $user . "&password=" . $pass . "&action=get_series_categories";
    $m3ufile = file_get_contents($uri, false, $context);
    $m3ufile = json_decode($m3ufile);
    $group = array();
    $groupTemp = array();
    foreach ($m3ufile as $ch) {
        $groupTemp["Id"] = (int)$ch->category_id;
        $groupTemp["Name"] = $ch->category_name;
        array_push($group, $groupTemp);
    }
    $uri = $url . "player_api.php?username=" . $user . "&password=" . $pass . "&action=get_series";
    $m3ufile = file_get_contents($uri, false, $context);
    $m3ufile = json_decode($m3ufile);
    setcookie("series", count($m3ufile), time() + 720000,"/");
    $finalList = array();
    /*usort($m3ufile, function ($a, $b) {
        return $a->category_id<=>$b->category_id;
    });*/
    $counter = 0;
    $lastGroup = - 1;
    foreach ($m3ufile as $ch) {
        if ($ch->category_id) {
            $groupTemp = searchForGroup((int)$ch->category_id, $group);
            if (!$finalList[$groupTemp]) {
                $finalList[$groupTemp] = array();
            }
            $count = count($finalList[$groupTemp]);
            $name = $ch->name;
            $finalList[$groupTemp][$name]=array();
            $finalList[$groupTemp][$name]["Image"] = $ch->cover;
            $finalList[$groupTemp][$name]["id"] = $count;
            $finalList[$groupTemp][$name]["PlayID"] = $ch->series_id;
        }
    }
    return json_encode($finalList);
}

?>