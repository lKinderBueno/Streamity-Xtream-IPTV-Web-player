import styled from 'styled-components'
import {useSelector} from "react-redux"
import React from "react"

const dateFormat = require("dateformat");

const Container = styled.div`
z-index: 10000000000000;
top: 1.3875rem;
    position: absolute;
    left: 0;
    height: 35px;

& > div{
    top: 1.1.3875rem;
    position: absolute;
    left: 0;
    height: 35px;
}
`
const Button = styled.button`
width: 81px;
padding: .25rem 1.5rem;
text-align: center;
color: #fff;
background-color: #064497;
border-radius: 1.875rem;
font-size: .875rem;
white-space: nowrap;
border: none;
width: 5rem;
height: 2rem;
margin: 0;
pointer-events: auto;
`

const Line = styled.div`
background: #064497;
height: 2.5rem;
pointer-events: none;
margin: 0 auto;
width: 0.1rem;

`

const TimeBarIndicator = () => {
    const timer = useSelector(state => state.timer60);
    const h24Format = useSelector(state => state.h24);
    const date = new Date(timer);
    const length = -1+(date.getHours()*17) + (date.getMinutes()*0.25);

    return (
        <Container>
            <div style={{transform: `translateX(calc(${length}rem - 3.55rem))`}}>
                <Button><span>{dateFormat(date, h24Format)}</span></Button>
                <Line/>
            </div>
        </Container>
    )
}

export default TimeBarIndicator
