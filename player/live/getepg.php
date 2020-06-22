<?php
include "../../config.php";
$json = json_decode($_GET['json']);
if(!$json)
    return;
$epg = array();
$conn = new mysqli($servername, $dbUsername, $dbPassword,$dbName);
$sql = 'SELECT start,stop,title,descr,id FROM `epg_data` WHERE epg_id="';
foreach($json as $id){
    $result = $conn->query($sql.$id.'"');
    while ( $row = $result->fetch_assoc())  {
        $row["start"]=(int)$row["start"];
        $row["stop"]=(int)$row["stop"];
        $row["id"]=(int)$row["id"];
	    $epg[$id][]=$row;
    }
}
echo json_encode($epg);