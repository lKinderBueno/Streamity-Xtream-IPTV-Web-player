<?php
include "installer/installer.php";


?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="favicon.ico" />
        <!--<link rel="icon" type="image/png" href="assets/img/favicon.png">!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <title>
            Streamity.tv 1.0 XTREAM Reseller Installer
        </title>
        <meta content="width=device-width, initial-scale=1.0, shrink-to-fit=no" name="viewport" />
        <!--     Fonts and icons     -->
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" />
        <!-- CSS Files -->
        <link href="assets/css/material-dashboard.css?v=2.1.2" rel="stylesheet" />
        <!-- CSS Just for demo purpose, don't include it in your project -->
        <link href="assets/demo/demo.css" rel="stylesheet" />
    </head>

    <body class="">
        <script src="installer/script.js"></script>
        <div class="wrapper">
            <div class="sidebar" data-color="purple" data-background-color="white" data-image="assets/img/sidebar-1.jpg?0">
                <!--
Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"

Tip 2: you can also add an image using data-image tag
-->
                <div class="logo">
                    <a href="" class="simple-text logo-normal">
                        <img src="logo.png?0" alt="" style="max-height: 50px; filter: drop-shadow(1px 1px 5px #6d6d6d);" />
                    </a>
                </div>
                <div class="sidebar-wrapper">
                    <ul class="nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">
                                <i class="material-icons">dashboard</i>
                                <p>Installer</p>
                            </a>
                        </li>
                        <div class="dropdown-divider"></div>
                    </ul>
                </div>
            </div>
            <div class="main-panel">
                <!-- Navbar -->
                <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top">
                    <div class="container-fluid">
                        <div class="navbar-wrapper">
                            <a class="navbar-brand" href="javascript:;">Welcome in Streamity.tv [1.0] Xtream installer</a>
                        </div>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                            <span class="navbar-toggler-icon icon-bar"></span>
                        </button>
                    </div>
                </nav>
                <!-- End Navbar -->
                <div class="content">
                    <div class="container-fluid">
                        <div>
                            IMPORTANT: Streamity.tv player <strong>requires</strong> HTTP protocol (no HTTPS SSL). <br />
                            The login and dashboard page can run on HTTP and HTTPS. <br />
                             <!--It is reccomended to <strong>NOT</strong> use cloudflare. -->
                        </div>
                        <form action="#" method="post" id="myform" enctype="multipart/form-data">
                            <h4 style="color: red;">
                                <strong><?php echo $error;?></strong>
                            </h4>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">Basic configuration</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <div class="row">
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">IPTV Name (ex. Streamity TV)</label>
                                                                    <input type="text" name="iptv_name" class="form-control" />
                                                                </div>
                                                                <div style="display:none">
                                                                    <input type="text" name="path" id="path" class="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <div class="row">
                                                            <div class="col-lg3 col-md-5 col-sm-6">
                                                                <label>Upload IPTV Logo</label><br />
                                                                <input type="file" accept=".png" name="iptv_logo" />
                                                            </div>
                                                            <div class="col-lg3 col-md-5 col-sm-6">
                                                                <label>Upload IPTV Icon</label><br />
                                                                <input type="file" accept=".ico" name="iptv_logo_icon" />
                                                            </div>
                                                        </div>
                                                        <br/>
                                                        <label>
                                                            <input type="checkbox" value="true" name="dashboard_home" />
                                                            <span>
                                                                Replace index page with dashboard (!! This will delete your index.html page !!)
                                                            </span>
                                                        </label>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">IPTV configuration</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <div class="row">
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">IPTV Provider host (ex. http://test.com:8080/)</label>
                                                                    <input type="text" name="iptv_url" class="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">EPG configuration</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <label>
                                                            <input type="radio" name="api_enable" value="1" onchange="document.getElementById('db_box').style.display=''" /> &nbsp;
                                                            <span>XML + Database (reccomended for 20+ MB epg file)</span>
                                                        </label>
                                                        <br />
                                                        <div id="db_box" style="display: none;">
                                                            <label>
                                                                Every 4 hours Streamity.tv player will convert your epg xml file into an SQL database.<br />
                                                                This settings is the most reccommended if your epg xml file is over 20MB and will offer the best experience to your customers.
                                                            </label>
                                                            <div class="col-lg3 col-md-9 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">EPG Url (ex. http://test.com:8080/xmltv.php?user=ciao&password=vita)</label>
                                                                    <input type="text" name="epg_url" class="form-control" />
                                                                </div>
                                                            </div>
                                                            <label id="epg_db_result" style="visibility: hidden;"></label>
                                                            <br />
                                                            <div class="row">
                                                                <div class="col-lg3 col-md-3 col-sm-6">
                                                                    <div class="form-group bmd-form-group is-filled">
                                                                        <label class="bmd-label-floating">Database URL</label>
                                                                        <input type="text" id="epg_db_url" name="epg_db_url" value="localhost" class="form-control" />
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg3 col-md-3 col-sm-6">
                                                                    <div class="form-group bmd-form-group is-filled">
                                                                        <label class="bmd-label-floating">Database Name</label>
                                                                        <input type="text" id="epg_db_name" name="epg_db_name" class="form-control" />
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg3 col-md-3 col-sm-6">
                                                                    <div class="form-group bmd-form-group is-filled">
                                                                        <label class="bmd-label-floating">Database Username</label>
                                                                        <input type="text" id="epg_db_user" name="epg_db_user" class="form-control" />
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg3 col-md-3 col-sm-6">
                                                                    <div class="form-group bmd-form-group is-filled">
                                                                        <label class="bmd-label-floating">Database Password</label>
                                                                        <input type="password" id="epg_db_pass" name="epg_db_pass" class="form-control" />
                                                                    </div>
                                                                </div>
                                                                <div class="col-lg3 col-md-2 col-sm-6">
                                                                    <button onclick="testDatabase()" type="button" class="btn btn-primary">
                                                                        Test database
                                                                        <div class="ripple-container"></div>
                                                                        <div class="ripple-container"></div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <label> <input type="radio" value="2" name="api_enable" onchange="document.getElementById('db_box').style.display='none'" checked="true" /> &nbsp;<span> API Epg</span> </label>
                                                        <br />
                                                        <label>
                                                            <input type="radio" name="api_enable" value="3" onchange="document.getElementById('db_box').style.display='none'" /> &nbsp;
                                                            <span>API Epg - Low RAM Mode (faster loading, but EPG Viewer disabled)</span>
                                                        </label>
                                                        <br />
                                                        <label>
                                                            <input type="radio" name="api_enable" value="4" onchange="document.getElementById('db_box').style.display='none'" /> &nbsp;
                                                            <span>Disable epg (every reference to EPG will be removed)</span>
                                                        </label>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">TMDb Api (optional)</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <label>
                                                            Streamity.tv syncs with TMDb missing Vods and Series info (as cover, description, episode series title etc etc). <br />
                                                            VODs and Series info will be searched first from IPTV provider server and then from TMDb.<br />
                                                            <br />
                                                            This settings is optional. Leave this field empty if you don't want to use TMDb Api.
                                                        </label>
                                                        <br />
                                                        <div class="row">
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">TMDB Api</label>
                                                                    <input type="text" name="tmdb_api" class="form-control" />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <button onclick="window.open('https://developers.themoviedb.org/3/getting-started/introduction')" type="button" class="btn btn-primary">
                                                                    Get TMDb Api
                                                                    <div class="ripple-container"></div>
                                                                    <div class="ripple-container"></div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">reCAPTCHA v2 (optional)</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <label>
                                                            reCAPTCHA is a free security service that protects your websites from spam and abuse.<br />
                                                            It will be integrated in the login page.<br />
                                                            IMPORTANT: Is advised to use an SSL protocol (https) in the login page to avoid issue with reCAPTCHA.<br />
                                                            <br />
                                                            This settings is optional. Leave this field empty if you don't want to use reCAPTCHA.
                                                        </label>
                                                        <br />
                                                        <div class="row">
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">Public key (client)</label>
                                                                    <input type="text" name="recaptcha_client" class="form-control" />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg3 col-md-4 col-sm-6">
                                                                <div class="form-group bmd-form-group is-filled">
                                                                    <label class="bmd-label-floating">Private key (server)</label>
                                                                    <input type="text" name="recaptcha_server" class="form-control" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                                        <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">Disable components</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <div class="row">
                                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                                                <label>
                                                                    <input type="checkbox" value="1" name="disable_live">
                                                                    <span>
                                                                        Disable Live channels
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                                                <label>
                                                                    <input type="checkbox" value="1" name="disable_movie">
                                                                    <span>
                                                                        Disable Movie
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            <div class="col-lg-4 col-md-6 col-sm-6">
                                                                <label>
                                                                    <input type="checkbox" value="1" name="disable_series">
                                                                    <span>
                                                                        Disable Series
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">Advanced configuration (optional)</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                        <label>
                                                            When a customer login for the first time on Streamity.tv player on a new browser, the server will calculate the number of channels/vods/series avaible on the account. <br />
                                                            This procedure will delay the login of 30-40 seconds for IPTV lists with a lot of channels. <br />
                                                            Checking this box will disable this feature. <br />
                                                            Number of channels/vod/series will be continue to be calculated during the opening of each player. <br />
                                                            (for example: Live channels player will calculate only number of live channels)
                                                        </label>
                                                        <br />
                                                        <label>
                                                            <input type="checkbox" value="true" name="disable_count" />
                                                            <span>
                                                                Disable channels count during first login
                                                            </span>
                                                        </label>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div class="row">
                                <div class="col-lg3 col-md-12 col-sm-6">
                                    <button type="submit" name="install" value="install" class="btn btn-primary" style="width: 100%;">
                                        Install Streamity.tv
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <footer class="footer">
                    <div class="container-fluid">
                        <div class="copyright float-right">
                            &copy;
                            <script>
                                document.write(new Date().getFullYear());
                            </script>
                            Powered by <a href="https://streamity.tv">Streamity.tv</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <!--   Core JS Files   -->
        <script src="assets/js/core/jquery.min.js"></script>
        <script src="assets/js/core/popper.min.js"></script>
        <script src="assets/js/core/bootstrap-material-design.min.js"></script>
        <script src="assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
        <!-- Forms Validations Plugin -->
        <script src="assets/js/plugins/jquery.validate.min.js"></script>
        <!-- Plugin for the Wizard, full documentation here: https://github.com/VinceG/twitter-bootstrap-wizard -->
        <!--  Plugin for the Sliders, full documentation here: http://refreshless.com/nouislider/ -->
        <script src="assets/js/plugins/nouislider.min.js"></script>
        <!-- Include a polyfill for ES6 Promises (optional) for IE11, UC Browser and Android browser support SweetAlert -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js"></script>
        <!-- Control Center for Material Dashboard: parallax effects, scripts for the example pages etc -->
        <script src="assets/js/material-dashboard.js?v=2.1.2" type="text/javascript"></script>
        <!-- Material Dashboard DEMO methods, don't include it in your project! -->
        <script src="assets/demo/demo.js"></script>
        <!--
=========================================================
Material Dashboard - v2.1.2
=========================================================

Product Page: https://www.creative-tim.com/product/material-dashboard
Copyright 2020 creative-tim.com (https://www.creative-tim.com)
Coded by creative-tim.com

=========================================================
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. -->
        <script>
            $(document).ready(function () {
                $().ready(function () {
                    $sidebar = $(".sidebar");

                    $sidebar_img_container = $sidebar.find(".sidebar-background");

                    $full_page = $(".full-page");

                    $sidebar_responsive = $("body > .navbar-collapse");

                    window_width = $(window).width();

                    fixed_plugin_open = $(".sidebar .sidebar-wrapper .nav li.active a p").html();

                    if (window_width > 767 && fixed_plugin_open == "Dashboard") {
                        if ($(".fixed-plugin .dropdown").hasClass("show-dropdown")) {
                            $(".fixed-plugin .dropdown").addClass("open");
                        }
                    }

                    $(".fixed-plugin a").click(function (event) {
                        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
                        if ($(this).hasClass("switch-trigger")) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (window.event) {
                                window.event.cancelBubble = true;
                            }
                        }
                    });

                    $(".fixed-plugin .active-color span").click(function () {
                        $full_page_background = $(".full-page-background");

                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");

                        var new_color = $(this).data("color");

                        if ($sidebar.length != 0) {
                            $sidebar.attr("data-color", new_color);
                        }

                        if ($full_page.length != 0) {
                            $full_page.attr("filter-color", new_color);
                        }

                        if ($sidebar_responsive.length != 0) {
                            $sidebar_responsive.attr("data-color", new_color);
                        }
                    });

                    $(".fixed-plugin .background-color .badge").click(function () {
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");

                        var new_color = $(this).data("background-color");

                        if ($sidebar.length != 0) {
                            $sidebar.attr("data-background-color", new_color);
                        }
                    });

                    $(".fixed-plugin .img-holder").click(function () {
                        $full_page_background = $(".full-page-background");

                        $(this).parent("li").siblings().removeClass("active");
                        $(this).parent("li").addClass("active");

                        var new_image = $(this).find("img").attr("src");

                        if ($sidebar_img_container.length != 0 && $(".switch-sidebar-image input:checked").length != 0) {
                            $sidebar_img_container.fadeOut("fast", function () {
                                $sidebar_img_container.css("background-image", 'url("' + new_image + '")');
                                $sidebar_img_container.fadeIn("fast");
                            });
                        }

                        if ($full_page_background.length != 0 && $(".switch-sidebar-image input:checked").length != 0) {
                            var new_image_full_page = $(".fixed-plugin li.active .img-holder").find("img").data("src");

                            $full_page_background.fadeOut("fast", function () {
                                $full_page_background.css("background-image", 'url("' + new_image_full_page + '")');
                                $full_page_background.fadeIn("fast");
                            });
                        }

                        if ($(".switch-sidebar-image input:checked").length == 0) {
                            var new_image = $(".fixed-plugin li.active .img-holder").find("img").attr("src");
                            var new_image_full_page = $(".fixed-plugin li.active .img-holder").find("img").data("src");

                            $sidebar_img_container.css("background-image", 'url("' + new_image + '")');
                            $full_page_background.css("background-image", 'url("' + new_image_full_page + '")');
                        }

                        if ($sidebar_responsive.length != 0) {
                            $sidebar_responsive.css("background-image", 'url("' + new_image + '")');
                        }
                    });

                    $(".switch-sidebar-image input").change(function () {
                        $full_page_background = $(".full-page-background");

                        $input = $(this);

                        if ($input.is(":checked")) {
                            if ($sidebar_img_container.length != 0) {
                                $sidebar_img_container.fadeIn("fast");
                                $sidebar.attr("data-image", "#");
                            }

                            if ($full_page_background.length != 0) {
                                $full_page_background.fadeIn("fast");
                                $full_page.attr("data-image", "#");
                            }

                            background_image = true;
                        } else {
                            if ($sidebar_img_container.length != 0) {
                                $sidebar.removeAttr("data-image");
                                $sidebar_img_container.fadeOut("fast");
                            }

                            if ($full_page_background.length != 0) {
                                $full_page.removeAttr("data-image", "#");
                                $full_page_background.fadeOut("fast");
                            }

                            background_image = false;
                        }
                    });

                    $(".switch-sidebar-mini input").change(function () {
                        $body = $("body");

                        $input = $(this);

                        if (md.misc.sidebar_mini_active == true) {
                            $("body").removeClass("sidebar-mini");
                            md.misc.sidebar_mini_active = false;

                            $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar();
                        } else {
                            $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar("destroy");

                            setTimeout(function () {
                                $("body").addClass("sidebar-mini");

                                md.misc.sidebar_mini_active = true;
                            }, 300);
                        }

                        // we simulate the window Resize so the charts will get updated in realtime.
                        var simulateWindowResize = setInterval(function () {
                            window.dispatchEvent(new Event("resize"));
                        }, 180);

                        // we stop the simulation of Window Resize after the animations are completed
                        setTimeout(function () {
                            clearInterval(simulateWindowResize);
                        }, 1000);
                    });
                });
            });
        </script>
        <script>
            $(document).ready(function () {
                // Javascript method's body can be found in assets/js/demos.js
                md.initDashboardPageCharts();
            });
        </script>
        <style>
            .settingsTitle {
                padding: 2px 20px !important;
            }
        </style>
    </body>
</html>