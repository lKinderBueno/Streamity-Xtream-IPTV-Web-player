<?php
if(file_exists(dirname(__FILE__)."/../config.php")){
    echo "Already configured. Delete config.php file to reinstall Streamity.tv or delete installer.php";
    die();
}

if (isset($_POST["iptv_url"]) && isset($_POST["iptv_name"])){
   $iptv_url = $_POST["iptv_url"];
   $iptv_name = $_POST["iptv_name"];
   if(!$iptv_url && !$iptv_name)
       $error = "Missing IPTV Name and IPTV host url";
    else if(!$iptv_name)
        $error = "Missing IPTV Name";
    else if(!$iptv_url)
        $error = "Missing IPTV host url";
    else{   
        $check = getimagesize($_FILES["iptv_logo"]["tmp_name"]);
        if($check)
            move_uploaded_file($_FILES["iptv_logo"]["tmp_name"], "logo.png");
        $check = getimagesize($_FILES["iptv_logo_icon"]["tmp_name"]);
        if($check)
            move_uploaded_file($_FILES["iptv_logo_icon"]["tmp_name"], "favicon.ico");
        $fp = fopen('config.php', 'w');
        fwrite($fp, "<?php\n");
        fwrite($fp, 'include dirname(__FILE__)."/version.php";'."\n");
        fwrite($fp, '$nameIptv="'.trim($iptv_name).'";'."\n");
        fwrite($fp, '$path="'.trim($_POST["path"]).'";'."\n");
        
        if(substr($iptv_url, -1)!='/')
            $iptv_url.='/';
        fwrite($fp, '$host="'.trim($iptv_url).'";'."\n");
        
        if($_POST["api_enable"]=="1"){
            fwrite($fp, '$epgDb=true;'."\n");
            $epgUrl = $_POST["epg_url"];
            fwrite($fp, '$epgUrl="'.trim($epgUrl).'";'."\n");
            
            $servername = $_POST["epg_db_url"];
            fwrite($fp, '$servername="'.trim($servername).'";'."\n");
            
            $dbUsername = $_POST["epg_db_user"];
            fwrite($fp, '$dbUsername="'.trim($dbUsername).'";'."\n");
            
            $dbName = $_POST["epg_db_name"];
            fwrite($fp, '$dbName="'.trim($dbName).'";'."\n");

            $dbPassword = $_POST["epg_db_pass"];
            fwrite($fp, '$dbPassword="'.trim($dbPassword).'";'."\n");
            $redirect = $_POST['path']."/finish.php?data=1";
            unlink("player/live/time");
        }else if($_POST["api_enable"]=="2"){
            fwrite($fp, '$epgDb=false;'."\n");
            $redirect = $_POST['path']."/finish.php";
        }else {
            fwrite($fp, '$epgMode='.$_POST["api_enable"].';'."\n");
            $redirect = $_POST['path']."/finish.php";
        }

        $tmdbApi = $_POST["tmdb_api"];
        if(!$tmdbApi || $tmdbApi=='0')
            fwrite($fp, '$tmdbApi="";'."\n");
        else fwrite($fp, '$tmdbApi="'.trim($tmdbApi).'";'."\n");
        
        $recaptchaSite = $_POST["recaptcha_client"];
        $recaptchaPrivate = $_POST["recaptcha_server"];
        if($recaptchaSite && $recaptchaPrivate){
            fwrite($fp, '$recaptchaSite="'.trim($recaptchaSite).'";'."\n");
            fwrite($fp, '$recaptchaPrivate="'.trim($recaptchaPrivate).'";'."\n");
        }else fwrite($fp, '$recaptchaSite="";'."\n");
        
        if(!$_POST["disable_count"])
            fwrite($fp, '$firstLoadCount=true;'."\n");
        else fwrite($fp, '$firstLoadCount=false;'."\n");
        
        if($_POST["disable_live"])
            fwrite($fp, '$noLive=true;'."\n");
        if($_POST["disable_movie"])
            fwrite($fp, '$noMovie=true;'."\n");
        if($_POST["disable_series"])
            fwrite($fp, '$noSeries=true;'."\n");
            
        fclose($fp);
        
        if($_POST['dashboard_home']){
            unlink("index.htm");
            unlink("index.html");
            copy("dashboard.php", "index.php");
        }
        unlink("installer.php");

        header("Location: $redirect");
    }

}