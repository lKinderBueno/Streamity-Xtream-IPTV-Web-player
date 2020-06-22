function setPlayer($movieVideoLink) {
    if ($(document).find('.PlayerHolder').data('flowplayer') == 'fail' && $(document).find('.PlayerHolder').data('ajplayer') == 'fail' && $(document).find('.PlayerHolder').data('jwplayer') == 'fail') {
        $(document).find('.player_changeIssue').html('Sorry! We cannot Play this Video.');
        $(document).find('#player-holder').html('');
        return;
    } else {

        if ($(document).find('.PlayerHolder').data('flowplayer') == 'fail') {
            set_ajplayer($movieVideoLink);
        } else if ($(document).find('.PlayerHolder').data('jwplayer') == 'fail') {
            set_flowplayer($movieVideoLink);
        } else if ($(document).find('.PlayerHolder').data('ajplayer') == 'fail') {
            set_jwplayer($movieVideoLink);
        }
    }

}

function set_jwplayer($movieVideoLink) {
    $(document).find('#player-holder').removeClass('hideOnLoad');
    $(document).find('.poster-details').addClass('hideOnLoad');
    var player = jwplayer('player-holder');
    // Set up the player with an HLS stream that includes timed metadata



    player.setup({
        "file": $movieVideoLink,
        "width": "100%",
        "aspectratio": "16:9"
    });
    player.on('setupError', function() {

        $(document).find('.PlayerHolder').data('jwplayer', 'fail');

        $(document).find('.player_changeIssue').html('jW Player cannot play this Video Format. Trying to play in Flow player.')
        $(document).find('.player_changeIssue').animate({
            'top': '10px'
        });
        setTimeout(function() {
            $(document).find('.player_changeIssue').animate({
                'top': '-300px'
            });
        }, 3000);

        setPlayer($movieVideoLink);


    })

    player.on('error', function() {
        $(document).find('.PlayerHolder').data('jwplayer', 'fail');

        $(document).find('.player_changeIssue').html('jW Player cannot play this Video Format. Trying to play in Flow player.')
        $(document).find('.player_changeIssue').animate({
            'top': '10px'
        });
        setTimeout(function() {
            $(document).find('.player_changeIssue').animate({
                'top': '-300px'
            });
        }, 3000);


        setPlayer($movieVideoLink);

    })

}



function set_flowplayer($movieVideoLink) {
    var container = document.getElementById("player-holder");
    $(document).find('#player-holder').html('');
    $(document).find('#player-holder').removeClass('hideOnLoad');
    $(document).find('.poster-details').addClass('hideOnLoad');



    // install flowplayer into selected container
    var flowPlayerH = flowplayer(container, {
        autoplay: true,
        aspectRatio: "16:9",
        clip: {
            sources: [{
                type: "video/mp4",
                src: $movieVideoLink
            }]
        }
    });
    flowPlayerH.on("error", function(e, api, err) {

        if (err.code === 2 || err.code === 4) {
            $(document).find('.PlayerHolder').data('flowplayer', 'fail');

            $(document).find('.player_changeIssue').html('Flow Player cannot play this Video Format. Trying to play in AJ player.')
            $(document).find('.player_changeIssue').animate({
                'top': '10px'
            });
            setTimeout(function() {
                $(document).find('.player_changeIssue').animate({
                    'top': '-300px'
                });
            }, 3000);
            setPlayer($movieVideoLink);
        }

    });

};

function set_ajplayer($movieVideoLink) {

    $(document).find('#player-holder').html('');
    $(document).find('#player-holder').removeClass('hideOnLoad');
    $(document).find('.poster-details').addClass('hideOnLoad');
    $(document).find('#player-holder').removeClass('jw-error jw-reset');
    $(document).find('#player-holder').html('<div class="AJPlayerHolder"><video id="AJplayer" class="AJplayer" preload autoplay><source src="' + $movieVideoLink + '" type="video/mp4"></video><div class="AJControls"><div class="buttons"><p class="play"><i class="fa fa-play"></i></p><p class="pause"><i class="fa fa-pause"></i></p><p class="stop"><i class="fa fa-stop"></i></p><p class="fullscreen"><i class="fa fa-expand"></i></p><p class="collapse"><i class="fa fa-compress"></i></p></div><span class="runTime">0.0</span><span class="totalTime">0.0</span><div id="custom-seekbar"><span></span></div></div></div>');
    //var vid = document.getElementById("AJplayer");
    setAJPlayer('AJplayer');
}

