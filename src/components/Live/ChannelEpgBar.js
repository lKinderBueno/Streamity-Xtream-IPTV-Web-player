import React,{useEffect, useRef } from 'react'
import styled from "styled-components"
import {useSelector} from "react-redux"


const ProgressEpg = styled.div`
display: flex;
height: .2rem;
overflow: hidden;
font-size: .75rem;
background-color: black;
`

const ProgressBar = styled.div`
display: -ms-flexbox;
display: flex;
-ms-flex-direction: column;
flex-direction: column;
-ms-flex-pack: center;
justify-content: center;
overflow: hidden;
color: #fff;
text-align: center;
white-space: nowrap;
transition: width .6s ease;
`

const ChannelEpgBar = ({start,stop, isPlaying}) => {
    const timer = useSelector(state => state.timer5);

    const progress = useRef(0);
    const progressEpgStyle = !start ? {
        visibility: "hidden",
        paddingTop: ".2rem"
    } : {};

    const ProgressBarStyle = isPlaying ? {
        backgroundColor: "#fff",
        border: "1px solid #829196"
    } : {
        backgroundColor: "#829196"
    };
    ProgressBarStyle.width = (start ? ((timer-start)/(stop-start))*100 + "%" : 0);

    useEffect(() => {
        if(start)
            progress.current && (progress.current.style.width = ((timer-start)/(stop-start))*100 + "%");
        else progress.current && (progress.current.style.width = 0);
    }, [isPlaying,timer,start,stop]);

    return (
        <ProgressEpg style={progressEpgStyle}>
            <ProgressBar role="progressbar" ref={progress} style={ProgressBarStyle} className={"progressBar"}></ProgressBar>
        </ProgressEpg>
    )
}

export default ChannelEpgBar
