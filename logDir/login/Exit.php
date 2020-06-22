<?php
if (isset($_POST["exit"]))
{
session_start();
session_destroy();
header("location: login.php");
}
?>