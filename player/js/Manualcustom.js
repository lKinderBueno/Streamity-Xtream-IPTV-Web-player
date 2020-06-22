$(document).ready(function() {
    var closed = localStorage.getItem('closed') || '';
    if (closed == 'yes') {
        $('.warningPerm').hide(0);
    } else {
        $('.warningPerm').removeClass('hide');
    }
    $('#LoginModal').click(function() {
        $('#loginModel').modal({
            backdrop: true,
            keyboard: true
        })
    })


    var webtvloginprocess = $('.webtvloginprocess');
    webtvloginprocess.click(function(e) {
        e.preventDefault();
        formsubmitwebtv();
    });


    function formsubmitwebtv() {
        $('#loginProcessIcon').addClass('hideOnload');
        var invaliddetails = $('.invaliddetails');
        var LoginImageLoader = $('#LoginImageLoader');
        invaliddetails.addClass('hideOnload');
        var totalinput = 0;
        $('.logininputs').removeClass('addborder');
        LoginImageLoader.removeClass('hideOnload');
        $(this).addClass('anchordeactivate');
        var username_identy = $('#input-login');
        var password_identy = $('#input-pass');
        var username_value = $('#input-login').val();
        var password_value = $('#input-pass').val();
        var rememberMe_value = '';
        if ($('#rememberMe').is(':checked')) {
            rememberMe_value = 'on';

        } else {
            rememberMe_value = 'off'
        }

        if (username_value != "") {
            totalinput++;
        } else {
            username_identy.addClass('addborder');
        }
        if (password_value != "") {
            totalinput++;
        } else {
            password_identy.addClass('addborder');
        }
        if (totalinput == 2) {
            $('#loginProcessIcon').removeClass('hideOnload');
            jQuery.ajax({
                type: "POST",
                url: "includes/ajax-control.php",
                dataType: "text",
                data: {
                    action: 'webtvlogin',
                    uname: username_value,
                    upass: password_value,
                    rememberMe: rememberMe_value
                },
                success: function(response) {
                    $('#loginProcessIcon').addClass('hideOnload');
                    LoginImageLoader.addClass('hideOnload');
                    var obj = jQuery.parseJSON(response);
                    if (obj.result != "error") {
                        window.location.href = 'dashboard.php';
                    } else {
                        //invaliddetails.removeClass('hideOnload');
                        //$('.loginprocess').removeClass('anchordeactivate');
                        $('.loginprocess').removeClass('anchordeactivate');
                        swal('Error!', obj.message, 'warning');
                        /*$("#ErrorText").text(obj.message);
               $('#FailLOginMessage').animate({'top':'67px'}, 500 );
               setTimeout (function(){
                $('#FailLOginMessage').animate({'top':'-100%'}, 500 );
               },4000);*/
                    }
                }
            });
        } else {
            LoginImageLoader.addClass('hideOnload');
            $('.loginprocess').removeClass('anchordeactivate');
        }
    }


    $('.dontShow').click(function() {


        if (closed != 'yes') {
            localStorage.setItem('closed', 'yes');
        }

    })






    /*
    	var PlayerDIvSelector = $('#player-wrapper');
    	var PlayerDivLenth = PlayerDIvSelector.length;
    	if(PlayerDivLenth != 0){
    		PlayerDIvSelector.html('');
    		jwplayer("player-wrapper").setup({
    		    "file": "http://qqtv.nl:80/movie/lovedeep/lovedeep/18628.mp4",
    		    "width": "100%",
    		    "aspectratio": "16:9"
    		});
    	}*/
});