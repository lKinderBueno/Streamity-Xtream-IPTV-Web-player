<?php
include "../../config.php";
$date = (int)file_get_contents("time");
$dateNow = (int)time();
if ($date > $dateNow)
{
    if (!$user)
    {
        echo "epg already updated";
        return;
    }
}
else
{
    $dateNow += 14400;
    file_put_contents("time", $dateNow);
    $conn = new mysqli($servername, $dbUsername, $dbPassword, $dbName);
    // Check connection
    if ($conn->connect_error)
    {
        die("Connection failed: " . $conn->connect_error);
    }

    $url = $epgUrl;
    if (!$url)
    {
        return "";
    }
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
    $epgFile = file_get_contents($url, false, $context);
    if (!$epgFile)
    {
        return "";
    }
    $xmldata = simplexml_load_string($epgFile);
    if (!$xmldata)
    {
        return "";
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
                $start = $start * 1000;
                $stop = ((int)date(strtotime($programme['stop']))) * 1000;
                $title = (string)$programme->title;
                $descr = (string)$programme->desc;
                $counter = count($epg[$id]);
                if ($counter == 0) $epg[$id] = [];
                $channel["start"] = $start;
                $channel["stop"] = $stop;
                $channel["title"] = $title;
                $channel["descr"] = $descr;
                $channel["id"] = $counter;
                array_push($epg[$id], $channel);
            }

        }
    }
    unset($xmldata);
    if (count($epg) == 0)
    {
        echo "Error: Epg empty.";
        unlink("time");
        die();
    }
    foreach ($epg as $epgId => $id)
    {
        $sql = "INSERT INTO epg_data (epg_id, start,stop,title,descr,id) VALUES ";
        foreach ($id as $data)
        {
            $title = $data['title'];
            $desc = $data['descr'];
            $start = $data["start"];
            $stop = $data["stop"];
            $counter = $data["id"];
            $title = $conn->real_escape_string($title);
            $desc = $conn->real_escape_string($desc);
            $sql .= "('$epgId', $start,$stop,'$title','$desc',$counter),";
        }
        $sql = substr_replace($sql, "", -1);
        $delete = "DELETE FROM epg_data WHERE epg_id='$epgId'";
        $conn->query($delete);
        $conn->query($sql);

    }
    if (!$user) echo "Epg created !!!!";
}

