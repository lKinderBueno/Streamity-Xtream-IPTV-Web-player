<?php

header('Access-Control-Allow-Origin: *'); 
    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
    
    //$_POST = json_decode(file_get_contents("php://input"),true);

include "epg-api.php";


if($_POST["init"]){
    echo downloadEpg();
    return;
}

$list = (object)array("epg_listings"=>[]);



if(!$_POST["epg_id"] ||  !$_POST["start"] || !$_POST["stop"]){
    echo json_encode($list);
    return;
}

$list->epg_listings = getEpg($_POST["epg_id"], $_POST["start"], $_POST["stop"]);


echo json_encode($list);