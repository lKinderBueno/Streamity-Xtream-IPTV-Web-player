<?php include "../../logDir/login/Session.php" ?>

<!DOCTYPE html>
<?php

include "epgParserPlayer.php";
include "m3uParserPlayer.php";

if( isset($_SERVER['HTTPS'] ) ) {
    header("Location: http://{$_SERVER['HTTP_HOST']}/{$path}player/live/");
    die();
}

if($noLive)
    header("Location: http://{$_SERVER['HTTP_HOST']}/{$path}dashboard.php");

if($epgMode!=4){
    $h24 = $_COOKIE["h24"];
    $shift = $_COOKIE["shift"];
    $epgProvider = $_COOKIE['epg'];
    $disableEpg="block";
}else $disableEpg="none";
$result = getChannelsApi($host,$user,$password);
$json=$result;
unset($result);


if(!isset($json) || !$json || $json=="[]" || $json==""|| count($json)==0)
    header("Location: http://{$_SERVER['HTTP_HOST']}/{$path}dashboard.php");

if($epgMode!=4){
    if( (!$epgProvider || $epgProvider=="false") && !$epgDb && $epgMode!=3){
        $shortEpg=0;
	    $epg = $host."xmltv.php?username=".$user."&password=".$password;
	    $epg=getEpg($epg,$result[0],$shift);
    }else if($epgDb){
        $shortEpg = 2;
        include "epgScraper.php";
    }else 
        $shortEpg =1;
}else{
    $shortEpg=0;
}
if($epg==""||!isset($epg))
    $epg="[]";
if(!isset($h24) || $h24==0)
    $h24=24;
$PATH = "http://{$_SERVER['HTTP_HOST']}/{$path}";
?>

