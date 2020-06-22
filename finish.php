<?php
include "config.php";
if(!$_GET['data'])
    $hide=" display:none;";
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="favicon.ico?<?php echo $version; ?>" />
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
            <div class="sidebar" data-color="purple" data-background-color="white" data-image="assets/img/sidebar-1.jpg">
                <!--
Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"

Tip 2: you can also add an image using data-image tag
-->
                <div class="logo">
                    <a href="" class="simple-text logo-normal">
                        <img src="logo.png?<?php echo $version; ?>" alt="" style="max-height: 50px; filter: drop-shadow(1px 1px 5px #6d6d6d);" />
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
                            The home,login, dashboard page can run on HTTP and/or HTTPS. <br />
                            <!-- It is reccomended to <strong>NOT</strong> use cloudflare. -->
                        </div>
                        <div>
                            <h4 style="color: red;">
                                <strong><?php echo $error;?></strong>
                            </h4>
                            <div class="row">
                                <div class="card">
                                    <div class="card-header card-header-tabs card-header-primary settingsTitle">
                                        <div class="nav-tabs-navigation">
                                            <div class="nav-tabs-wrapper">
                                                <h4 class="nav-tabs-title">Installation complete!</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="tab-content">
                                            <div class="tab-pane active">
                                                <table class="table">
                                                    <tbody>
                                                            <label style="color:black;">Installation completed succesfully!</label>
                                                            <br/>
                                                            <label style="color:black;">If you are facing error 500 try to increase php max_execution_time and memory_limit.</label>
                                                            <br/>
                                                            <label style="color:black;">If you see "Warning and Notice" messages printed on your screen, disable "display_errors" or the player won't be visualized properly.</label>
                                                            <br/>
                                                            <label style="color:black;">If your iptv runs on port different then 80 (ex. http://iptv.com:60444/) and you can't open the player, open the server's firewall 60444 port.</label>
                                                            <br/>
                                                            <label style="color:black;<?php echo $hide;?>">
                                                                <strong style="color:blue">IMPORTANT!:</strong>
                                                                <br/>
                                                                There are other few manually steps for completing the installation.
                                                                <br/>
                                                                1. Open your database administration tool (ex. phpMyAdmin)
                                                                <br/></br>
                                                                2. Create table for storing EPG. You can do that in two ways: <br/>
                                                                2.a Import "structure.sql" file (avaible in folder "installer")
                                                                <br/>
                                                                2.b Execute this query:
                                                                </label>
                                                                <br/>
                                                                <label style="<?php echo $hide;?>">
                                                                    DROP TABLE IF EXISTS epg_data;<br/><br/>
            
            CREATE TABLE `epg_data` (<br/>
  `epg_id` varchar(70) NOT NULL,<br/>
  `start` bigint(20) UNSIGNED NOT NULL,<br/>
  `stop` bigint(20) UNSIGNED NOT NULL,<br/>
  `title` text NOT NULL,<br/>
  `descr` longtext NOT NULL,<br/>
  `id` int(11) NOT NULL<br/>
) ENGINE=InnoDB DEFAULT CHARSET=latin1;<br/>
<br/>
ALTER TABLE `epg_data`<br/>
  ADD PRIMARY KEY (`epg_id`,`id`),<br/>
  ADD UNIQUE KEY `epg_id` (`epg_id`,`id`);<br/><br/>
                                                                </label><br/>
                                                                <label style="color:black;<?php echo $hide;?>">
                                                                    3. Click on this button and wait the message "Epg created".
                                                                </label><br/>
                                                                <button style="<?php echo $hide;?>" type="submit" class="btn btn-primary" onclick="createEpg()">
                                        Create EPG
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                    </button>
                                    </br></br>
                                    <label style="color:black;<?php echo $hide;?>">
                                                                    4. That's all!<br/><br/>
                                                                </label><br/>
                                                                <label style="color:black;<?php echo $hide;?>">
                                                                    Optional: If you have access to crontab add one of these two:<br/>
                                                                    1.a 0 */4 * * *  /usr/bin/php <?php echo realpath($_SERVER["DOCUMENT_ROOT"]);?>/player/live/epgScraper.php &> /dev/null
                                                                    <br/>
                                                                    1.b 0 */4 * * *  wget http(s)://[WEBPLAYER URL]/player/live/epgScraper.php &> /dev/null
                                                                </label><br/>
                                                            </label>
                                                        <br />
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
                                    <form action="login.php">
                                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                                        Go to Streamity.tv login page
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                        <div class="ripple-container"></div>
                                    </button>
                                    </form>
                                </div>
                            </div>
                        </div>
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

<?php unlink("finish.php")?>