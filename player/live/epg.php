<?php
   include "../config.php";


if(!isset($_COOKIE["check"])||$_COOKIE["check"]!=$version){
    header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    setcookie("check", $version, time() + 18144000);
}

?>
<html lang="it" class="js no-touch">

    <head>
        <meta charset="utf-8">
        <title>Epg viewer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&amp;display=swap">
        <link rel="shortcut icon" type="./image/x-icon" href="/favicon.ico">
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8="  crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link href="./assets/style.css<?php echo "?".$version; ?>" rel="stylesheet" />
        <link href="./assets/parasite.css<?php echo "?".$version; ?>" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
    </head>

    <body>
        <center id="fullLoader" style="opacity:1">
            <img src="assets/roundloader.gif<?php echo "?".$version; ?>">
            <p class="text-center">LOADING DATA</p>
        </center>
        <script type="text/javascript" src="./assets/additional.js<?php echo "?".$version; ?>"></script>
        <script>
            ! function(a, b) {
                "use strict";
                var c = b.getElementsByTagName("html")[0],
                    d = function() {},
                    e = function() {};
                b.body.classList ? (d = function(a, b) {
                    a.classList.add(b)
                }, e = function(a, b) {
                    a.classList.remove(b)
                }) : (d = function(a, b) {
                    a.className += " " + b
                }, e = function(a, b) {
                    a.className = a.className.replace(new RegExp("(^|\\b)" + b + "(\\b|$)", "gi"), "")
                }), e(c, "no-js"), d(c, "js"), d(c, ("ontouchstart" in a || navigator.msMaxTouchPoints > 0 ? "" : "no-") + "touch")
            }(window, window.document);
        </script>
         <div class="loadMoreLessBtn loadLess">
            <button id="loadlessEpg" onclick="loadLessEpg(this)" style="display: none;font-size: 14px;padding: 6px 0px;margin-bottom: -24px" class="c-button c-detailPreview__button" data-start="0">Load Less</button>
        </div>
        <gtv-inline-style ng-version="7.2.15"></gtv-inline-style>
        <gtv-root ng-version="7.2.15">
            <main class="l-main">
                <gtv-home class="ng-star-inserted">
                    <div class="tpl-home ng-star-inserted">
                        <gtv-toolbar class="c-toolbar--sticky">
                            <div class="c-toolbar ng-star-inserted">
                                <div class="c-toolbar__content l-wrapper">
                                    <header class="c-toolbar__header ">
                                        <!--h1 class="c-toolbar__platform">Satellite</h1!-->
                                        <h1 class="c-toolbar__page">EPG Viewer</h1>
                                    </header>
                                    <div class="c-toolbar__mobileControls">
                                        <button onclick="displayDesktop()" class="c-toolbar__button c-toolbar__button--day ng-star-inserted">
                                            <div class="c-toolbar__date">
                                                <span class="c-toolbar__day" id="tool_day"></span>
                                                <span class="c-toolbar__month" id="tool_month"></span>
                                            </div>
                                            <gtv-icon-close stylemodifier="c-toolbar__button__close">
                                                <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="icon-close c-toolbar__button__close">
                                                    <g>
                                                        <path d="M20.75,0.734184375 L20.75,0.734184375 C19.602,-0.052503125 18.0222188,0.137121875 17.1074063,1.17237187 L10.5,8.65743437 L3.89259375,1.17237187 C2.97778125,0.137121875 1.398,-0.052503125 0.25,0.734184375 L8.87153125,10.4998719 L0.25,20.2655594 C1.398,21.0522469 2.97778125,20.8626219 3.89259375,19.8273719 L10.5,12.3435906 L17.1074063,19.8273719 C18.0222188,20.8626219 19.602,21.0522469 20.75,20.2655594 L12.1284688,10.4998719 L20.75,0.734184375 Z" fill-rule="nonzero"></path>
                                                    </g>
                                                </svg>
                                            </gtv-icon-close>
                                        </button>

                                        <!--button aria-label="Toggle filters" class="c-toolbar__button c-toolbar__button--filters c-button--icon ng-star-inserted">
