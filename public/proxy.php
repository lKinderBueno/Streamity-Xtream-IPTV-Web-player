<?php
//$_POST = json_decode(file_get_contents("php://input"),true);

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