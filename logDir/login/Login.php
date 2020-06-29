<?php
session_start();
if($_SESSION["user"] == true){
    header("Location: dashboard.php");
}else session_destroy();

function getQuantity($url, $noLive, $noMovie, $noSeries)
{
    if (!$noLive)
    {
        $text = $url . "&action=get_live_streams";
        $text = file_get_contents($text, false, $context);
        $json = json_decode($text);
        $countLive = count($json);
    }
    if (!$noMovie)
    {
        $text = $url . "&action=get_vod_streams";
        $text = file_get_contents($text, false, $context);
        $json = json_decode($text);
        $countMovie = count($json);
    }
    if (!$noSeries)
    {
        $text = $url . "&action=get_series";
        $text = file_get_contents($text, false, $context);
        $json = json_decode($text);
        $countSeries = count($json);
    }
    setcookie("live", $countLive, time() + 720000, "/");
    setcookie("movie", $countMovie, time() + 720000, "/");
    setcookie("series", $countSeries, time() + 720000, "/");
}

$msg_login = "";
if (isset($_POST["login"]))
{
    $user = addslashes(htmlspecialchars($_POST["user"]));
    $password = addslashes(htmlspecialchars($_POST["password"]));
    if (empty($user) || empty($password))
    {
        return;
    }
    
    if($recaptchaPrivate)
    if (isset($_POST['g-recaptcha-response'])) {
        require(dirname(__FILE__).'/autoload.php');		
        $recaptcha = new \ReCaptcha\ReCaptcha($recaptchaPrivate);
        $resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);
		if (!$resp->isSuccess()) {
			 $msg_login = "Captcha not valid.";
            return;		
		 }	
    }else{
        $msg_login = "Captcha not valid.";
            return;	
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
        $uri = $host . "player_api.php?username=" . $user . "&password=" . $password;
        $info = json_decode(file_get_contents($uri, false, $context) , true);
        if ($info["user_info"]["auth"] == 0)
        {
            $msg_login = "Inserted info not valid.";
            return;
        }
        else if ($info["user_info"]["status"] != "Active")
        {
            $msg_login = "Subscription expired.";
            return;
        }
        setcookie("expdate", $info["user_info"]["exp_date"] * 1000, time() + 720000);
        setcookie("maxconnections", $info["user_info"]["max_connections"], time() + 720000);
        if (((!$_COOKIE['live'] && !$_COOKIE['movie'] && !$_COOKIE['series'])||$_COOKIE['user']!=$user) && $firstLoadCount) 
            getQuantity($uri, $noLive, $noMovie, $noSeries);
        session_start();
        $_SESSION["user"] = true;
        $_SESSION["user"] = $user;
        $_SESSION["pass"] = $password;

        if (!$_COOKIE['shift']) setcookie("shift", 0, time() + 720000);

        if (!$_COOKIE['h24']) setcookie("h24", 24, time() + 720000);

        if (!$epgDb) if (!$_COOKIE['epg']) setcookie("epg", false, time() + 720000);
        
        if($_POST['remember']==1){
            setcookie("remember", true, time() + 720000, "/");
            setcookie("user", $user, time() + 720000, "/");
            setcookie("pass", $password, time() + 720000, "/");
            $params = session_get_cookie_params();
            setcookie(session_name(), $_COOKIE[session_name()], time() + 60*60*24*30, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
        }else setcookie("remember", false, time() + 720000, "/");
        

        header("Location: dashboard.php");

}
?>
