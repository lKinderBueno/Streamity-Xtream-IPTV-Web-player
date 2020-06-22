<?php
include "logDir/login/Session.php";
if($epgMode==4)
    $disableEpg = 'none';
if($noLive)
    $disableLive = 'none';
if($noMovie)
    $disableMovie = 'none';
if($noSeries)
    $disableSeries = 'none';

?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="favicon.ico?<?php echo $version; ?>">
        <!--<link rel="icon" type="image/png" href="assets/img/favicon.png">!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <title>
            <?php echo $nameIptv; ?> Dashboard
        </title>
        <meta content='width=device-width, initial-scale=1.0, shrink-to-fit=no' name='viewport' />
        <!--     Fonts and icons     -->
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">
        <!-- CSS Files -->
        <link href="assets/css/material-dashboard.css?v=2.1.2" rel="stylesheet" />
        <!-- CSS Just for demo purpose, don't include it in your project -->
        <link href="assets/demo/demo.css" rel="stylesheet" />
    </head>

    <body class="">
        <script src="assets/js/script.js"></script>
        <script>
            var user = '<?php echo $user; ?>'; 
            var h24 = <?php echo $_COOKIE["h24"]; ?>;
            var shift = <?php echo $_COOKIE["shift"]; ?>; 
            var epg = <?php if($_COOKIE['epg']) echo 'true'; else echo 'false'; ?>; 
            var epgDB = <?php if($epgDb) echo 'true'; else echo 'false'; ?>;
            var expire = <?php echo $_COOKIE["expdate"]; ?>;
            var path = '<?php echo "{$path}"; ?>';
            var noEpg ='<?php echo $version; ?>';
            var epgMode = '<?php echo $epgMode; ?>';
            
        </script> 
        <div class="wrapper ">
            <div class="sidebar" data-color="purple" data-background-color="white" data-image="assets/img/sidebar-1.jpg">
                <!--
Tip 1: You can change the color of the sidebar using: data-color="purple | azure | green | orange | danger"

