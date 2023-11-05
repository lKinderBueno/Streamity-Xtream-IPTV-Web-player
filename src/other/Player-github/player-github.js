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

import {
  CgInpicture
}from 'react-icons/cg';

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

let intervalProgress;

export default function ReactNetflixPlayer({
  title = false,
  subTitle = false,
  titleMedia = false,
  extraInfoMedia = false,

  fullPlayer = true,
  backButton = false,

  src,

  onCanPlay = false,
  onTimeUpdate = false,
  onEnded = false,
  onErrorVideo = false,
  onNextClick = false,
  onClickItemListReproduction = false,
  startPosition = 0,

  playlistTitle = "Playlist",

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
  syncDuration = false,
  // subtitleMedia,
}) {
  // Referências
  const videoComponent = useRef(null);
  const timerRef = useRef(null);
  const timerBuffer = useRef(null);
  const playerElement = useRef(null);
  const listReproduction = useRef(null);
  const progressBar = useRef(null)
  const progressText = useRef(null)
  // Estados
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [end, setEnd] = useState(false);
  const [controlBackEnd, setControlBackEnd] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  const [waitingBuffer, setWaitingBuffer] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [started, setStarted] = useState(false);
  const [pip, setPip] = useState(false);

  const [showControlVolume, setShowControlVolume] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [showDataNext, setShowDataNext] = useState(false);
  const [showPlaybackRate, setShowPlaybackRate] = useState(false);
  const [showReproductionList, setShowReproductionList] = useState(false);

  const playbackRateOptions = ['0.25', '0.5', '0.75', 'Normal', '1.25', '1.5', '2'];


  const [, setActualBuffer] = useState({
    index: 0,
    start: 0,
    end: 0,
  });

  const secondsToHms = d => {
    d = Number(d);
    const h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    if (s < 10) {
      s = `0${s}`;
    }

    if (m < 10) {
      m = `0${m}`;
    }

    if (h) {
      return `${h}:${m}:${s}`;
    }

    return `${m}:${s}`;
  };

  const timeUpdate = e => {
    setShowInfo(false);
    setEnd(false);
    if (playing) {
      setPlaying(true);
    }

    if (waitingBuffer) {
      setWaitingBuffer(false);
    }

    if (timerBuffer.current) {
      clearTimeout(timerBuffer.current);
    }

    timerBuffer.current = setTimeout(() => setWaitingBuffer(true), 1000);

    if (onTimeUpdate) {
      onTimeUpdate(e);
    }

    let choseBuffer = 0;
    const lenghtBuffer = e.target.buffered.length;
    let start = 0;
    let endBuffer = 0;
    const atualTime = e.target.currentTime;

    for (let i = 1; i <= lenghtBuffer; i++) {
      const startCheck = e.target.buffered.start(i - 1);
      const endCheck = e.target.buffered.end(i - 1);

      if (endCheck > atualTime && atualTime > startCheck) {
        choseBuffer = i;

        if (endCheck > endBuffer) {
          endBuffer = endCheck;
        }

        if (startCheck < start) {
          start = startCheck;
        }
      }
    }

    setActualBuffer({
      index: choseBuffer,
      start,
      endBuffer,
    });

    //setProgress(e.target.currentTime)
  };

  const goToPosition = position => {
    videoComponent.current.currentTime = position;
    setProgress(position)
    syncDuration(position, position *100/duration)
  };

  const play = () => {
    setPlaying(!playing);

    if (videoComponent.current.paused) {
      videoComponent.current.play();
      return;
    }

    videoComponent.current.pause();
  };

  const onEndedFunction = () => {
    if (+startPosition === +videoComponent.current.duration && !controlBackEnd) {
      setControlBackEnd(true);
      videoComponent.current.currentTime = videoComponent.current.duration - 30;
      if (true) {
        setPlaying(true);
        videoComponent.current.play();
      } else {
        setPlaying(false);
      }
    } else {
      setEnd(true);
      setPlaying(false);

      if (onEnded) {
        onEnded();
      }
    }
  };

  const nextSeconds = seconds => {
    const current = videoComponent.current.currentTime;
    const total = videoComponent.current.duration;

    if (current + seconds >= total - 2) {
      videoComponent.current.currentTime = videoComponent.current.duration - 1;
      setProgress(videoComponent.current.duration - 1)

      return;
    }

    videoComponent.current.currentTime += seconds;
    //setProgress(videoComponent.current.currentTime + seconds)
  };

  const previousSeconds = seconds => {
    const current = videoComponent.current.currentTime;

    if (current - seconds <= 0) {
      videoComponent.current.currentTime = 0;
      setProgress(0)
      return;
    }

    videoComponent.current.currentTime -= seconds;
    //setProgress(videoComponent.current.currentTime - seconds)
  };

  const startVideo = () => {
    try {
      setDuration(videoComponent.current.duration);
      setVideoReady(true);

      if (!started) {
        setStarted(true);
        setPlaying(false);

        if (true) {
          videoComponent.current.play();
          setPlaying(!videoComponent.current.paused);
        }
      }

      if (onCanPlay) {
        onCanPlay();
      }
    } catch (err) {
      setPlaying(false);
    }
  };

  const erroVideo = () => {
    if (onErrorVideo) {
      onErrorVideo();
    }
    setError('Something went wrong playing this video');
  };

  const setMuttedAction = value => {
    setMuted(value);
    setShowControlVolume(false);
    videoComponent.current.muted = value;
  };

  const setVolumeAction = value => {
    setVolume(value);
    videoComponent.current.volume = value / 100;
  };

  const exitFullScreen = () => {
    if (
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.fullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitExitFullscreen();
      }

      setFullScreen(false);
    }
  };

  const enterFullScreen = () => {
    setShowInfo(true);
    if (playerElement.current.requestFullscreen) {
      playerElement.current.requestFullscreen();
      setFullScreen(true);
    } else if (playerElement.current.webkitRequestFullscreen) {
      playerElement.current.webkitRequestFullscreen();
      setFullScreen(true);
    }
  };

  const chooseFullScreen = () => {
    if (
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.fullscreenElement
    ) {
      document.exitFullscreen();
      return;
    }

    setShowInfo(true);

    if (playerElement.current.requestFullscreen) {
      playerElement.current.requestFullscreen();
    } else if (playerElement.current.webkitRequestFullscreen) {
      playerElement.current.webkitRequestFullscreen();
    } else if (playerElement.current.mozRequestFullScreen) {
      playerElement.current.mozRequestFullScreen();
    } else if (playerElement.current.msRequestFullscreen) {
      playerElement.current.msRequestFullscreen();
    }

    setFullScreen(true);
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
    if(intervalProgress)
      return;
    setShowControls(true);
    setShowInfo(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(intervalProgress)
      if(progressText.current)
        progressText.current.innerText = secondsToHms(videoComponent.current.currentTime)
      if(progressBar.current){
        progressBar.current.value = videoComponent.current.currentTime;
        syncDuration(progressBar.current.value, progressBar.current.value*100/duration)
        progressBar.current.style.background =  "linear-gradient(to right,  var(--second-color) 0%,var(--second-color) "+ (progressBar.current.value*100/duration) +"%,#191919 "+ (progressBar.current.value*100/duration) +"%,#191919 100%)";
      };
    }

   

    intervalProgress = setInterval(()=>{
      if(progressText.current)
        progressText.current.innerText = secondsToHms(videoComponent.current.currentTime)
      if(progressBar.current){
        progressBar.current.value = videoComponent.current.currentTime;
        progressBar.current.style.background =  "linear-gradient(to right,  var(--second-color) 0%,var(--second-color) "+ (progressBar.current.value*100/duration) +"%,#191919 "+ (progressBar.current.value*100/duration) +"%,#191919 100%)";
      };
    },800)


    timerRef.current = setTimeout(()=>{
      controllScreenTimeOut();
      clearInterval(intervalProgress)
      intervalProgress = null;
    }, 5000);
  };

  const getKeyBoardInteration = e => {
    if (e.keyCode === 32 && videoComponent.current) {
      if (videoComponent.current.paused) {
        videoComponent.current.play();
        setPlaying(true);
        hoverScreen();
      } else {
        videoComponent.current.pause();
        setPlaying(false);
        hoverScreen();
      }
    }else if (e.keyCode === 37 && videoComponent.current) {
      previousSeconds(20);
    }else if (e.keyCode === 39 && videoComponent.current) {
      nextSeconds(20)
    }
  };

  const scrollToSelected = () => {
    const element = listReproduction.current;
      const selected = element.getElementsByClassName('selected')[0];
      if(selected){
        const position = selected.offsetTop;
        const height = selected.offsetHeight;
        element.scrollTop = position - height * 2;
      }
  };

  const onChangePlayBackRate = speed => {
    speed = speed === 'Normal' ? 1 : speed;
    videoComponent.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  useEffect(() => {
    if (showReproductionList) {
      scrollToSelected();
    }
  }, [showReproductionList]);

  useEffect(() => {
    async function goPip(){
      if (videoComponent && videoComponent.current) {
        try {
          if (videoComponent.current !== document.pictureInPictureElement)
            await videoComponent.current.requestPictureInPicture();
          else
            await videoComponent.current.exitPictureInPicture();
        } catch (error) {
          console.log("Can't get PIP ", error)
        }
      }
    } 
    goPip();
  }, [pip])

  useEffect(() => {
    if (src) {
      videoComponent.current.currentTime = startPosition;
      progressBar.current && (progressBar.current.value = 0);
      setDuration(0);
      setVideoReady(false);
      setError(false);
      setShowReproductionList(false);
      setShowDataNext(false);
      setActualBuffer({
        index: 0,
        start: 0,
        end: 0,
      });
      setPlaying(true);
    }
  }, [src]);

  useEffect(() => {
    document.addEventListener('keydown', getKeyBoardInteration, false);
    playerElement.current.addEventListener('fullscreenchange', setStateFullScreen, false);
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
            <FiX onClick={backButton} />
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
    <Container
      onMouseMove={hoverScreen}
      ref={playerElement}
      onDoubleClick={chooseFullScreen}
      fullPlayer={fullPlayer}
      hideVideo={!!error}
      fontFamily={fontFamily}
    >
      {(videoReady === false || (waitingBuffer === true && playing === true)) && !error && !end && renderLoading()}

      {!!overlayEnabled && renderInfoVideo()}

      {renderCloseVideo()}

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoComponent}
        src={src}
        controls={false}
        onCanPlay={() => startVideo()}
        onTimeUpdate={timeUpdate}
        onError={erroVideo}
        onEnded={onEndedFunction}
        onPause={() => setPlaying(false)}
        onPlaying={() => setPlaying(true)}
      >
        {/* <track label="English" kind="subtitles" srcLang="en" src={subtitleMedia} default /> */}
      </video>

      <Controlls
        show={showControls === true && videoReady === true && error === false}
        primaryColor={primaryColor}
        progressVideo={(progress * 100) / duration}
      >
        {backButton && (
          <div className="back">
            <div onClick={backButton} style={{ cursor: 'pointer' }}>
              <FaArrowLeft />
              <span>Go Back</span>
            </div>
          </div>
        )}

        {showControlVolume !== true && showQuality !== true && !showDataNext && !showReproductionList && (
          <div className="line-reproduction">
            <span className="mr-1" ref={progressText}></span>
            <input
              type="range"
              ref = {progressBar}
              className="progress-netflix"
              max={duration}
              onChange={e => goToPosition(e.target.value)}
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
            <span>{secondsToHms(duration)}</span>
          </div>
        )}

        {videoReady === true && (
          <div className="controlls">
            <div className="start">
              <div className="item-control">
                {!playing && <FaPlay onClick={play} />}
                {playing && <FaPause onClick={play} />}
              </div>

              <div className="item-control">
                <FaUndoAlt onClick={() => previousSeconds(20)} />
              </div>

              <div className="item-control">
                <FaRedoAlt onClick={() => nextSeconds(20)} />
              </div>

              {muted === false && (
                <VolumeControll
                  onMouseLeave={() => setShowControlVolume(false)}
                  className="item-control"
                  primaryColor={primaryColor}
                  percentVolume={volume}
                >
                  {showControlVolume === true && (
                    <div className="volumn-controll">
                      <div className="box-connector" />
                      <div className="box">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={volume}
                          step={1}
                          onChange={e => setVolumeAction(e.target.value)}
                          title=""
                        />
                      </div>
                    </div>
                  )}

                  {volume >= 60 && (
                    <FaVolumeUp onMouseEnter={() => setShowControlVolume(true)} onClick={() => setMuttedAction(true)} />
                  )}

                  {volume < 60 && volume >= 10 && (
                    <FaVolumeDown
                      onMouseEnter={() => setShowControlVolume(true)}
                      onClick={() => setMuttedAction(true)}
                    />
                  )}

                  {volume < 10 && volume > 0 && (
                    <FaVolumeOff
                      onMouseEnter={() => setShowControlVolume(true)}
                      onClick={() => setMuttedAction(true)}
                    />
                  )}

                  {volume <= 0 && (
                    <FaVolumeMute onMouseEnter={() => setShowControlVolume(true)} onClick={() => setVolumeAction(0)} />
                  )}
                </VolumeControll>
              )}

              {muted === true && (
                <div className="item-control">
                  <FaVolumeMute onClick={() => setMuttedAction(false)} />
                </div>
              )}

              <div className="item-control info-video">
                <span className="info-first">{titleMedia}</span>
                <span className="info-secund">{extraInfoMedia}</span>
              </div>
            </div>

            <div className="end">
              {!!playbackRateEnable && (
                <div className="item-control" onMouseLeave={() => setShowPlaybackRate(false)}>
                  {showPlaybackRate === true && (
                    <ItemPlaybackRate>
                      <div>
                        <div className="title">Speed</div>
                        {playbackRateOptions.map(item => (
                          <div className="item" onClick={() => onChangePlayBackRate(item)}>
                            {(+item === +playbackRate || (item === 'Normal' && +playbackRate === 1)) && FiCheck()}
                            <div className="bold">{item === 'Normal' ? item : `${item}x`}</div>
                          </div>
                        ))}
                      </div>
                      <div className="box-connector" />
                    </ItemPlaybackRate>
                  )}

                  <IconPlayBackRate className="playbackRate" onMouseEnter={() => setShowPlaybackRate(true)}>
                    <span>
                      {playbackRate === 'Normal' ? '1' : `${playbackRate}`}
                      <small>x</small>
                    </span>
                  </IconPlayBackRate>
                </div>
              )}

              {onNextClick && (
                <div className="item-control" onMouseLeave={() => setShowDataNext(false)}>
                  {showDataNext === true && dataNext.title && (
                    <ItemNext>
                      <div>
                        <div className="title">Next Episode</div>
                        <div className="item" onClick={onNextClick}>
                          <div className="bold">{dataNext.title}</div>
                          {dataNext.description && <div>{dataNext.description}</div>}
                        </div>
                      </div>
                      <div className="box-connector" />
                    </ItemNext>
                  )}

                  <FaStepForward onClick={onNextClick} onMouseEnter={() => setShowDataNext(true)} />
                </div>
              )}

              <div className="item-control" onMouseLeave={() => setShowReproductionList(false)}>
                {showReproductionList && (
                  <ItemListReproduction>
                    <div>
                      <div className="title">{playlistTitle}</div>
                      <div ref={listReproduction} className="list-list-reproduction scroll-clean-player">
                        {reprodutionList.map((item, index) => (
                          <div
                            className={`item-list-reproduction ${item.playing && 'selected'}`}
                            onClick={() =>
                              onClickItemListReproduction && onClickItemListReproduction(item.id, item.playing)
                            }
                          >
                            <div className="bold">
                              <span style={{ marginRight: 15 }}>{index + 1}</span>
                              {item.name}
                            </div>

                            {item.percent && <div className="percent" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="box-connector" />
                  </ItemListReproduction>
                )}
                {reprodutionList && reprodutionList.length > 1 && (
                  <FaClone onMouseEnter={() => setShowReproductionList(true)} />
                )}
              </div>

              {qualities && qualities.length > 1 && (
                <div className="item-control" onMouseLeave={() => setShowQuality(false)}>
                  {showQuality === true && (
                    <ItemListQuality>
                      <div>
                        {qualities &&
                          qualities.map(item => (
                            <div
                              onClick={() => {
                                setShowQuality(false);
                                onChangeQuality(item.id);
                              }}
                            >
                              {item.prefix && <span>HD</span>}

                              <span>{item.nome}</span>
                              {item.playing && <FiCheck />}
                            </div>
                          ))}
                      </div>
                      <div className="box-connector" />
                    </ItemListQuality>
                  )}

                  <FaCog onMouseEnter={() => setShowQuality(true)} />
                </div>
              )}

              <div className="item-control">    
                <CgInpicture onClick={()=> setPip(!pip)}/>
              </div>

              <div className="item-control">
                {fullScreen === false && <FaExpand onClick={enterFullScreen} />}
                {fullScreen === true && <FaCompress onClick={exitFullScreen} />}
              </div>
            </div>
          </div>
        )}
      </Controlls>
    </Container>
  );
}