<gtv-icon-check>
<svg viewBox="0 0 26 18" xmlns="http://www.w3.org/2000/svg" class="icon-check">
<g fill-rule="evenodd" stroke-width="1" transform="translate(0.5,0.5)">
<path d="M8.05255,16.5 C7.696425,16.5 7.360925,16.3625 7.107925,16.113625 L0.34155,9.9275 C-0.116325,9.475125 -0.116325,8.710625 0.359425,8.24175 C0.590425,8.0135 0.89705,7.888375 1.222925,7.888375 C1.550175,7.888375 1.8568,8.0135 2.0878,8.24175 L8.0553,13.59875 L22.642675,0.372625 C22.8943,0.125125 23.200925,0 23.5268,0 C23.852675,0 24.160675,0.125125 24.391675,0.352 C24.622675,0.58025 24.75055,0.88275 24.75055,1.2045 C24.75055,1.52625 24.622675,1.82875 24.391675,2.057 L9.01505,16.097125 C8.74555,16.3625 8.41005,16.5 8.05255,16.5"></path>
</g>
</svg>
</gtv-icon-check>
<gtv-icon-filter>
<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" class="icon-filter">
<g>
<path d="M44.4333803,5.70294822 L29.7881657,5.70294822 C29.210254,2.40543427 26.3465373,-4.34805442e-05 22.9987649,-4.34805442e-05 C19.6509924,-4.34805442e-05 16.7872757,2.40543427 16.209364,5.70294822 L1.56702379,5.70294822 C0.695129574,5.75448187 0.0144510553,6.47658008 0.0144510553,7.34999592 C0.0144510553,8.22341176 0.695129574,8.94550997 1.56702379,8.99704362 L16.209364,8.99704362 C16.7872757,12.2945576 19.6509924,14.7000353 22.9987649,14.7000353 C26.3465373,14.7000353 29.210254,12.2945576 29.7881657,8.99704362 L44.4333803,8.99704362 C45.3052746,8.94550997 45.9859531,8.22341176 45.9859531,7.34999592 C45.9859531,6.47658008 45.3052746,5.75448187 44.4333803,5.70294822 Z M23.013137,11.4086894 C21.3691771,11.5044156 19.8299161,10.5987238 19.1151976,9.11516553 C18.4004791,7.63160731 18.651563,5.86339948 19.7510288,4.63745385 C20.8504945,3.41150822 22.5810389,2.97012595 24.1333636,3.5197218 C25.6856883,4.06931765 26.7529852,5.50126714 26.8361273,7.14591148 C26.8361273,7.21202334 26.8131319,7.2781352 26.8131319,7.34712149 C26.8131319,7.41898221 26.8361273,7.48221964 26.8361273,7.55120594 C26.7969959,9.65188333 25.1133782,11.3506915 23.013137,11.4086894 L23.013137,11.4086894 Z M44.4333803,36.9911056 L41.1881502,36.9911056 C40.6102386,33.6935917 37.7465219,31.2881139 34.3987494,31.2881139 C31.050977,31.2881139 28.1872603,33.6935917 27.6093486,36.9911056 L1.56702379,36.9911056 C0.683348551,37.0280136 -0.0140469209,37.7551449 -0.0140469209,38.6395905 C-0.0140469209,39.5240362 0.683348551,40.2511674 1.56702379,40.2880754 L27.6093486,40.2880754 C28.1796358,43.5857733 31.0406058,45.9944473 34.3872517,45.9944473 C37.7338976,45.9944473 40.5948676,43.5857733 41.1651548,40.2880754 L44.4333803,40.2880754 C45.3052746,40.2365418 45.9859531,39.5144436 45.9859531,38.6410277 C45.9859531,37.7676119 45.3052746,37.0455137 44.4333803,36.99398 L44.4333803,36.9911056 Z M34.3872517,42.6997212 C32.7260301,42.7879583 31.1787371,41.8549525 30.4814727,40.3445667 C29.7842084,38.8341808 30.0777498,37.0513603 31.2224492,35.8442538 C32.3671487,34.6371473 34.1318925,34.2494684 35.6771317,34.8656493 C37.2223709,35.4818301 38.2361231,36.9774644 38.2361119,38.6410277 C38.2936005,40.8255936 36.5689432,42.6422326 34.3872517,42.6997212 L34.3872517,42.6997212 Z M44.4333803,21.3484641 L18.4140509,21.3484641 C17.8361392,18.0509502 14.9724225,15.6454724 11.6246501,15.6454724 C8.2768777,15.6454724 5.41316101,18.0509502 4.83524932,21.3484641 L1.56702379,21.3484641 C0.695129574,21.3999978 0.0144510553,22.122096 0.0144510553,22.9955118 C0.0144510553,23.8689277 0.695129574,24.5910259 1.56702379,24.6425595 L4.83524932,24.6425595 C5.41316101,27.9400735 8.2768777,30.3455512 11.6246501,30.3455512 C14.9724225,30.3455512 17.8361392,27.9400735 18.4140509,24.6425595 L44.4333803,24.6425595 C45.3052746,24.5910259 45.9859531,23.8689277 45.9859531,22.9955118 C45.9859531,22.122096 45.3052746,21.3999978 44.4333803,21.3484641 Z M11.6131524,27.0542053 C9.95174561,27.1436322 8.40360555,26.2114334 7.70542051,24.7011992 C7.00723546,23.190965 7.30001246,21.4077057 8.44443247,20.1999919 C9.58885247,18.9922781 11.3537858,18.6040225 12.8993824,19.2199779 C14.4449789,19.8359333 15.4590865,21.3317 15.4591381,22.9955118 C15.5059612,25.1737465 13.790753,26.9838168 11.6131524,27.0542053 L11.6131524,27.0542053 Z"></path>
</g>
</svg>
</gtv-icon-filter>
Filtri
</button!-->

                                        <button aria-label="Toggle search" onclick="displayDesktop()" class="c-toolbar__button ng-star-inserted">
                                            <gtv-icon-close stylemodifier="c-toolbar__icon c-toolbar__icon__close">
                                                <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" class="icon-close c-toolbar__icon c-toolbar__icon__close">
                                                    <g>
                                                        <path d="M20.75,0.734184375 L20.75,0.734184375 C19.602,-0.052503125 18.0222188,0.137121875 17.1074063,1.17237187 L10.5,8.65743437 L3.89259375,1.17237187 C2.97778125,0.137121875 1.398,-0.052503125 0.25,0.734184375 L8.87153125,10.4998719 L0.25,20.2655594 C1.398,21.0522469 2.97778125,20.8626219 3.89259375,19.8273719 L10.5,12.3435906 L17.1074063,19.8273719 C18.0222188,20.8626219 19.602,21.0522469 20.75,20.2655594 L12.1284688,10.4998719 L20.75,0.734184375 Z" fill-rule="nonzero"></path>
                                                    </g>
                                                </svg>
                                            </gtv-icon-close>
                                            <gtv-icon-search stylemodifier="c-toolbar__icon c-toolbar__icon__search">
                                                <svg viewBox="0 0 47 47" xmlns="http://www.w3.org/2000/svg" class="icon-search c-toolbar__icon c-toolbar__icon__search">
                                                    <g>
                                                        <path d="M41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L34.0148409,36.7133739 C30.4327828,39.6823514 25.910282,41.3528013 21.1264006,41.3528013 C9.95566802,41.3528013 0.9,32.2971333 0.9,21.1264006 C0.9,9.95566802 9.95566802,0.9 21.1264006,0.9 C32.2971333,0.9 41.3528013,9.95566802 41.3528013,21.1264006 C41.3528013,25.9096749 39.6827622,30.4322294 36.7146939,34.0161609 L41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L41.1643128,38.4657798 Z M32.7273407,32.728933 L32.9496072,32.506404 C35.8724226,29.4713185 37.5364993,25.4329014 37.5364993,21.1264006 C37.5364993,12.0633534 30.1894479,4.71630201 21.1264006,4.71630201 C12.0633534,4.71630201 4.71630201,12.0633534 4.71630201,21.1264006 C4.71630201,30.1894479 12.0633534,37.5364993 21.1264006,37.5364993 C25.5402106,37.5364993 29.6713735,35.7885088 32.7273407,32.728933 Z" fill-rule="nonzero"></path>
                                                    </g>
                                                </svg>
                                            </gtv-icon-search>
                                        </button>
                                    </div>
                                    <div id="desktop_day" class="c-toolbar__desktopControls">
                                        <div class="c-toolbar__left">

                                            <gtv-week-schedule class="ng-star-inserted">
                                                <div class="c-weekSchedule c-weekSchedule--timeslot">
                                                    <ul class="c-weekSchedule__list">

                                                        <li class="c-weekSchedule__item is-active c-weekSchedule__timeslot ng-star-inserted" onclick="setDay(this,0)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel">TODAY</span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,1)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel">TOMORROW</span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,2)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel" id="2days"></span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,3)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel" id="3days"></span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,4)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel" id="4days"></span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,5)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel" id="5days"></span>
                                                            </a>
                                                        </li>
                                                        <li class="c-weekSchedule__item ng-star-inserted" onclick="setDay(this,6)">
                                                            <a class="c-weekSchedule__time c-weekSchedule__time--single" href="javascript:void(0)">
                                                                <span class="c-weekSchedule__dayLabel" id="6days"></span>
                                                            </a>
                                                        </li>
                                                    </ul>

                                                </div>
                                            </gtv-week-schedule>

                                        </div>
                                        <div class="c-toolbar__right"  style="display: inline-flex;">

                                            <!--button aria-label="Toggle filters" class="c-toolbar__button c-toolbar__button--filters c-button--icon ng-star-inserted">