Tip 2: you can also add an image using data-image tag
-->
                <div class="logo"><a href="" class="simple-text logo-normal">
                    <img src="logo.png?<?php echo $version; ?>" alt="" style="max-height: 50px;filter: drop-shadow(1px 1px 5px #6d6d6d);">
                    </a>
                </div>
                <div class="sidebar-wrapper">
                    <ul class="nav">
                        <li class="nav-item active  ">
                            <a class="nav-link" href="#">
                                <i class="material-icons">dashboard</i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <div class="dropdown-divider"></div>
                        <li class="nav-item ">
                            <a class="nav-link" href="javascript:void(0)" onclick="window.location='php/logout.php'">
                                <i class="material-icons">exit_to_app</i>
                                <p>Log out</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="main-panel">
                <!-- Navbar -->
                <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
                    <div class="container-fluid">
                        <div class="navbar-wrapper">
                            <a class="navbar-brand" href="javascript:;">Dashboard</a>
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
                        <div class="row">
                            <div class="card">
                                <div class="card-header card-header-tabs card-header-primary">
                                    <div class="nav-tabs-navigation">
                                        <div class="nav-tabs-wrapper" >
                                            <h4 class="nav-tabs-title">Welcome <?php echo $user; ?> in <?php echo $nameIptv;?> Dashboard</h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <br>
                                    <div class="tab-content">
                                        <div class="tab-pane active">
                                            <table class="table">
                                                <tbody>
                                                    <div class="row">
                                                        <div class="col-lg-3 col-md-4 col-sm-4">
                                                            <div class="nav-link" style="display: inline-flex;">
                                                                <i class="material-icons">person</i>
                                                                <p style="padding-left: 10px;"><?php echo $user; ?></p>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-3 col-md-4 col-sm-4">
                                                            <div class="nav-link" style="display: inline-flex;">
                                                                <i class="material-icons">alarm</i>
                                                                <p style="padding-left: 10px;" id="expire_date"></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    <label id="epg_compress_box" style="margin-bottom: 30px;display:<?php echo $disablePartial; ?> ">
                                                        <input type="checkbox" id="api_epg_compress">
                                                        <span>
                                                            Enable partial EPG loading (this will reduce loading time, but disable some features)
                                                        </span>
                                                     </label>
                                                    <div class="row" style="display:<?php echo $disableEpg; ?>">

                                                        <div class="col-lg3 col-md-3 col-sm-6">

                                                            <label>EPG Time:</label>
                                                            <div>

                                                                <label>
                                                                    <input type="radio" id="epgtime_24" name="epgtime" value="24" checked=""> &nbsp;<span>24h</span>
                                                                </label>
                                                                <br>
                                                                <label>
                                                                    <input type="radio" id="epgtime_12" name="epgtime" value="12"> &nbsp;<span>12h AM-PM</span>
                                                                </label>
                                                                <br>

                                                            </div>

                                                        </div>
                                                        <div class="col-lg3 col-md-2 col-sm-6">
                                                            <br>
                                                            <div class="form-group bmd-form-group is-filled" id="epgshift_box">
                                                                <label class="bmd-label-floating">EPG Shift</label>
                                                                <input type="text" id="epg_shift" class="form-control">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </tbody>
                                            </table>
                                            <div class="row">
                                                <div class="col-lg-4 col-md-6 col-sm-6" style="display:<?php echo $disableLive; ?>">
                                                    <div class="card card-stats">
                                                        <div class="card-header card-header-warning card-header-icon" onclick="openBrowser(1)">
                                                            <div class="card-icon">
                                                                <i class="material-icons">live_tv</i>
                                                            </div>
                                                            <p class="card-category">Live Channels</p>
                                                            <h3 class="card-title" id="channels"><?php echo $_COOKIE['live']; ?></h3>
                                                        </div>
                                                        <div class="card-footer">
                                                            <a href="javascript:void(0)" onclick="openBrowser(1)">Open Live Player</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-md-6 col-sm-6" style="display:<?php echo $disableMovie; ?>">
                                                    <div class="card card-stats">
                                                        <div class="card-header card-header-danger card-header-icon" onclick="openBrowser(2)">
                                                            <div class="card-icon">
                                                                <i class="material-icons">local_movies</i>
                                                            </div>
                                                            <p class="card-category">Movies</p>
                                                            <h3 class="card-title" id="vods"><?php echo $_COOKIE['movie']; ?></h3>
                                                        </div>
                                                        <div class="card-footer">
                                                            <a href="javascript:void(0)" onclick="openBrowser(2)">Open Movie Player</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-md-6 col-sm-6" style="display:<?php echo $disableSeries; ?>">
                                                    <div class="card card-stats">
                                                        <div class="card-header card-header-info card-header-icon" onclick="openBrowser(3)">
                                                            <div class="card-icon">
                                                                <i class="material-icons">tv</i>
                                                            </div>
                                                            <p class="card-category">TV Series</p>
                                                            <h3 class="card-title" id="series"><?php echo $_COOKIE['series']; ?></h3>
                                                        </div>
                                                        <div class="card-footer">
                                                            <a href="javascript:void(0)" onclick="openBrowser(3)">Open TV Series Player</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
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
                                document.write(new Date().getFullYear())
                            </script>, <?php echo $nameIptv;?> - Powered by <a href="https://streamity.tv">Streamity.tv</a>
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
            $(document).ready(function() {
                $().ready(function() {
                    $sidebar = $('.sidebar');

                    $sidebar_img_container = $sidebar.find('.sidebar-background');

                    $full_page = $('.full-page');

                    $sidebar_responsive = $('body > .navbar-collapse');

                    window_width = $(window).width();

                    fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();

                    if (window_width > 767 && fixed_plugin_open == 'Dashboard') {
                        if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
                            $('.fixed-plugin .dropdown').addClass('open');
                        }

                    }

                    $('.fixed-plugin a').click(function(event) {
                        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
                        if ($(this).hasClass('switch-trigger')) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            } else if (window.event) {
                                window.event.cancelBubble = true;
                            }
                        }
                    });

                    $('.fixed-plugin .active-color span').click(function() {
                        $full_page_background = $('.full-page-background');

                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');

                        var new_color = $(this).data('color');

                        if ($sidebar.length != 0) {
                            $sidebar.attr('data-color', new_color);
                        }

                        if ($full_page.length != 0) {
                            $full_page.attr('filter-color', new_color);
                        }

                        if ($sidebar_responsive.length != 0) {
                            $sidebar_responsive.attr('data-color', new_color);
                        }
                    });

                    $('.fixed-plugin .background-color .badge').click(function() {
                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');

                        var new_color = $(this).data('background-color');

                        if ($sidebar.length != 0) {
                            $sidebar.attr('data-background-color', new_color);
                        }
                    });

                    $('.fixed-plugin .img-holder').click(function() {
                        $full_page_background = $('.full-page-background');

                        $(this).parent('li').siblings().removeClass('active');
                        $(this).parent('li').addClass('active');

                        var new_image = $(this).find("img").attr('src');

                        if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
                            $sidebar_img_container.fadeOut('fast', function() {
                                $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                                $sidebar_img_container.fadeIn('fast');
                            });
                        }

                        if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
                            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

                            $full_page_background.fadeOut('fast', function() {
                                $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                                $full_page_background.fadeIn('fast');
                            });
                        }

                        if ($('.switch-sidebar-image input:checked').length == 0) {
                            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
                            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

                            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                        }

                        if ($sidebar_responsive.length != 0) {
                            $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
                        }
                    });

                    $('.switch-sidebar-image input').change(function() {
                        $full_page_background = $('.full-page-background');

                        $input = $(this);

                        if ($input.is(':checked')) {
                            if ($sidebar_img_container.length != 0) {
                                $sidebar_img_container.fadeIn('fast');
                                $sidebar.attr('data-image', '#');
                            }

                            if ($full_page_background.length != 0) {
                                $full_page_background.fadeIn('fast');
                                $full_page.attr('data-image', '#');
                            }

                            background_image = true;
                        } else {
                            if ($sidebar_img_container.length != 0) {
                                $sidebar.removeAttr('data-image');
                                $sidebar_img_container.fadeOut('fast');
                            }

                            if ($full_page_background.length != 0) {
                                $full_page.removeAttr('data-image', '#');
                                $full_page_background.fadeOut('fast');
                            }

                            background_image = false;
                        }
                    });

                    $('.switch-sidebar-mini input').change(function() {
                        $body = $('body');

                        $input = $(this);

                        if (md.misc.sidebar_mini_active == true) {
                            $('body').removeClass('sidebar-mini');
                            md.misc.sidebar_mini_active = false;

                            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                        } else {

                            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

                            setTimeout(function() {
                                $('body').addClass('sidebar-mini');

                                md.misc.sidebar_mini_active = true;
                            }, 300);
                        }

                        // we simulate the window Resize so the charts will get updated in realtime.
                        var simulateWindowResize = setInterval(function() {
                            window.dispatchEvent(new Event('resize'));
                        }, 180);

                        // we stop the simulation of Window Resize after the animations are completed
                        setTimeout(function() {
                            clearInterval(simulateWindowResize);
                        }, 1000);

                    });
                });
            });
        </script>
        <script>
            $(document).ready(function() {
                // Javascript method's body can be found in assets/js/demos.js
                md.initDashboardPageCharts();

            });
        </script>
    </body>

    </html>