import React, { useState, useEffect, useRef} from 'react'
import styled from "styled-components"
import ChannelEpgBar from "./ChannelEpgBar"
import {getSingleEpgNow, downloadEpgData} from "../../other/epg-database"
import {useSelector} from "react-redux"

const dateFormat = require("dateformat");

const EpgChName = styled.div`
    position: absolute;
    background-image: linear-gradient(to bottom, #212121 -70% , transparent);
    top:0;
    left:0;
    width:100%;
    height:40%;
    z-index:1000000000000000000000;

    & > div{
        padding-top: 2%;
        padding-bottom: 3%;
        position: relative;
        width: 70%;
        left: 15%;
    } `;

const EpgInfoBox = styled.div`
    position: absolute;
    background-image: linear-gradient(to top, #212121 0% , transparent);
    height:47%;

    & > div{
        padding-bottom: 5%;
        padding-top: 10%;
        position: relative;
        width: 70%;
        left: 15%;
    } `;

const Title = styled.h2`
-webkit-line-clamp: 1;
overflow: hidden;
/*word-wrap: break-word;
word-break: break-all;*/
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
`

const Description = styled.h4`
font-weight: 100;
overflow-wrap: break-word;
overflow: hidden;
-webkit-line-clamp: 5;
max-height: 30%;
/*word-wrap: break-word;
word-break: break-all;*/
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
`

const MainDiv = styled.div`
width: 100%;
height: 100%;
position: absolute;
top:0;
left:0;
color: white;
overflow: hidden;

& > div{
    width: 100%;
    transition: bottom .5s ease 0s, top .5s ease 0s;
}
&:focus{
    outline-width: 0px;
}
`

const StopTime = styled.label`
right: 0;
position: absolute;
`

const Logo = styled.div`
/*background: #203d79;*/
padding: .1rem .1rem;
border-radius: .2rem;
text-align: center;
width: 100%;
font-weight: bold;
min-height: 2.4rem;
max-height: 2.4rem;

&>img{
    max-height: 2.2rem;
    height: auto;
    width: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
`

const FullscreenMag = ({externalShow, cTitle, cDesc, cDuration}) => {
    const EpgChNameRef = useRef(0);
    const EpgInfoBoxRef = useRef(0);
    const mainRef = useRef(null);

    const playingChannel = useSelector(state => state.playingCh);
    const Epg = playingChannel && !cTitle && (playingChannel.epg_channel_id);
    const Shift = playingChannel && (playingChannel.shift);
    const chId = playingChannel && (playingChannel.stream_id);

    const timer = useSelector(state => state.timer5);
    const h24Format = useSelector(state => state.h24);

    const [epgNow, setEpgNow] = useState(cDuration ? {
        title : cTitle,
        description: cDesc
    } : false);

    
    const title = epgNow && epgNow.start ? epgNow.title : ""
    const description = epgNow && epgNow.start ? epgNow.description : ""
    const start = epgNow && epgNow.start ? dateFormat(new Date(epgNow.start), h24Format) : ""
    const stop = epgNow && epgNow.start ? dateFormat(new Date(epgNow.end), h24Format) : ""

    /*const remoteController = (event) => {
        if(event.keyCode === 27 || event.keyCode === 8){
            //dispatch(setFullScreen(false));
            clearTimeout(showOverlay);
            history.replace(location.pathname.split("fullscreen")[0])
            setTimeout(function () {
                document.getElementById("selectedCh") && (document.getElementById("selectedCh").focus());
            }, 100);
        }else if(event.keyCode === 107 || event.keyCode === 109){
            dispatch(setVolume(event.keyCode === 107))
        }else{
            clearTimeout(showOverlay);
            EpgInfoBoxRef.current && (EpgInfoBoxRef.current.style.bottom = "0px");
            EpgChNameRef.current && (EpgChNameRef.current.style.top = "0px");
            
            showOverlay = setTimeout(function () {
                EpgInfoBoxRef.current && (EpgInfoBoxRef.current.style.bottom = "-50%");
                EpgChNameRef.current && (EpgChNameRef.current.style.top = "-40%");
            }, 6000);
        }
    }*/

    useEffect(()=>{
        if(externalShow){
            EpgInfoBoxRef.current && (EpgInfoBoxRef.current.style.bottom = "0px");
            EpgChNameRef.current && (EpgChNameRef.current.style.top = "0px");
        }else{
            EpgInfoBoxRef.current && (EpgInfoBoxRef.current.style.bottom = "-50%");
            EpgChNameRef.current && (EpgChNameRef.current.style.top = "-40%");
        }
    },[externalShow])

    useEffect(()=>{
        if(!Epg || cDuration)
            return;
        async function fetchData(){
            await downloadEpgData(chId, Epg, 1, Shift);
            const newEpg = getSingleEpgNow(Epg,Shift);
            if(!newEpg)
                setEpgNow(false);
            else if(newEpg && (epgNow === false || epgNow.start !== newEpg.start)){
                setEpgNow({...newEpg});
            } 
        }
        
        fetchData()
    },[playingChannel]);

    useEffect(() => {
        if(cDuration)
            return;
        const newEpg = getSingleEpgNow(Epg,Shift);
        if(!newEpg)
            setEpgNow(false);
        else if(newEpg && (epgNow === false || epgNow.start !== newEpg.start)){
            setEpgNow({...newEpg});
        } 
    }, [timer, Epg, Shift, cDuration, epgNow]);

    return (
        <MainDiv tabIndex={0} ref={mainRef}>
            <EpgChName ref={EpgChNameRef} style={{top : "-40%"}}>
                <div className="row">
                    <div className="col-3">
                        <Logo>
                            <img src={playingChannel && (playingChannel.stream_icon)} loading={"lazy"} /*onError={()=>{this.onerror=null;this.src='../images/nologo.png?1'}} */ align="middle" alt="" />
                        </Logo>
                    </div>
                    <div className="col-auto">
                        <h2>{playingChannel && (playingChannel.name)}</h2> 
                    </div>
                </div>
            </EpgChName>
            <EpgInfoBox ref={EpgInfoBoxRef} style={{bottom : "-50%", display : !epgNow.start && ("none")}}>
                <div>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                    <label>{start}</label>
                    <StopTime>{stop}</StopTime>
                    {epgNow.start ?
                    (<ChannelEpgBar key={playingChannel && (playingChannel.epg_channel_id)+ " " +epgNow.start} start={epgNow.start} stop={epgNow.end}/>)
                    :
                    <ChannelEpgBar />
                    }
                </div>
            </EpgInfoBox>
        </MainDiv>
    )
}

export default FullscreenMag
