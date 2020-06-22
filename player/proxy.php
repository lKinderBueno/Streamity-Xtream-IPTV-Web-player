<?php

if(!$_GET['url'] || !isset($_GET['url']) || strpos($_GET['url'], 'http') === false || strpos($_GET['url'], 'player_api.php') === false){
    die();
}
    

    $options = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Accept-language: en\r\n" .
              "Cookie: foo=bar\r\n" .  // check function.stream-context-create on php.net
              "User-Agent: Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10\r\n" // i.e. An iPad 
  )
);
$context = stream_context_create($options);
echo file_get_contents($_GET['url'], false, $context);
?>