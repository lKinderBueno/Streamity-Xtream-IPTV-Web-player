<?php
include dirname(__FILE__)."/../logDir/login/Session.php";
include dirname(__FILE__)."/../config.php";
$_SESSION["user"]=false;
header("Location: /{$path}login.php");
return;
?>