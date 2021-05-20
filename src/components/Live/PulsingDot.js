import React from 'react'
import styled from "styled-components"

/*
const Pulse = styled.div`
border: .3rem solid #62bd19;
-webkit-border-radius: 99rem;
height: 2rem;
width: 2rem;
position: absolute;
left: -0.55rem;
top: -.5rem;
-webkit-animation: pulsate 1s ease-out;
-webkit-animation-iteration-count: infinite; 
opacity: 0.0;

@keyframes pulsate {
0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
50% {opacity: 1.0;}
100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
}
`*/

const Circle = styled.div`
content: "";
top: calc(50%);
display: inline-block;
height: .7rem;
width: .7rem;
border-radius: 50%;
background-color: #b9b9b9;
`


const PulsingDot = ({isPlaying}) => {

    const CircleStyle = {backgroundColor: isPlaying ? "#54ca28" : "b9b9b9"};

    return (
        <div className={isPlaying ? "mr-1" : "mr-2 ml-2"} >
            {isPlaying ? <img style={{height:"1.5rem"}} src="/img/dot.gif" alt=""></img> :  <Circle style={CircleStyle}/>}
        </div>
    )
}

export default PulsingDot
