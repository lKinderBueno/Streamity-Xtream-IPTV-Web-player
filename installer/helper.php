<?php

if($_GET['mode']==2){
    include "../config.php";
    $url = "http://{$_SERVER['HTTP_HOST']}/{$path}player/live/epgScraper.php";
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_to_send); 
$mh = curl_multi_init();
curl_multi_add_handle($mh,$ch);
$running = 'idc';
curl_multi_exec($mh,$running); // asynchronous

}


if(file_exists("../config.php") ||file_exists("config.php") ){
    echo "";
    die();
}

function testDatabase($url,$user,$pass,$dB){
    $conn = new mysqli($url, $user, $pass,$dB);
    if ($conn->connect_error) {
        return 0;
    }
    return 1;
}

if($_GET['mode']==1){
    echo testDatabase($_GET['url'],$_GET['user'],$_GET['pass'],$_GET['db']);
}