import React, { useEffect, useState, useRef } from 'react';
import {
  FaUndoAlt,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeOff,
  FaVolumeMute,
  FaArrowLeft,
  FaExpand,
  FaStepForward,
  FaCog,
  FaClone,
  FaCompress,
  FaRedoAlt,
} from 'react-icons/fa';
import { FiCheck, FiX } from 'react-icons/fi';
import {
  Loading,
  StandyByInfo,
  VideoPreLoading,
  Container,
  Controlls,
  VolumeControll,
  ItemPlaybackRate,
  IconPlayBackRate,
  ItemNext,
  ItemListReproduction,
  ItemListQuality,
} from './style';
import "./style.css"

import {initStb, stbMovePosition, stbPlaying, stbVolume, stbFullScreen, stbPlayStream, stbPause, stbGetDuration, stbPosition, stbPositionPercent} from "../../other/stb"
import {useDispatch} from "react-redux"
import {setVolume} from "../../actions/volume"
import { useHistory } from 'react-router';


let interval,timeoutLoading, intervalProgress;

export default function ReactNetflixPlayer({
  title = false,
  subTitle = false,
  titleMedia = false,
  extraInfoMedia = false,

  fullPlayer = true,
  backButton = false,

  src,
  autoPlay = false,

  onCanPlay = false,
  onTimeUpdate = false,
  onEnded = false,
  onErrorVideo = false,
  onNextClick = false,
  onClickItemListReproduction = false,
  onCrossClick = () => {},
  startPosition = 0,

  dataNext = {},
  reprodutionList = [],
  qualities = [],
  onChangeQuality = [],
  playbackRateEnable = true,
  overlayEnabled = true,
  autoControllCloseEnabled = true,

  // Styles
  primaryColor = '#03dffc',
  secundaryColor = '#ffffff',
  fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",

  // subtitleMedia,
}) {
  // Referências
  const timerRef = useRef(null);
  const timerBuffer = useRef(null);
  const playerElement = useRef(null);
  const listReproduction = useRef(null);
  const progressBar = useRef(null);

  // Estados
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressText = useRef(null)

  const [duration, setDuration] = useState(0);
  const [end, setEnd] = useState(false);
  const [controlBackEnd, setControlBackEnd] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  const [waitingBuffer, setWaitingBuffer] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [started, setStarted] = useState(false);

  const [showControlVolume, setShowControlVolume] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [showDataNext, setShowDataNext] = useState(false);
  const [showPlaybackRate, setShowPlaybackRate] = useState(false);
  const [showReproductionList, setShowReproductionList] = useState(false);
  
  const dispatch = useDispatch()
  const history = useHistory()

  const secondsToHms = d => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    if (s < 10) {
      s = `0${s}`;
    }

    if (h) {
      return `${h}:${m}:${s}`;
    }

    return `${m}:${s}`;
  };


  const goToPosition = position => {
    ////videoComponent.current.currentTime = position;
    setProgress(position);
  };

  const play = () => {
    setPlaying(!playing);
/*
    if (videoComponent.current.paused) {
      //videoComponent.current.play();
      return;
    }*/

    //videoComponent.current.pause();
  };

  const onEndedFunction = () => {
    /*
    if (+startPosition === +duration && !controlBackEnd) {
      setControlBackEnd(true);
      //videoComponent.current.currentTime = duration - 30;
      if (autoPlay) {
        setPlaying(true);
        //videoComponent.current.play();
      } else {
        setPlaying(false);
      }
    } else {
      setEnd(true);
      setPlaying(false);

      if (onEnded) {
        onEnded();
      }
    }*/
  };

  const nextSeconds = seconds => {
    const current = 0//videoComponent.current.currentTime;
    const total = 1000;
    const duration = 999
    /*;
    if (current + seconds >= total - 2) {
      //videoComponent.current.currentTime = duration - 1;
      setProgress(duration - 1);
      return;
    }

    //videoComponent.current.currentTime += seconds;
    setProgress(//videoComponent.current.currentTime + seconds);*/
  };

  const previousSeconds = seconds => {
    /*const current = //videoComponent.current.currentTime;

    if (current - seconds <= 0) {
      //videoComponent.current.currentTime = 0;
      setProgress(0);
      return;
    }

    //videoComponent.current.currentTime -= seconds;
    setProgress(//videoComponent.current.currentTime - seconds);*/
  };

  const startVideo = () => {
    try {
      setDuration(duration);
      setVideoReady(true);

      if (!started) {
        setStarted(true);
        setPlaying(false);

        if (autoPlay) {
          //videoComponent.current.play();
          setPlaying(/*!//videoComponent.current.paused*/);
        }
      }

      if (onCanPlay) {
        onCanPlay();
      }
    } catch (err) {
      setPlaying(false);
    }
  };


  const setStateFullScreen = () => {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement &&
      !document.fullscreenElement
    ) {
      setFullScreen(false);
      return;
    }

    setFullScreen(true);
  };

  const controllScreenTimeOut = () => {
    if (!autoControllCloseEnabled) {
      setShowInfo(true);
      return;
    }

    setShowControls(false);
    if (!playing) {
      setShowInfo(true);
    }
  };

  const hoverScreen = () => {
    setShowControls(true);
    setShowInfo(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(intervalProgress)

      if(progressText.current)
        progressText.current.innerText = stbPosition()
      if(progressBar.current){
        progressBar.current.value = stbPositionPercent();
        progressBar.current.style.background =  "linear-gradient(to right,  var(--second-color) 0%,var(--second-color) "+ stbPositionPercent() +"%,#191919 "+ stbPositionPercent() +"%,#191919 100%)";
      };
    }

    intervalProgress = setInterval(()=>{
      if(progressText.current)
        progressText.current.innerText = stbPosition()
      if(progressBar.current){
        progressBar.current.value = stbPositionPercent();
        progressBar.current.style.background =  "linear-gradient(to right,  var(--second-color) 0%,var(--second-color) "+ stbPositionPercent() +"%,#191919 "+ stbPositionPercent() +"%,#191919 100%)";
      };
    },1000)

    timerRef.current = setTimeout(()=>{
      controllScreenTimeOut();
      clearInterval(intervalProgress)
    }, 5000);
  };

  const getKeyBoardInteration = e => {
    if (e.keyCode === 13 || e.keyCode === 45 || e.keyCode === 82 || e.keyCode === 83) {
      if (stbPlaying() !== 2) {
        stbPause(false);
        setPlaying(true);
        hoverScreen();
      } else {
        stbPause(true);
        setPlaying(false);
        hoverScreen();
      }
    }else if ((e.keyCode === 37 || e.keyCode === 66) && stbPlaying() == 2) {
      stbMovePosition(-30);
      hoverScreen();
    }else if ((e.keyCode === 39 || e.keyCode === 70) && stbPlaying() == 2) {
      stbMovePosition(30)
      hoverScreen();
    }else if(e.keyCode === 107 || e.keyCode === 109){
      dispatch(setVolume(e.keyCode === 107))
    }else if(e.keyCode === 27 || e.keyCode === 8)
      history.goBack()
    else hoverScreen();
  };

  const scrollToSelected = () => {
    const element = listReproduction.current;
    const selected = element.getElementsByClassName('selected')[0];
    const position = selected.offsetTop;
    const height = selected.offsetHeight;
    element.scrollTop = position - height * 2;
  };

  const onChangePlayBackRate = speed => {
    speed = speed === 'Normal' ? 1 : speed;
    //videoComponent.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  useEffect(() => {
    if (showReproductionList) {
      scrollToSelected();
    }
  }, [showReproductionList]);


  useEffect(() => {
    initStb();
    stbVolume(0)
    stbFullScreen(1);
    document.addEventListener('keydown', getKeyBoardInteration, false);
    playerElement.current.addEventListener('fullscreenchange', setStateFullScreen, false);

    clearInterval(interval);
    clearTimeout(timeoutLoading);

    if (src) {
      setProgress(0);
      setDuration(0);
      setVideoReady(false);
      setError(false);
      setShowReproductionList(false);
      setShowDataNext(false);
      setPlaying(autoPlay);
      stbPlayStream(src)

      interval = setInterval(()=>{
      if(stbPlaying()>1){
        clearInterval(interval);
        clearTimeout(timeoutLoading);
        setVideoReady(true)
        setShowInfo(false)
        setShowControls(false)
        hoverScreen();
        setDuration(stbGetDuration());
      }
    },1000)

    timeoutLoading = setTimeout(()=>{
      clearInterval(interval)
      setError(true)
    },10000)

    }
  }, []);

  // When changes happen in fullscreen document, teh state of fullscreen is changed
  useEffect(() => {
    setStateFullScreen();
  }, [document.fullscreenElement, document.webkitIsFullScreen, document.mozFullScreen, document.msFullscreenElement]);

  function renderLoading() {
    return (
      <Loading color={primaryColor}>
        <div>
          <div />
          <div />
          <div />
        </div>
      </Loading>
    );
  }

  function renderInfoVideo() {
    return (
      <StandyByInfo
        primaryColor={primaryColor}
        secundaryColor={secundaryColor}
        show={showInfo === true && videoReady === true && playing === false}
      >
        {(title || subTitle) && (
          <section className="center">
            <h3 className="text">You're watching</h3>
            <h1 className="title">{title}</h1>
            <h2 className="sub-title">{subTitle}</h2>
          </section>
        )}
        <footer>Paused</footer>
      </StandyByInfo>
    );
  }

  function renderCloseVideo() {
    return (
      <VideoPreLoading
        backgroundColorHoverButtonError="#f78b28"
        colorHoverButtonError="#ddd"
        colorButtonError="#ddd"
        backgroundColorButtonError="#333"
        colorTitle="#fff"
        colorSubTitle="#fff"
        colorIcon="#fff"
        show={videoReady === false || (videoReady === true && error)}
        showError={!!error}
      >
        {(title || subTitle) && (
          <header>
            <div>
              <h1>{title}</h1>
              <h2>{subTitle}</h2>
            </div>
            <FiX onClick={onCrossClick} />
          </header>
        )}

        <section>
          {error && (
            <div>
              <h1>{error}</h1>
              {qualities.length > 1 && (
                <div>
                  <p>Try changing the image quality</p>
                  <div className="links-error">
                    {qualities.map(item => (
                      <div onClick={() => onChangeQuality(item.id)}>
                        {item.prefix && <span>HD</span>}
                        <span>{item.nome}</span>
                        {item.playing && <FiX />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </VideoPreLoading>
    );
  }

  return (
    <Container style={{backgroundColor:"transparent"}}
      ref={playerElement}
      hideVideo={!!error}
      fontFamily={fontFamily}
    >
      {(videoReady === false || (waitingBuffer === true && playing === true)) && !error && !end && renderLoading()}

      {!!overlayEnabled && renderInfoVideo()}

      {renderCloseVideo()}

      <Controlls   style={{backgroundColor:"transparent"}}
        show={showControls === true && videoReady === true && error === false}
        primaryColor={primaryColor}
        progressVideo={progress}
      >

        <div className="line-reproduction">
          <span className="mr-1" ref={progressText}></span>
          <input
            type="range"
            ref = {progressBar}
            className="progress-netflix"
            min={0}
            max={100}
            title=""
            style={
              {
                // background: `linear-gradient(93deg, rgba(247,139,40,1) ${
                //   (progress * 100) / duration
                // }%, blue ${
                //   (progress * 100) / duration
                // }%, blue ${
                //   (atualBuffer.end * 100) / duration
                // }%, red ${
                //   (atualBuffer.end * 100) / duration
                // }%)`,
              }
            }
          />
          <span>{duration}</span>
        </div>

        {videoReady === true && (
          <div className="controlls">
            <div className="start">
              <div className="item-control">
                {!playing && <FaPlay onClick={play} />}
                {playing && <FaPause onClick={play} />}
              </div>

              <div className="item-control info-video">
                <span className="info-first">{titleMedia}</span>
                <span className="info-secund">{extraInfoMedia}</span>
              </div>
            </div>

          </div>
        )}
      </Controlls>
    </Container>
  );
}