<?php
function downloadEpg()
{
    include "config.php";

    if (!$db_name || !$db_username || !$db_password)
    {
        return "Database not configured";
    }

    if (!$epg_url)
    {
        $dns = $_POST["dns"];
        $username = $_POST["username"];
        $password = $_POST["password"];

        if(!$dns ||!$username || !$password)
            return "EPG Xml not configured";
        else $epg_url = "$dns/xmltv.php?username=$username&password=$password";
    }
    if (filter_var($epg_url, FILTER_VALIDATE_URL) === FALSE) {
        die('Not a valid URL');
    }
    

    try
    {
        $db = new PDO("mysql:host=$db_url;dbname=$db_name", $db_username, $db_password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e)
    {
        return "Error: " . $e->getMessage();
        die();
    }
    
    $sql = $db->prepare("SELECT CAST(AVG(stop_timestamp) AS SIGNED) AS stop_timestamp FROM (SELECT UNIX_TIMESTAMP(MAX(stop_timestamp)) AS stop_timestamp FROM `epg_data` GROUP BY id)t");

    $sql->execute();
    
    $row = $sql->fetchAll(PDO::FETCH_ASSOC);
    $avg = (integer)$row[0]["stop_timestamp"];

    if($avg > 0 &&  $avg > strtotime($epg_valid_hours)){
        return "EPG already updated";
    }
    
    $sql = $db->prepare("DELETE FROM `epg_data` WHERE start_timestamp < NOW()-INTERVAL 12 HOUR");

    $sql->execute();


    $options = array(
        'http' => array(
            'timeout' => 20,
            'method' => "GET",
            'header' => "Accept-language: en\r\n" . "Cookie: foo=bar\r\n" . // check function.stream-context-create on php.net
            "User-Agent: Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10\r\n"
            // i.e. An iPad
            
        )
    );
    $context = stream_context_create($options);
    $epgFile = file_get_contents($epg_url, false, $context);

    if (!$epgFile)
    {
        return "Can't download epg url";
    }

    $xmldata = simplexml_load_string($epgFile);
    if (!$xmldata)
    {
        return "Can't read epg xml";
    }

    unset($context);
    unset($epgFile);
    $epg = [];

    $dateUnixNow = strtotime("yesteday");

    foreach ($xmldata->children() as $programme)
    {
        if ($programme->getName() == "programme")
        {
            $id = (string)$programme['channel'];
            $start = (int)date(strtotime($programme['start']));
            if ($start >= $dateUnixNow)
            {
                $stop = (int)date(strtotime($programme['stop']));
                $title = (string)$programme->title;
                $descr = (string)$programme->desc;
                $channel = [];
                $channel["start_timestamp"] = date('Y-m-d H:i:s', $start);
                $channel["stop_timestamp"] = date('Y-m-d H:i:s', $stop);
                $channel["title"] = $title;
                $channel["description"] = $descr;
                $channel["id"] = $id;
                array_push($epg, $channel);

            }
        }
    }

    unset($xmldata);

    $sql = $db->prepare("INSERT IGNORE INTO `epg_data` (id, start_timestamp, stop_timestamp, title, description) VALUES (:id, :start_timestamp, :stop_timestamp, :title, :description)");

    $batch_size = 200;
    for ($i = 0, $c = count($epg);$i < $c;$i += $batch_size)
    {
        $db->beginTransaction();
        try
        {
            for ($k = $i;$k < $c && $k < $i + $batch_size;$k++)
            {
                $programme = $epg[$k];

                $sql->execute([
                    ":id" => $programme["id"], 
                    ":start_timestamp" => $programme["start_timestamp"], 
                    ":stop_timestamp" => $programme["stop_timestamp"], 
                    ":title" => $programme["title"], 
                    ":description" => $programme["description"]
                    ]);
            }
        }
        catch(PDOException $e)
        {
            echo $e;
            $db->rollBack();
            // at this point you would want to implement some sort of error handling
            // or potentially re-throw the exception to be handled at a higher layer
            break;
        }
        $db->commit();
    }

    return "EPG scraping completed. Added " . count($epg) . " items. " . date('Y-m-d H:i:s');

}

function getEpg($epgId, $start, $stop)
{
    include "config.php";

    if (!$db_name || !$db_username || !$db_password)
    {
        return "Database not configured";
    }

    if (!$epgId || !$start || !$stop)
    {
        return [];
    }

    try
    {
        $db = new PDO("mysql:host=$db_url;dbname=$db_name", $db_username, $db_password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e)
    {
        return "Error: " . $e->getMessage();
        die();
    }
    
    
    $sql = $db->prepare("SELECT UNIX_TIMESTAMP(start_timestamp) AS start_timestamp, UNIX_TIMESTAMP(stop_timestamp) AS stop_timestamp, title, description FROM `epg_data` WHERE id = :id AND UNIX_TIMESTAMP(start_timestamp) < :stop AND UNIX_TIMESTAMP(stop_timestamp) >= :start");

    $sql->execute([
        ":id" => $epgId, 
        ":start" => $start, 
        ":stop" => $stop, 
    ]);
    
    $rows = $sql->fetchAll(PDO::FETCH_ASSOC);
    return $rows;

}

/*
echo downloadEpg();
*/

?>