<gtv-icon-check>
<svg viewBox="0 0 26 18" xmlns="http://www.w3.org/2000/svg" class="icon-check">
<g fill-rule="evenodd" stroke-width="1" transform="translate(0.5,0.5)">
<path d="M8.05255,16.5 C7.696425,16.5 7.360925,16.3625 7.107925,16.113625 L0.34155,9.9275 C-0.116325,9.475125 -0.116325,8.710625 0.359425,8.24175 C0.590425,8.0135 0.89705,7.888375 1.222925,7.888375 C1.550175,7.888375 1.8568,8.0135 2.0878,8.24175 L8.0553,13.59875 L22.642675,0.372625 C22.8943,0.125125 23.200925,0 23.5268,0 C23.852675,0 24.160675,0.125125 24.391675,0.352 C24.622675,0.58025 24.75055,0.88275 24.75055,1.2045 C24.75055,1.52625 24.622675,1.82875 24.391675,2.057 L9.01505,16.097125 C8.74555,16.3625 8.41005,16.5 8.05255,16.5"></path>
</g>
</svg>
</gtv-icon-check>
<gtv-icon-filter>
<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" class="icon-filter"></svg>
</gtv-icon-filter>
Filtri
</button!-->
                                            <div class="" style="height: 13px;">
                                                <div>
                                                    <div class="c-search">
                                                        <gtv-icon-search stylemodifier="c-search__lens">
                                                            <svg viewBox="0 0 47 47" xmlns="http://www.w3.org/2000/svg" class="icon-search c-search__lens">
                                                                <g>
                                                                    <path d="M41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L34.0148409,36.7133739 C30.4327828,39.6823514 25.910282,41.3528013 21.1264006,41.3528013 C9.95566802,41.3528013 0.9,32.2971333 0.9,21.1264006 C0.9,9.95566802 9.95566802,0.9 21.1264006,0.9 C32.2971333,0.9 41.3528013,9.95566802 41.3528013,21.1264006 C41.3528013,25.9096749 39.6827622,30.4322294 36.7146939,34.0161609 L41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L41.1643128,38.4657798 Z M32.7273407,32.728933 L32.9496072,32.506404 C35.8724226,29.4713185 37.5364993,25.4329014 37.5364993,21.1264006 C37.5364993,12.0633534 30.1894479,4.71630201 21.1264006,4.71630201 C12.0633534,4.71630201 4.71630201,12.0633534 4.71630201,21.1264006 C4.71630201,30.1894479 12.0633534,37.5364993 21.1264006,37.5364993 C25.5402106,37.5364993 29.6713735,35.7885088 32.7273407,32.728933 Z" fill-rule="nonzero"></path>
                                                                </g>
                                                            </svg>
                                                        </gtv-icon-search>
                                                        <ng-autocomplete class="ng-autocomplete">
                                                            <div class="autocomplete-container">
                                                                <div class="input-container">
                                                                    <input type="text" id="input_search" placeholder="Search events" class="ng-pristine ng-valid ng-touched">
                                                                    <!---->
                                                                    <!---->
                                                                </div>
                                                                <div class="suggestions-container is-hidden">
                                                                    <ul>
                                                                        <!---->
                                                                    </ul>
                                                                </div>
                                                                <div class="suggestions-container is-visible">
                                                                    <!---->
                                                                    <ul>
                                                                        <!---->
                                                                    </ul>
                                                                </div>
                                                                <!---->
                                                            </div>
                                                            <!---->
                                                        </ng-autocomplete>
                                                    </div>
                                                    <!---->
                                                    <!---->
                                                </div>
                                            </div>

                                            <button data-brackets-id="250" aria-label="Toggle search" class="c-toolbar__button ng-star-inserted" onclick="search(1)">
                                                <gtv-icon-search data-brackets-id="251" stylemodifier="c-toolbar__icon">
                                                    <svg data-brackets-id="252" viewBox="0 0 47 47" xmlns="http://www.w3.org/2000/svg" class="icon-search c-toolbar__icon">
                                                        <g data-brackets-id="253">
                                                            <path data-brackets-id="254" d="M41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L34.0148409,36.7133739 C30.4327828,39.6823514 25.910282,41.3528013 21.1264006,41.3528013 C9.95566802,41.3528013 0.9,32.2971333 0.9,21.1264006 C0.9,9.95566802 9.95566802,0.9 21.1264006,0.9 C32.2971333,0.9 41.3528013,9.95566802 41.3528013,21.1264006 C41.3528013,25.9096749 39.6827622,30.4322294 36.7146939,34.0161609 L41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L41.1643128,38.4657798 Z M32.7273407,32.728933 L32.9496072,32.506404 C35.8724226,29.4713185 37.5364993,25.4329014 37.5364993,21.1264006 C37.5364993,12.0633534 30.1894479,4.71630201 21.1264006,4.71630201 C12.0633534,4.71630201 4.71630201,12.0633534 4.71630201,21.1264006 C4.71630201,30.1894479 12.0633534,37.5364993 21.1264006,37.5364993 C25.5402106,37.5364993 29.6713735,35.7885088 32.7273407,32.728933 Z" fill-rule="nonzero"></path>
                                                        </g>
                                                    </svg>
                                                </gtv-icon-search>
                                            </button>
                                            <button onclick="search(0)" class="c-toolbar__button ng-star-inserted">Clear</button>
                                            <button onclick="openSettings()" class="c-toolbar__button ng-star-inserted">
                                                <div class="fa fa-cog"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="c-toolbar__search l-wrapper">
                                    <gtv-search>
                                        <div class="c-search">
                                            <gtv-icon-search stylemodifier="c-search__lens">
                                                <svg viewBox="0 0 47 47" xmlns="http://www.w3.org/2000/svg" class="icon-search c-search__lens">
                                                    <g>
                                                        <path d="M41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L34.0148409,36.7133739 C30.4327828,39.6823514 25.910282,41.3528013 21.1264006,41.3528013 C9.95566802,41.3528013 0.9,32.2971333 0.9,21.1264006 C0.9,9.95566802 9.95566802,0.9 21.1264006,0.9 C32.2971333,0.9 41.3528013,9.95566802 41.3528013,21.1264006 C41.3528013,25.9096749 39.6827622,30.4322294 36.7146939,34.0161609 L41.1643128,38.4657798 L46.9,44.201467 L44.201467,46.9 L38.4657798,41.1643128 L41.1643128,38.4657798 Z M32.7273407,32.728933 L32.9496072,32.506404 C35.8724226,29.4713185 37.5364993,25.4329014 37.5364993,21.1264006 C37.5364993,12.0633534 30.1894479,4.71630201 21.1264006,4.71630201 C12.0633534,4.71630201 4.71630201,12.0633534 4.71630201,21.1264006 C4.71630201,30.1894479 12.0633534,37.5364993 21.1264006,37.5364993 C25.5402106,37.5364993 29.6713735,35.7885088 32.7273407,32.728933 Z" fill-rule="nonzero"></path>
                                                    </g>
                                                </svg>
                                            </gtv-icon-search>
                                            <ng-autocomplete class="ng-autocomplete">
                                                <div class="autocomplete-container">
                                                    <div class="input-container">
                                                        <input type="text" placeholder="Search event" class="ng-untouched ng-pristine ng-valid">


                                                    </div>
                                                    <div class="suggestions-container is-hidden">
                                                        <ul>

                                                        </ul>
                                                    </div>
                                                    <div class="suggestions-container is-visible">

                                                        <ul>

                                                        </ul>
                                                    </div>

                                                </div>

                                            </ng-autocomplete>
                                        </div>


                                    </gtv-search>
                                </div>

                            </div>
                        </gtv-toolbar>


                        <gtv-home-grid class="ng-star-inserted">
                            <div class="container">
                                <gtv-tv-schedule class="c-tv-schedule">
                                    <gtv-tv-schedule-virtual-scroller id="scroll_width" class="c-tv-schedule__events" _nghost-serverapp-c48="">
                                        <div _ngcontent-serverapp-c48="" class="cdk-virtual-scroll-content-wrapper" style="transform: translateY(0px);" id="channel_container">

                                        </div>
                                        <gtv-timeline class="c-timeline c-tv-schedule__timeline" style="width: 7620px;">
                                            <div class="c-timeline__indicator">

                                                <gtv-timeline-indicator class="c-timeline-indicator ng-star-inserted" id="timer_now" style="left: 0px;">
                                                    <button class="c-timeline-indicator__time" style="width: 100px;">
                                                        <time id="timer_now_clock"></time>
                                                    </button>
                                                    <div class="c-timeline-indicator__line"></div>
                                                </gtv-timeline-indicator>
                                            </div>
                                            <div id="test" class="c-timeline__arrow-wrapper c-timeline__arrow-wrapper--prev">
                                                <div class="c-timeline__arrow-layout" onclick="moveBar(0)">
                                                    <button class="c-timeline__arrow">
                                                        <div class="c-timeline__arrow-icon">
                                                            <svg viewBox="0 0 13 8" xmlns="http://www.w3.org/2000/svg" class="icon-chevron">
                                                                <path d="M6.5 7.5a.856.856 0 0 0 .6-.25l5.168-5.348a.827.827 0 0 0-1.19-1.15L6.501 5.491 1.923.752a.841.841 0 0 0-1.17-.02.824.824 0 0 0-.02 1.17L5.902 7.25c.158.16.374.25.6.25z" fill="currentColor" fill-rule="nonzero"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="c-timeline__timings-wrapper" style="width: 7370px;">
                                                <div class="c-timeline__timings" id="timings">

                                                </div>
                                            </div>
                                            <div class="c-timeline__arrow-wrapper c-timeline__arrow-wrapper--next">
                                                <div class="c-timeline__arrow-layout" onclick="moveBar(1)">
                                                    <button class="c-timeline__arrow">
                                                        <div class="c-timeline__arrow-icon">
                                                            <svg viewBox="0 0 13 8" xmlns="http://www.w3.org/2000/svg" class="icon-chevron">
                                                                <path d="M6.5 7.5a.856.856 0 0 0 .6-.25l5.168-5.348a.827.827 0 0 0-1.19-1.15L6.501 5.491 1.923.752a.841.841 0 0 0-1.17-.02.824.824 0 0 0-.02 1.17L5.902 7.25c.158.16.374.25.6.25z" fill="currentColor" fill-rule="nonzero"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </gtv-timeline>
                                    </gtv-tv-schedule-virtual-scroller>
                                   
                                </gtv-tv-schedule>
                            </div>
                        </gtv-home-grid>


                    </div>

                </gtv-home>

            </main>
        </gtv-root>
         <div class="loadMoreLessBtn loadMore">
                <button id="loadmoreEpg" onclick="loadMoreEpg(this)" class="c-button c-detailPreview__button" data-start="20" style="display: none;font-size: 14px;padding: 6px 0px;">Load More</button>
        </div>
        <noscript>Javascript required to run this application.</noscript>
        <div id="settins_box" class="o-modal" style="opacity: 0; display: none">
            <div class="o-modal__inner">
                <gtv-detail-carousel class="ng-tns-c55-19 ng-star-inserted">
                    <ngu-carousel class="detail-preview-carousel ngucarouselQZqt96" _nghost-serverapp-c32="">
                        <div _ngcontent-serverapp-c32="" class="ngucarousel">
                            <div _ngcontent-serverapp-c32="" class="ngu-touch-container" style="touch-action: pan-y;user-select: none;-webkit-user-drag: none;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);position: relative;top: 25%;">
                                <div class="" style="">
                                    <ngu-tile _nghost-serverapp-c33="" class="ng-tns-c55-19 ng-trigger ng-trigger-slider item ng-star-inserted" style="transform: translate3d(0px, 0px, 0px);">
                                        <div _ngcontent-serverapp-c33="" class="tile">
                                            <gtv-detail-preview class="ng-tns-c55-19 ng-star-inserted" style="">
                                                <div class="c-detailPreview ng-star-inserted">
                                                    <header class="">
                                                        <h2 class="c-detailPreview__title">Search settings</h2>
                                                    </header>
                                                    <div class="c-detailPreview__body">
                                                        <div class="c-detailPreview__intro">
                                                            <div class="">
                                                                <div class="">
                                                                    <div style="padding: 0 15px;">
                                                                        <gtv-action-widget class="ng-star-inserted"><div>Search for:
                                                                            <div>
                                                                                <label>
                                                                                    <input type="radio" name="search_mode" value="0" checked=""> &nbsp;<span>Event</span>
                                                                                </label>
                                                                                <br>
                                                                                <label>
                                                                                    <input type="radio" name="search_mode" value="1"> &nbsp;<span>Channels</span>
                                                                                </label>
                                                                                <br>
                                                                            </div>
                                                                            <div class="c-actionWidget__buttons">
                                                                            </div>
                                                                            <div class="c-actionWidget__disclaimer u-hidden-m">
                                                                                <footer class="c-actionWidget__footer">
                                                                                </footer>
                                                                            </div>
                                                                            </div>
                                                                        </gtv-action-widget>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <a class="c-button c-detailPreview__button" href="javascript:void(0)" onclick="closeSettings()">Close</a></div>
                                                </div>
                                            </gtv-detail-preview>
                                        </div>
                                    </ngu-tile>
                                </div>
                            </div>
                        </div>

                    </ngu-carousel>
                </gtv-detail-carousel>
            </div>
        </div>
        <div onclick="closeInfo()" id="info_box" class="o-modal" style="opacity: 0; display: none">
            <div class="o-modal__inner">
                <gtv-detail-carousel class="ng-tns-c55-19 ng-star-inserted">
                    <ngu-carousel class="detail-preview-carousel ngucarouselQZqt96" _nghost-serverapp-c32="">
                        <div _ngcontent-serverapp-c32="" class="ngucarousel">
                            <div _ngcontent-serverapp-c32="" class="ngu-touch-container" style="touch-action: pan-y;user-select: none;-webkit-user-drag: none;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);position: relative;top: 25%;">
                                <div class="" style="">

                                    <ngu-tile _nghost-serverapp-c33="" class="ng-tns-c55-19 ng-trigger ng-trigger-slider item ng-star-inserted" style="transform: translate3d(0px, 0px, 0px);">
                                        <div _ngcontent-serverapp-c33="" class="tile">

                                            <gtv-detail-preview class="ng-tns-c55-19 ng-star-inserted" style="">

                                                <div class="c-detailPreview ng-star-inserted">
                                                    <div class="info_img_box">
                                                        <img id="info_img" src="" class="ng-star-inserted">
                                                    </div>
                                                    <header class="">

                                                        <h2 class="c-detailPreview__title" id="info_title"></h2>

                                                    </header>
                                                    <div class="c-detailPreview__body">

                                                        <div class="c-detailPreview__intro">
                                                            <div class="c-detailPreview__schedule">
                                                                <div class="c-detailPreview__label">

                                                                    <div class="ng-star-inserted" id="info_hour"></div>
                                                                </div>
                                                                <img id="info_logo" class="c-detailPreview__channel ng-star-inserted" src="" alt="">

                                                                <p class="c-detailPreview__label ng-star-inserted" id="info_channel"></p>
                                                            </div>
                                                            <gtv-detail-controls>

                                                                <div class="c-detailControls ng-star-inserted">

                                                                    <div class="c-detailControls__content">

                                                                        <gtv-action-widget class="ng-star-inserted">
                                                                            <div class="c-actionWidget c-detailControls__action">
                                                                                <div class="c-actionWidget__buttons"></div>

                                                                                <div class="c-actionWidget__disclaimer u-hidden-m">


                                                                                    <footer class="c-actionWidget__footer">

                                                                                    </footer>
                                                                                </div>
                                                                            </div>
                                                                        </gtv-action-widget>

                                                                    </div>
                                                                </div>
                                                            </gtv-detail-controls>
                                                        </div>
                                                        <div class="c-detailPreview__abstract" id="info_descr"></div>
                                                        <a class="c-button c-detailPreview__button" href="javascript:void(0)" onclick="closeInfo()">Close</a></div>
                                                </div>
                                            </gtv-detail-preview>
                                        </div>
                                    </ngu-tile>
                                </div>
                            </div>
                        </div>

                    </ngu-carousel>
                </gtv-detail-carousel>
            </div>
        </div>
    </body>

</html>