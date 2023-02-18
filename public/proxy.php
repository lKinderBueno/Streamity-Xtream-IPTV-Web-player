<?php
include "config.php";
if($cors == false) return;

//$_POST = json_decode(file_get_contents("php://input"),true);
if (filter_var($_GET['url'], FILTER_VALIDATE_URL) === FALSE) {
    die('Not a valid URL');
}

if(count($_POST)>0){

$options = array(
  'http' => array(
    'method'  => 'POST',
    'content' => json_encode( $_POST ),
    'header'=>  "Content-Type: application/json\r\n" .
                "Accept: application/json\r\n"
    )
);
$context  = stream_context_create( $options );
$result = file_get_contents( $_GET['url'], false, $context );
}else $result = file_get_contents( $_GET['url'] );



echo  $result;


?>