function clearInt() {
    if (typeof inT === 'undefined') {

    } else {
        clearInterval(inT);
        clearInterval(init);
    }

}

function setAJPlayer() {
    var vid = document.getElementById("AJplayer");

    var vidTime = '';
    var currentTime = '';


    function getCurTime() {
        return vid.currentTime;
    }

    function getDurTime() {
        return vid.duration;
    }

    function setCurTime() {
        vid.currentTime = 5;
    }

    $(document).find('.fullscreen').click(function() {
        $(document).find('#AJplayer').css('position', 'fixed');
        $(document).find('#AJplayer').css('width', '100%');
        $(document).find('#AJplayer').css('height', '100%');
        $(document).find('.AJControls').css('left', '0px');
        $(document).find('.AJControls').css('position', 'fixed');
        /*$('#AJplayer').parent('div').css('position','fixed');
        $('#AJplayer').parent('div').css('width','100%');
        $('#AJplayer').parent('div').css('height','100%');*/
        $(document).find('#AJplayer').css('top', '0%');
        $(document).find('#AJplayer').css('left', '0%');

        $(document).find('video').removeAttr('controls');

        $(document).find('.collapse').show();
        $(document).find('.fullscreen').hide();
    })

    $(document).find('.collapse').click(function() {
        $(document).find('#AJplayer').css('position', 'relative');
        $(document).find('#AJplayer').css('width', '100%');
        $(document).find('#AJplayer').css('height', 'auto');
        $(document).find('.AJControls').css('left', '0px');
        $(document).find('.AJControls').css('position', 'absolute');

        /*$('#AJplayer').parent('div').css('width','100%');
        $('#AJplayer').parent('div').css('height','auto');*/
        $(document).find('#AJplayer').css('top', '');
        $(document).find('#AJplayer').css('left', '');

        $(document).find('video').removeAttr('controls');

        $(document).find('.collapse').hide();
        $(document).find('.fullscreen').show();
    })
    vid.addEventListener('error', function(event) {
        $(document).find('.PlayerHolder').data('ajplayer', 'fail');
        $(document).find('.player_changeIssue').html('AJ Player cannot play this Video Format. Trying to play in JW player.')
        $(document).find('.player_changeIssue').animate({
            'top': '10px'
        });
        setTimeout(function() {
            $(document).find('.player_changeIssue').animate({
                'top': '-300px'
            });
        }, 3000);
        setPlayer($movieVideoLink);
        clearInterval(init);
        return;
    }, true);
    init = setInterval(function() {

        if (vid.readyState > 0) {

            $(document).find('.buttons').show();

            /*var minutes = parseInt(vid.duration / 60, 10);
            var seconds = vid.duration % 60;*/
            var d, h, m, s;
            s = vid.duration
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            vidTime = h + ':' + m + ':' + Math.floor(s);
            $(document).find('.totalTime').text(vidTime);
            clearInterval(init);
            inT = setInterval(function() {
                var percentage = (vid.currentTime / vid.duration) * 100;

                $(document).find("#custom-seekbar span").css("width", percentage + "%");

                var time = vid.currentTime;

                var d, h, m, s;
                s = time
                m = Math.floor(s / 60);
                s = s % 60;
                h = Math.floor(m / 60);
                m = m % 60;
                d = Math.floor(h / 24);
                h = h % 24;


                currentTime = h + ':' + m + ':' + Math.floor(s);

                $(document).find('.runTime').text(currentTime);

                if (vidTime == currentTime) {
                    vid.currentTime = 0;
                    $(document).find('#AJplayer').trigger('pause');
                    $(document).find('.pause').hide(0);
                    $(document).find('.play').show(0);
                    $(document).find('.runTime').text(currentTime);
                }

            }, 1000);
        }
    }, 1000)

    if (vid.duration == 'NaN') {
        $(document).find('.totalTime').text('0');
        return;
    }
    $(document).find('.play').click(function() {

        $(document).find('#AJplayer').trigger('play');
        $(this).hide(0);
        $(document).find('.pause').show(0);
    })

    $(document).find('.pause').click(function() {
        $(this).hide(0);
        $(document).find('.play').show(0);
        $(document).find('#AJplayer').trigger('pause');
    })

    $(document).find('.stop').click(function() {
        vid.currentTime = 0;
        $(document).find('#AJplayer').trigger('pause');
    })

    $(document).find("#custom-seekbar").on("click", function(e) {
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $(document).find("#custom-seekbar").width();
        var percentage = (left / totalWidth);
        var vidTime = vid.duration * percentage;
        vid.currentTime = vidTime;
    }); //click()

}