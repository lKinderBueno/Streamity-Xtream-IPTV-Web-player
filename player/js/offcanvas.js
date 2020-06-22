/*! Bootstrap-off-canvas-push - v1.0.3
 * Copyright (c) 2015 Steffen Ermel; Licensed MIT *
 */
jQuery(document).ready(function($) {

    function whichTransitionEvent() {
        var el = document.createElement('event'),
            transitionEvents = {
                'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
                'MozTransition': 'transitionend', // only for FF < 15
                'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
            };
        for (var t in transitionEvents) {
            if (el.style[t] !== undefined) {
                return transitionEvents[t];
            }
        }
    }
    var transitionEvent = whichTransitionEvent();

    $('[data-toggle="offcanvas"], .overlay').click(function() {
        $('.overlay').toggleClass('active');
        $('body').toggleClass('active');
        $('.row-offcanvas').toggleClass('active');
        $('.sidebar-offcanvas').toggleClass('active');
        $('.navbar-toggle').toggleClass('collapsed');
        $('.navbar-collapse').addClass('transition');
        $('.transition').one(transitionEvent,
            function(e) {
                $('.navbar-collapse').removeClass('transition');
            });
    });

    $('.navbar .nav a').click(function() {
        $('.overlay').removeClass('active');
        $('body').removeClass('active');
        $('#navbar').removeClass('in');
        $('.row-offcanvas').removeClass('active');
        $('.sidebar-offcanvas').removeClass('active');
        $('.navbar-toggle').addClass('collapsed');
        $('.transition').one(transitionEvent,
            function(e) {
                $('.navbar-collapse').removeClass('transition');
            });
    });


});