<html lang="en">

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/png" href="../../favicon.ico">
        <style type="text/css">
            .swal-icon--error {
                border-color: #f27474;
                -webkit-animation: animateErrorIcon .5s;
                animation: animateErrorIcon .5s
            }

            .swal-icon--error__x-mark {
                position: relative;
                display: block;
                -webkit-animation: animateXMark .5s;
                animation: animateXMark .5s
            }

            .swal-icon--error__line {
                position: absolute;
                height: 5px;
                width: 47px;
                background-color: #f27474;
                display: block;
                top: 37px;
                border-radius: 2px
            }

            .swal-icon--error__line--left {
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                left: 17px
            }

            .swal-icon--error__line--right {
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                right: 16px
            }

            @-webkit-keyframes animateErrorIcon {
                0% {
                    -webkit-transform: rotateX(100deg);
                    transform: rotateX(100deg);
                    opacity: 0
                }
                to {
                    -webkit-transform: rotateX(0deg);
                    transform: rotateX(0deg);
                    opacity: 1
                }
            }

            @keyframes animateErrorIcon {
                0% {
                    -webkit-transform: rotateX(100deg);
                    transform: rotateX(100deg);
                    opacity: 0
                }
                to {
                    -webkit-transform: rotateX(0deg);
                    transform: rotateX(0deg);
                    opacity: 1
                }
            }

            @-webkit-keyframes animateXMark {
                0% {
                    -webkit-transform: scale(.4);
                    transform: scale(.4);
                    margin-top: 26px;
                    opacity: 0
                }
                50% {
                    -webkit-transform: scale(.4);
                    transform: scale(.4);
                    margin-top: 26px;
                    opacity: 0
                }
                80% {
                    -webkit-transform: scale(1.15);
                    transform: scale(1.15);
                    margin-top: -6px
                }
                to {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                    margin-top: 0;
                    opacity: 1
                }
            }

            @keyframes animateXMark {
                0% {
                    -webkit-transform: scale(.4);
                    transform: scale(.4);
                    margin-top: 26px;
                    opacity: 0
                }
                50% {
                    -webkit-transform: scale(.4);
                    transform: scale(.4);
                    margin-top: 26px;
                    opacity: 0
                }
                80% {
                    -webkit-transform: scale(1.15);
                    transform: scale(1.15);
                    margin-top: -6px
                }
                to {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                    margin-top: 0;
                    opacity: 1
                }
            }

            .swal-icon--warning {
                border-color: #f8bb86;
                -webkit-animation: pulseWarning .75s infinite alternate;
                animation: pulseWarning .75s infinite alternate
            }

            .swal-icon--warning__body {
                width: 5px;
                height: 47px;
                top: 10px;
                border-radius: 2px;
                margin-left: -2px
            }

            .swal-icon--warning__body,
            .swal-icon--warning__dot {
                position: absolute;
                left: 50%;
                background-color: #f8bb86
            }

            .swal-icon--warning__dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                margin-left: -4px;
                bottom: -11px
            }

            @-webkit-keyframes pulseWarning {
                0% {
                    border-color: #f8d486
                }
                to {
                    border-color: #f8bb86
                }
            }

            @keyframes pulseWarning {
                0% {
                    border-color: #f8d486
                }
                to {
                    border-color: #f8bb86
                }
            }

            .swal-icon--success {
                border-color: #a5dc86
            }

            .swal-icon--success:after,
            .swal-icon--success:before {
                content: "";
                border-radius: 50%;
                position: absolute;
                width: 60px;
                height: 120px;
                background: #fff;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg)
            }

            .swal-icon--success:before {
                border-radius: 120px 0 0 120px;
                top: -7px;
                left: -33px;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                -webkit-transform-origin: 60px 60px;
                transform-origin: 60px 60px
            }

            .swal-icon--success:after {
                border-radius: 0 120px 120px 0;
                top: -11px;
                left: 30px;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                -webkit-transform-origin: 0 60px;
                transform-origin: 0 60px;
                -webkit-animation: rotatePlaceholder 4.25s ease-in;
                animation: rotatePlaceholder 4.25s ease-in
            }

            .swal-icon--success__ring {
                width: 80px;
                height: 80px;
                border: 4px solid hsla(98, 55%, 69%, .2);
                border-radius: 50%;
                box-sizing: content-box;
                position: absolute;
                left: -4px;
                top: -4px;
                z-index: 2
            }

            .swal-icon--success__hide-corners {
                width: 5px;
                height: 90px;
                background-color: #fff;
                padding: 1px;
                position: absolute;
                left: 28px;
                top: 8px;
                z-index: 1;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg)
            }

            .swal-icon--success__line {
                height: 5px;
                background-color: #a5dc86;
                display: block;
                border-radius: 2px;
                position: absolute;
                z-index: 2
            }

            .swal-icon--success__line--tip {
                width: 25px;
                left: 14px;
                top: 46px;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                -webkit-animation: animateSuccessTip .75s;
                animation: animateSuccessTip .75s
            }

            .swal-icon--success__line--long {
                width: 47px;
                right: 8px;
                top: 38px;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                -webkit-animation: animateSuccessLong .75s;
                animation: animateSuccessLong .75s
            }

            @-webkit-keyframes rotatePlaceholder {
                0% {
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg)
                }
                5% {
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg)
                }
                12% {
                    -webkit-transform: rotate(-405deg);
                    transform: rotate(-405deg)
                }
                to {
                    -webkit-transform: rotate(-405deg);
                    transform: rotate(-405deg)
                }
            }

            @keyframes rotatePlaceholder {
                0% {
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg)
                }
                5% {
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg)
                }
                12% {
                    -webkit-transform: rotate(-405deg);
                    transform: rotate(-405deg)
                }
                to {
                    -webkit-transform: rotate(-405deg);
                    transform: rotate(-405deg)
                }
            }

            @-webkit-keyframes animateSuccessTip {
                0% {
                    width: 0;
                    left: 1px;
                    top: 19px
                }
                54% {
                    width: 0;
                    left: 1px;
                    top: 19px
                }
                70% {
                    width: 50px;
                    left: -8px;
                    top: 37px
                }
                84% {
                    width: 17px;
                    left: 21px;
                    top: 48px
                }
                to {
                    width: 25px;
                    left: 14px;
                    top: 45px
                }
            }

            @keyframes animateSuccessTip {
                0% {
                    width: 0;
                    left: 1px;
                    top: 19px
                }
                54% {
                    width: 0;
                    left: 1px;
                    top: 19px
                }
                70% {
                    width: 50px;
                    left: -8px;
                    top: 37px
                }
                84% {
                    width: 17px;
                    left: 21px;
                    top: 48px
                }
                to {
                    width: 25px;
                    left: 14px;
                    top: 45px
                }
            }

            @-webkit-keyframes animateSuccessLong {
                0% {
                    width: 0;
                    right: 46px;
                    top: 54px
                }
                65% {
                    width: 0;
                    right: 46px;
                    top: 54px
                }
                84% {
                    width: 55px;
                    right: 0;
                    top: 35px
                }
                to {
                    width: 47px;
                    right: 8px;
                    top: 38px
                }
            }

            @keyframes animateSuccessLong {
                0% {
                    width: 0;
                    right: 46px;
                    top: 54px
                }
                65% {
                    width: 0;
                    right: 46px;
                    top: 54px
                }
                84% {
                    width: 55px;
                    right: 0;
                    top: 35px
                }
                to {
                    width: 47px;
                    right: 8px;
                    top: 38px
                }
            }

            .swal-icon--info {
                border-color: #c9dae1
            }

            .swal-icon--info:before {
                width: 5px;
                height: 29px;
                bottom: 17px;
                border-radius: 2px;
                margin-left: -2px
            }

            .swal-icon--info:after,
            .swal-icon--info:before {
                content: "";
                position: absolute;
                left: 50%;
                background-color: #c9dae1
            }

            .swal-icon--info:after {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                margin-left: -3px;
                top: 19px
            }

            .swal-icon {
                width: 80px;
                height: 80px;
                border-width: 4px;
                border-style: solid;
                border-radius: 50%;
                padding: 0;
                position: relative;
                box-sizing: content-box;
                margin: 20px auto
            }

            .swal-icon:first-child {
                margin-top: 32px
            }

            .swal-icon--custom {
                width: auto;
                height: auto;
                max-width: 100%;
                border: none;
                border-radius: 0
            }

            .swal-icon img {
                max-width: 100%;
                max-height: 100%
            }

            .swal-title {
                color: rgba(0, 0, 0, .65);
                font-weight: 600;
                text-transform: none;
                position: relative;
                display: block;
                padding: 13px 16px;
                font-size: 27px;
                line-height: normal;
                text-align: center;
                margin-bottom: 0
            }

            .swal-title:first-child {
                margin-top: 26px
            }

            .swal-title:not(:first-child) {
                padding-bottom: 0
            }

            .swal-title:not(:last-child) {
                margin-bottom: 13px
            }

            .swal-text {
                font-size: 16px;
                position: relative;
                float: none;
                line-height: normal;
                vertical-align: top;
                text-align: left;
                display: inline-block;
                margin: 0;
                padding: 0 10px;
                font-weight: 400;
                color: rgba(0, 0, 0, .64);
                max-width: calc(100% - 20px);
                overflow-wrap: break-word;
                box-sizing: border-box
            }

            .swal-text:first-child {
                margin-top: 45px
            }

            .swal-text:last-child {
                margin-bottom: 45px
            }

            .swal-footer {
                text-align: right;
                padding-top: 13px;
                margin-top: 13px;
                padding: 13px 16px;
                border-radius: inherit;
                border-top-left-radius: 0;
                border-top-right-radius: 0
            }

            .swal-button-container {
                margin: 5px;
                display: inline-block;
                position: relative
            }

            .swal-button {
                background-color: #7cd1f9;
                color: #fff;
                border: none;
                box-shadow: none;
                border-radius: 5px;
                font-weight: 600;
                font-size: 14px;
                padding: 10px 24px;
                margin: 0;
                cursor: pointer
            }

            .swal-button:not([disabled]):hover {
                background-color: #78cbf2
            }

            .swal-button:active {
                background-color: #70bce0
            }

            .swal-button:focus {
                outline: none;
                box-shadow: 0 0 0 1px #fff, 0 0 0 3px rgba(43, 114, 165, .29)
            }

            .swal-button[disabled] {
                opacity: .5;
                cursor: default
            }

            .swal-button::-moz-focus-inner {
                border: 0
            }

            .swal-button--cancel {
                color: #555;
                background-color: #efefef
            }

            .swal-button--cancel:not([disabled]):hover {
                background-color: #e8e8e8
            }

            .swal-button--cancel:active {
                background-color: #d7d7d7
            }

            .swal-button--cancel:focus {
                box-shadow: 0 0 0 1px #fff, 0 0 0 3px rgba(116, 136, 150, .29)
            }

            .swal-button--danger {
                background-color: #e64942
            }

            .swal-button--danger:not([disabled]):hover {
                background-color: #df4740
            }

            .swal-button--danger:active {
                background-color: #cf423b
            }

            .swal-button--danger:focus {
                box-shadow: 0 0 0 1px #fff, 0 0 0 3px rgba(165, 43, 43, .29)
            }

            .swal-content {
                padding: 0 20px;
                margin-top: 20px;
                font-size: medium
            }

            .swal-content:last-child {
                margin-bottom: 20px
            }

            .swal-content__input,
            .swal-content__textarea {
                -webkit-appearance: none;
                background-color: #fff;
                border: none;
                font-size: 14px;
                display: block;
                box-sizing: border-box;
                width: 100%;
                border: 1px solid rgba(0, 0, 0, .14);
                padding: 10px 13px;
                border-radius: 2px;
                transition: border-color .2s
            }

            .swal-content__input:focus,
            .swal-content__textarea:focus {
                outline: none;
                border-color: #6db8ff
            }

            .swal-content__textarea {
                resize: vertical
            }

            .swal-button--loading {
                color: transparent
            }

            .swal-button--loading~.swal-button__loader {
                opacity: 1
            }

            .swal-button__loader {
                position: absolute;
                height: auto;
                width: 43px;
                z-index: 2;
                left: 50%;
                top: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
                text-align: center;
                pointer-events: none;
                opacity: 0
            }

            .swal-button__loader div {
                display: inline-block;
                float: none;
                vertical-align: baseline;
                width: 9px;
                height: 9px;
                padding: 0;
                border: none;
                margin: 2px;
                opacity: .4;
                border-radius: 7px;
                background-color: hsla(0, 0%, 100%, .9);
                transition: background .2s;
                -webkit-animation: swal-loading-anim 1s infinite;
                animation: swal-loading-anim 1s infinite
            }

            .swal-button__loader div:nth-child(3n+2) {
                -webkit-animation-delay: .15s;
                animation-delay: .15s
            }

            .swal-button__loader div:nth-child(3n+3) {
                -webkit-animation-delay: .3s;
                animation-delay: .3s
            }

            @-webkit-keyframes swal-loading-anim {
                0% {
                    opacity: .4
                }
                20% {
                    opacity: .4
                }
                50% {
                    opacity: 1
                }
                to {
                    opacity: .4
                }
            }

            @keyframes swal-loading-anim {
                0% {
                    opacity: .4
                }
                20% {
                    opacity: .4
                }
                50% {
                    opacity: 1
                }
                to {
                    opacity: .4
                }
            }

            .swal-overlay {
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 0;
                overflow-y: auto;
                background-color: rgba(0, 0, 0, .4);
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity .3s
            }

            .swal-overlay:before {
                content: " ";
                display: inline-block;
                vertical-align: middle;
                height: 100%
            }

            .swal-overlay--show-modal {
                opacity: 1;
                pointer-events: auto
            }

            .swal-overlay--show-modal .swal-modal {
                opacity: 1;
                pointer-events: auto;
                box-sizing: border-box;
                -webkit-animation: showSweetAlert .3s;
                animation: showSweetAlert .3s;
                will-change: transform
            }

            .swal-modal {
                width: 478px;
                opacity: 0;
                pointer-events: none;
                background-color: #fff;
                text-align: center;
                border-radius: 5px;
                position: static;
                margin: 20px auto;
                display: inline-block;
                vertical-align: middle;
                -webkit-transform: scale(1);
                transform: scale(1);
                -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
                z-index: 10001;
                transition: opacity .2s, -webkit-transform .3s;
                transition: transform .3s, opacity .2s;
                transition: transform .3s, opacity .2s, -webkit-transform .3s
            }

            @media (max-width:500px) {
                .swal-modal {
                    width: calc(100% - 20px)
                }
            }

            @-webkit-keyframes showSweetAlert {
                0% {
                    -webkit-transform: scale(1);
                    transform: scale(1)
                }
                1% {
                    -webkit-transform: scale(.5);
                    transform: scale(.5)
                }
                45% {
                    -webkit-transform: scale(1.05);
                    transform: scale(1.05)
                }
                80% {
                    -webkit-transform: scale(.95);
                    transform: scale(.95)
                }
                to {
                    -webkit-transform: scale(1);
                    transform: scale(1)
                }
            }

            @keyframes showSweetAlert {
                0% {
                    -webkit-transform: scale(1);
                    transform: scale(1)
                }
                1% {
                    -webkit-transform: scale(.5);
                    transform: scale(.5)
                }
                45% {
                    -webkit-transform: scale(1.05);
                    transform: scale(1.05)
                }
                80% {
                    -webkit-transform: scale(.95);
                    transform: scale(.95)
                }
                to {
                    -webkit-transform: scale(1);
                    transform: scale(1)
                }
            }

            .fa-rotate-right:before, .fa-repeat:before {
                content: "\f01e";
            }
            .fa-rotate-right:hover, .fa-repeat:hover, fa-repeat-checked{
                content: "\f01e";
                color: white;
            }
        </style>
        <link href="https://vjs.zencdn.net/7.6.6/video-js.css" rel="stylesheet" />
        <link href="https://unpkg.com/@videojs/themes@1/dist/fantasy/index.css" rel="stylesheet">
        <style>
            .vjs-tech{
                width: 100% !important;
                height: 100% !important;
            }
        </style>
        <script src="https://vjs.zencdn.net/7.6.6/video.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
        <script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>
        <script src="https://cdn.streamroot.io/videojs-hlsjs-plugin/1/stable/videojs-hlsjs-plugin.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-overlay/1.1.4/videojs-overlay.min.js"></script>
        <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
        <script src="../dist/silvermine-videojs-chromecast.min.js<?php echo "?".$version; ?>"></script>
        <script>
            window.SILVERMINE_VIDEOJS_CHROMECAST_CONFIG = {
                preloadWebComponents: true,
            };
        </script>
        <script src="../dist/silvermine-videojs-chromecast.js<?php echo "?".$version; ?>"></script>
        <script type="text/javascript" src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>

        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title><?php echo $nameIptv; ?> - Live Channels</title>

        <!-- Bootstrap -->
        <style>
            :root {
                --primary-color: #fff;
                --dark-gray: #222;
                --almost-black: #111;
                --semi-white: #ccc;
                --blue: #3498db;
                --red: #e74c3c;

                --standard: 1.25rem;
                --big: 2rem;
                --small: 0.7rem;

                --serif: Georgia, serif;

            }

            @font-face {
                font-family: 'Poppins', 'Arial' ;
                font-weight: 300;
            }

            .PlayerLoader .erroronplayer {
                position: relative;
                top: 150px;
            }
            .addredborder
            {
                border:1px solid red !important;
            }

            .modal-backdrop {
                z-index: 1040 !important;
            }
            .modal-dialog {
                z-index: 1100 !important;
            }

            .in {
                background: rgba(0, 0, 0, 0.37);
            }

            button#UpdateParentPassword {
                position: relative;
                top: 18px;
            }
            .commoncs2, .commoncs2:focus, .commoncs2:active
            {
                background: transparent;
                color: #000 !important;
                padding: 0;
                box-shadow: none;
                outline: none;
                border: 0;
                border-bottom: 1px solid #000;
                border-radius: 0;
            }
            .commoncs2::-webkit-input-placeholder {
                color: #000 !important;
            }
            a.showbtn {
                top: -22px;
                position: relative;
                left: 94%;
            } 

            a.popsbtn {
                top: -32px;
            }
            html {
                font-family: Poppins !important;

            }


        </style>
        <link href="../css/bootstrap.css<?php echo "?".$version; ?>" rel="stylesheet">
        <link href="../css/styleLive.css<?php echo "?".$version; ?>" rel="stylesheet">
        <link href="../css/cssCustom.css<?php echo "?".$version; ?>" rel="stylesheet">
        <link href="../css/owl.carousel.css<?php echo "?".$version; ?>" rel="stylesheet">
        <link href="../css/font-awesome.min.css<?php echo "?".$version; ?>" rel="stylesheet">
        <link href="../css/scrollbar.css<?php echo "?".$version; ?>" rel="stylesheet">

        <script src="../js/jquery-1.11.3.min.js<?php echo "?".$version; ?>"></script> 
        <link rel="stylesheet" type="text/css" href="../css/rippler.css<?php echo "?".$version; ?>">
        <style>
            #cbp-spmenu-s1
            {
                padding-bottom: 80px;
            }
        </style>
        <body>
            <script>
                var json = <?php echo $json; ?>; // Don't forget the extra semicolon!
                var version = <?php echo $version; ?>; // Don't forget the extra semicolon!
                var epgJson = <?php echo $epg; ?>; // Don't forget the extra semicolon!
                var h24 = <?php echo $h24; ?>; // Don't forget the extra semicolon!
                var tmdbApi = <?php echo '"'.$tmdbApi.'"'; ?>; // Don't forget the extra semicolon!
                var shortEpg = <?php echo $shortEpg; ?>; // Don't forget the extra semicolon!
                var userApi = <?php echo '"'.$user.'"'; ?>; // Don't forget the extra semicolon!
                var passApi = <?php echo '"'.$password.'"'; ?>; // Don't forget the extra semicolon!
                var urlApi = <?php echo '"'.$host.'"'; ?>; // Don't forget the extra semicolon!
                var epgShiftDash = <?php echo ((int)$shift)*3600; ?>; // Don't forget the extra semicolon!
                var path = <?php echo '"'.$PATH.'"'; ?>; // Don't forget the extra semicolon!
            </script>

            <div class="body-content">
                <center id="fullLoader" class=""><img src="../images/roundloader.gif"><p class="text-center">LOADING DATA</p></center>
                <div class="overlay"></div>

                <div id="mySidenav" class="channel-list sidenav" style="height:100vh!important; display: none">
                    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
                    <div id="channelsListMobile">
                        <h3>Channels</h3> 
                        <center class="loading-loadBtn" style="display: " >
                            <button class="LoadMoreBtn btn btn-success rippler rippler-default" id="loadlessmobile" data-start="0">Load Previous <i class="LoadingMoreFa fa fa-spin"></i><div class="rippler-effect rippler-div" style="width: 0px; height: 0px; left: 31.8px; top: 9px;" onclick="loadLess()"></div></button>
                        </center>
                        <ul id="listChannelMobile" class="free-wall chanels channels-ul" data-min-width="1520" data-total-col="0" data-total-row="0" data-wall-width="15" data-wall-height="0" style="direction: ltr;
    max-height: 71vh !important;
    height: auto !important;
    overflow-y: auto;
    overflow-x: none;">
                        </ul>
                        <center class="loading-loadBtn" style="display: " >
                            <button class="LoadMoreBtn btn btn-success rippler rippler-default" id="loadmoremobile" data-start="0">Load More <i class="LoadingMoreFa fa fa-spin"></i><div class="rippler-effect rippler-div" style="width: 0px; height: 0px; left: 31.8px; top: 9px;" onclick="loadMore()"></div></button>
                        </center>
                    </div>
                </div>


                <div id="myGroupSidebar" class="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left sidenav" style="display: none">
                    <div id="categoriesList">
                        <h3>Categories</h3>
                        <ul id="listGroup">
                        </ul>
                    </div>
                </div>



                <nav class="navbar navbar-inverse navbar-static-top">
                    <div class="container full-container navb-fixid">

                        <div class="navbar-header">
                            <span id="menuchannels" style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>

                            <div id="showLeft" onclick="openGroupBar()" class="cat-toggle"> <span></span> <span></span> <span></span> <span></span> </div>
                            <button type="button" class="navbar-toggle collapsed pull-right" data-toggle="offcanvas"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                        </div>
                        <a class="brand" href="/"><img class="img-responsive" style="max-height:60px;" src="../../logo.png<?php echo "?".$version; ?>" alt=""></a>
                        <div id="navbar" class="collapse navbar-collapse sidebar-offcanvas">
                            <ul class="nav navbar-nav navbar-left main-icon">

                            </ul>
                            <ul class="nav navbar-nav navbar-right r-icon">
                                <li class="r-li"><a href="<?php echo $PATH; ?>dashboard.php" class="btn2 btn-5">Dashboard</a></li>
                                <li class="r-li" style="<?php if($noLive) echo "display:none;"; ?>"><a href="<?php echo $PATH; ?>player/live/" class="btn2 btn-5">Live tv</a></li>
                                <li class="r-li" style="<?php if($noMovie) echo "display:none;"; ?>"><a href="<?php echo $PATH; ?>player/movie/" class="btn2 btn-5">movies</a></li>
                                <li class="r-li" style="<?php if($noSeries) echo "display:none;"; ?>"><a href="<?php echo $PATH; ?>player/series/" class="btn2 btn-5">TV Series</a></li>
                                 <li class="r-li btn-5">
                                    <a href="#search" >
                                        <i class="fa fa-search"></i>
                                        <span class="r-show"></span>
                                    </a>
                                </li>
                                <li class="r-li" id="epg_viewer_btn">
                                    <a href="javascript:void(0)" onclick="openEpgFrame()" class="btn2 btn-5">
                                        <i class="fa fa-list"></i>
                                        <span class="r-show"></span>EPG
                                    </a>
                                </li>
                                <li class="r-li"><a href="javascript:void(0)" onclick="window.location='<?php echo "http://{$_SERVER['HTTP_HOST']}/{$path}"; ?>/php/logout.php'" class="logoutBtn"><i class="fa fa-sign-out"></i><span class="r-show">Logout</span></a></li>
                            </ul>
                        </div>
                        <!--/.nav-collapse --> 
                    </div>
                </nav>
                <!-- Sorting Model -->
                <style type="text/css">
                    .sorting-container span {
                        font-size: 16px;
                        font-weight: 200;
                        cursor: pointer;
                    }
                </style>
                <div id="epgframe" >
                    <iframe lastgroup="-1" id="iframe_epg" src=""></iframe>
                    <button type="button" onclick="closeEpgFrame()"  class="close">×</button>
                </div>
                
                
                <div id="search" >
                    <button type="button" id="closesearch" class="close">×</button>
                    <input type="search" value="" id="SearchData" placeholder="type keyword(s) here">
                    <button type="submit" id="SearchBtn" onclick="search()" class="btn btn-primary">Search</button>
                </div>
               
                <div class="modal fade" id="confirmparentPopup" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog">

                        <!-- Modal content-->
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">×</button>
                                <h4 class="modal-title">Confirm PIN</h4>
                            </div>
                            <div class="modal-body">
                                <input type="password" id="parentPass" class="form-control commoncs2" placeholder="Enter PIN" value="">
                                <a href="#parentPass" data-currenteye="show" data-faid="fappass" class="showbtn popsbtn"><i class="fa fa-eye-slash" id="fappass" aria-hidden="true"></i></a>
                            </div>
                            <div class="modal-footer">
                                <button type="button" id="confirmpasswordbtn" class="btn btn-primary">Confirm <i class="fa fa-spin fa-spinner hideOnLoad" id="checkingprocess2"></i></button>
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="container-fluid">
                    <!-- Live Channels -->
                    <div class="col-sm-6">
                        <span class="clearSearch hideOnLoad rippler rippler-default" id="clearsearch" onclick="clearSearch()">Clear Search</span>

                        <div class="channel-list desktop" >
                            <div class="chanelLoader" style="display: none;">
                            </div>
                            <center class="loading-loadBtn" id="loadlessdesk">
                                <button class="LoadMoreBtn btn btn-success rippler rippler-default"  data-start="0">Load Previous <i class="LoadingMoreFa fa fa-spin"></i><div class="rippler-effect rippler-div" style="width: 0px; height: 0px; top: 9px; display: none" onclick="loadLess()"></div></button>
                            </center>
                            <ul id="listChannelDesktop" class="free-wall chanels channels-ul" data-min-width="1520" data-total-col="0" data-total-row="0" data-wall-width="15" data-wall-height="0" style="height: 0px;">

                            </ul>
                            <center class="loading-loadBtn" style="display: " >
                                <button class="LoadMoreBtn btn btn-success rippler rippler-default" id="loadmoredesk" data-start="0">Load More <i class="LoadingMoreFa fa fa-spin"></i><div class="rippler-effect rippler-div" style="width: 0px; height: 0px; left: 31.8px; top: 9px; display: none !important;" onclick="loadMore()"></div></button>
                            </center>
                        </div>
                    </div>
                    <!-- /Live Channels -->
                    <!-- Video Player -->
                    <div class="col-sm-6">
                        <div class="video-player1">
                            <video autoplay id="example-video" class="video-js vjs-theme-fantasy custom-videojs" controls>
                            </video>
                            <script>
                                var options = {
                                    html5: {
                                        hlsjsConfig: {
                                            // Put your hls.js config here
                                        }
                                    },
                                    controls: true,
                                    techOrder: [ 'chromecast', 'html5' ], // You may have more Tech, such as Flash or HLS
                                    plugins: {
                                        chromecast: {}
                                    }
                                };

                                // setup beforeinitialize hook
                                videojs.Html5Hlsjs.addHook('beforeinitialize', (videojsPlayer, hlsjsInstance) => {
                                    // here you can interact with hls.js instance and/or video.js playback is initialized
                                });

                                var player = videojs('example-video', options, function() {});

                                var overlay_content = '<div class="overlay_title"><div class="wrapper"><img src="images/nologo.jpg" align="middle" class="logoVideo" id="logovideo"> <div style="padding-left:10px"><h2 id="channeltitle" style="font-size: 22px;" ></h2><h4 id="descrtitle" style="font-size: 17px;"></h4></div></div><div id="progressp" class="progress-bar"><div id="progress_channel" class="progress"></div></div>';
                                player.overlay({
                                    overlays: [{
                                        start: 'useractive',
                                        content: overlay_content,
                                        end: 'userinactive',
                                        align: 'bottom'
                                    }]
                                });
                                function play(url) {
                                    player.pause();
                                    player.src({
                                        src: url,
                                        type: 'application/x-mpegURL'
                                    });
                                    player.load();
                                    player.play();
                                    // here you can interact with hls.js instance and/or video.js playback is initialized
                                }
                            </script>
                        </div>

                        <!-- EPG -->

                        <div class="col-sm-7" style="width: 100%;padding-right: 0px;padding-left: 0px;">
                            <div class="playlist">
                                <div class="liveEPG" style="display: <?php echo $disableEpg; ?>;">
                                    <div class="panel-heading">
                                        <ul class="nav nav-tabs">

                                            <li class="active">
                                                <a href="#TabNo1" class="epgdate" data-toggle="tab"></a>
                                            </li>

                                            <li class="">
                                                <a href="#TabNo2" class="epgdate" data-toggle="tab"></a>
                                            </li>

                                            <li class="">
                                                <a href="#TabNo3" class="epgdate" data-toggle="tab"></a>
                                            </li>
                                            <li><a href="#TabNo4" class="epgdate" data-toggle="tab"></a></li>
                                            <li class="dropdown">
                                                <a href="#" data-toggle="dropdown">More <span class="caret"></span></a>
                                                <ul class="dropdown-menu" role="menu">
                                                    <li><a href="#TabNo5" class="epgdate" data-toggle="tab"></a></li>
                                                    <li><a href="#TabNo6" class="epgdate" data-toggle="tab"></a></li>
                                                    <li><a href="#TabNo7" class="epgdate" data-toggle="tab"></a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="panel-body">
                                        <div class="tab-content">
                                            <div class="tab-pane fade customTab in active" id="TabNo1">
                                            </div>
                                            <div class="tab-pane fade customTab " id="TabNo2">                              
                                            </div>
                                            <div class="tab-pane fade customTab " id="TabNo3">                               
                                            </div>
                                            <div class="tab-pane fade customTab " id="TabNo4">                                
                                            </div>
                                            <div class="tab-pane fade customTab " id="TabNo5">
                                            </div>
                                            <div class="tab-pane fade customTab " id="TabNo6">
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /EPG -->

                    </div>
                </div>
                <!--- Body pattern--->
                <img class="body-bg" src="../bg.png" alt="">
                <!--- Body Background--->
                <!-- Movie MODAL CODE -->
                <div class="modal fade movie-popup" id="movieModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog">

                        <!-- /.modal-content -->
                    </div>
                    <!-- modal-dialog -->
                    <!--  <img class="body-bg" src="images/mainBlurBG.jpg" alt=""> -->
                    <!--- Body Background-->
                </div>

                <!-- jQuery (JavaScript plugins) --> 


                <script src="../js/offcanvas.js<?php echo "?".$version; ?>"></script> 
                <script src="../js/bootstrap.js<?php echo "?".$version; ?>"></script> 
                <script src="../js/classie.js<?php echo "?".$version; ?>"></script> 
                <script src="../js/owl.carousel.min.js<?php echo "?".$version; ?>"></script> 
                <!-- <script src="js/scrollbar.js"></script> --> 
                <script src="../js/plugin.js<?php echo "?".$version; ?>"></script>
                <script src="../js/jquery.infinitescroll.min.js<?php echo "?".$version; ?>"></script> 
                <script src="../js/freewall.js<?php echo "?".$version; ?>"></script> 
                <script type="text/javascript" src="../js/Manualcustom.js<?php echo "?".$version; ?>"></script>
                <script src="../js/sweetalert.min.js<?php echo "?".$version; ?>"></script>
                <!-- <script src='https://content.jwplatform.com/libraries/fgbTqCCh.js'></script> -->
                <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.7.1/less.min.js" ></script> -->
                <script src="../js/jquery.rippler.min.js<?php echo "?".$version; ?>"></script>
                <script type="text/javascript" src="../js/Manualcustom.js<?php echo "?".$version; ?>"></script>
                <script type="text/javascript" src="../js/CustomLive/Designgen.js<?php echo "?".$version; ?>"></script>
                <script type="text/javascript" src="../js/CustomLive/Epggen.js<?php echo "?".$version; ?>"></script>
                <script type="text/javascript" src="../js/CustomLive/Additional.js<?php echo "?".$version; ?>"></script>
                <script>
                    var width = window.matchMedia("(max-width: 870px)")
                    switchToMobile(width) // Call listener function at run time
                    width.addListener(switchToMobile) // Attach listener function 
                    start();
                    setInterval(function() {
                        refreshEpg();
                    }, 60 * 1000); // 60 * 1000 milsec
                </script>



                <script>
                    /*-------- Load more Start  ----------*/
                   $(document).ready(function() {

                        $(document).find(".rippler, li").rippler({
                            effectClass      :  'rippler-effect'
                            ,effectSize      :  0      // Default size (width & height)
                            ,addElement      :  'div'   // e.g. 'svg'(feature)
                            ,duration        :  400
                        });

                        $('#accountModal').click(function(){
                            $('#accountModal1').modal('show');
                        })

                        $('#cbp-spmenu-s1 li a').click(function(){
                            $('#cbp-spmenu-s1 li a').removeClass('active');
                            $(this).addClass('active');

                            classie.toggle( showLeft, 'active' );
                            classie.toggle( menuLeft, 'cbp-spmenu-open' );
                            $('.cat-toggle').toggleClass('open');
                        })

                        $(document).on('click','.showCast',function(){

                            $(this).parent('.i-cast').toggleClass('openCast');

                            if($(this).text() == 'Show Cast')
                            {
                                $(this).text('Hide Cast');
                            }
                            else
                            {
                                $(this).text('Show Cast');
                            }


                        })
                        $('#menuModal').on('hidden.bs.modal', function () {
                            clearInt();
                            $('#player-holder').html('');
                            $('.backToInfo').addClass('hideOnLoad');
                            $(document).find('.PlayerHolder div').html('').addClass('hideOnLoad');
                            clearInt();
                        })

                        $(document).on('click','.backToInfo',function(){
                            if($('#player-holder').hasClass('flowplayer'))
                            {
                                var container = document.getElementById("player-holder");
                                flowplayer(container).shutdown(); 
                            }

                            $('#player-holder').html('');

                            $('#player-holder, .backToInfo').addClass('hideOnLoad');

                            var episID = $(this).data('episid');
                            if(episID)
                            {
                                $('#epis-'+episID+'').removeClass('hideOnLoad');
                            }
                            else
                            {
                                $('.poster-details').removeClass('hideOnLoad');
                            }
                            clearInt();
                        })


                        setInterval(function(){
                            var date = new Date();
                            var hours = date.getHours();
                            var minutes = date.getMinutes();
                            var ampm = hours >= 12 ? 'PM' : 'AM';
                            hours = hours % 12;
                            hours = hours ? hours : 12; // the hour '0' should be '12'
                            minutes = minutes < 10 ? '0'+minutes : minutes;
                            var strTime = hours + ':' + minutes + ' ' + ampm;
                            $('.time').html(strTime);
                        },1000)
                        /*setInterval(function(){
  var hr = date.getHours();
  var mins = date.getMinutes();
    $('.time').html(hr+':'+mins)
  },1000)*/
                        var win = $(window);

                        // Each time the user scrolls
                        /*win.scroll(function() {
  // End of the document reached?
  if ($(document).height() - win.height() == win.scrollTop()) {
    $('#loading').show();

    $.ajax({
      url: 'get-post.php',
      dataType: 'html',
      success: function(html) {
        $('#posts ul').append(html);
        $('#loading').hide();
      }
    });
  }
});*/
                    });
                    /*-------- Load more End ----------*/
                    /*-------- Grids Start ----------*/
                    $(function() {
                        $(".free-wall").each(function() {
                            var wall = new Freewall(this);
                            wall.reset({
                                selector: '.thumb-b',
                                animate: true,
                                cellW: 185,
                                cellH: 278,
                                fixSize: 0,
                                gutterY: 0,
                                gutterX: -15,
                                onResize: function() {
                                    wall.fitWidth();
                                }
                            })
                            wall.fitWidth();
                        });
                        $(window).trigger("resize");
                    });
                    /*-------- Grids End ----------*/



                </script>

                </body></html>