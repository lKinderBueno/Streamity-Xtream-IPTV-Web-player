/*---------Categories Nav -----------*/
var menuLeft = document.getElementById('cbp-spmenu-s1'),
    body = document.body;
showLeft.onclick = function() {
    openGroupBar();
};
/*---------Categories toggle button-----------*/
$(document).ready(function() {
    $('.cat-toggle').click(function() {
        $(this).toggleClass('open');
    });
});

/*---------carousel Slider-----------*/
$('.home-carousel').owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    responsiveClass: true,
    responsive: {
        0: {
            items: 2,
            nav: true
        },
        600: {
            items: 4,
            nav: true,
        },
        800: {
            items: 6,
            nav: true,
        },
        1000: {
            items: 7,
            nav: true,
            loop: false
        },

        1200: {
            items: 9,
            nav: true,
            loop: false
        },

        1400: {
            items: 9,
            nav: true,
            loop: false
        }
    }
})
/****************** START: Scroll ******************/
/*$(function () {
	var $document_body = $('body');
	$document_body.scrollator();
	$('.addscroll').scrollator();
});*/
/******************* END: Scroll *******************/
/******************* Start: Search *******************/

$(function() {
    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').addClass('open');
        $('#SearchData').focus();
    });

    $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });


    //Do not include! This prevents the form from submitting for DEMO purposes only!
    $('form').submit(function(event) {
        event.preventDefault();
        return false;
    })
});

/******************* END: Search *******************/