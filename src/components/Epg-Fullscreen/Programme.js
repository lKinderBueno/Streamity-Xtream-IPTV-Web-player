import React from 'react'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from "react-redux"
import {setEpgPopup} from "../../actions/epgPopup"

const dateFormat = require("dateformat");

const Container = styled.li`
position: absolute;
left: 0;
height: 100%;
background-color: #fff;
transition: all 0.3s ease 0s;

&:hover, &:focus{
    /*z-index: 2;
    width: fit-content !important;
    max-width: 600px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;*/
    outline-width: 0px;
}

&:focus{
    border: 1px solid #0071ff;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 6%);
    outline-width: 0px;
    border-radius: .25rem;
}

& > div{
    text-align: initial;
    position: relative;
    color: #303030;
    background-color: #f0f0f0;
    margin-right: 2px;
    margin-left: 2px;
    height: 100%;
    border-radius: .25rem;
    transition: all 0.3s ease 0s;


    &:hover, &:focus{
        cursor: pointer;
        border: 1px solid #0071ff;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 6%);
        outline-width: 0px;
    }
}

& > div > div{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100%;
}
`
const BodyData = styled.div`
padding: 1rem 1.5rem;
height: 100%;

text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
`

const Title = styled.div`
margin: 0;
font-size: 1rem;
font-weight: 500;
line-height: 1.125rem;

text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
`

const Description = styled.div`
padding-top: .25rem;
font-size: .875rem;
max-width: 500px;
flex-wrap: nowrap!important;

text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
`

const Time = styled.div`
padding-top: .75rem;
font-size: .875rem;

text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
`
const ProgressBar = styled.div`
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
`

const Progress = styled.div`
background: repeating-linear-gradient(45deg,rgba(0,0,0,.5),rgba(0,0,0,.5) 1px,#b4c6df 1px,#b4c6df 7px);
opacity: .2;
height: 100%;
`

const isActive = {
    color: "#fff",
    backgroundColor: "#064497"
}

const Programme = ({start, stop, title, description, dayTime, chId, liveTime, catchup}) => {
    const dispatch = useDispatch();

    const timer = useSelector(state => state.timer60);
    const h24Format = useSelector(state => state.h24);
    /*
    length = each minute is 0.25px;
    start = each minute is 2.73px
    */

    /*const startDay = new Date(dayTime);
    startDay.setHours(0,0,0,0)
    const endDay = new Date(dayTime);
    endDay.setHours(23,59,59,9999)

    start < startDay.getTime() && (start = startDay.getTime())
    stop > endDay.getTime() && (stop = endDay.getTime())*/

   const [activeLength, setActiveLenght] = useState(liveTime===true && stop > timer && start <= timer ? ((timer-start)/(stop-start))*100 : false);
    const lengthStyle = ((stop-start)/3600000)*17;
    const startStyle = -2+((start-dayTime)/3600000)*17;
    const Spacing = {
        minWidth : lengthStyle + "rem",
        width : lengthStyle + "rem",
        transform: `translateX(${startStyle}rem)`
    }


    useEffect(() => {
        if(liveTime === false)
            return;
        if(!(stop > timer && start <= timer)){
            if(activeLength)
                setActiveLenght(false);
        }else setActiveLenght(((timer-start)/(stop-start))*100)
    }, [timer,start,stop,activeLength, liveTime]);


    return (
        <Container tabIndex={2} data-start={start} data-stop={stop} style={Spacing} onClick={() => dispatch(setEpgPopup(
            {
                title: title, 
                description: description, 
                start:start, stop:stop, 
                catchup: catchup,
                chId}
            ))} className={activeLength > 0 ? "isActive" : "noActive"} id={`ch${chId}-${start}`}>
            <div style={activeLength > 0 ? isActive : {}}>
                <div>
                    <BodyData>
                        <Title>{catchup > 0 ? (<i className="fas fa-history pr-2"></i>) : ""}{title}</Title>
                        <Description>{description}</Description>
                        <Time>{dateFormat(new Date(start), h24Format)} - {dateFormat(new Date(stop), h24Format)}</Time>
                    </BodyData>
                    <ProgressBar>
                        <Progress style={{width: activeLength ? activeLength + "%" : "0%"}}></Progress>
                    </ProgressBar>
                </div>
            </div>
        </Container>
    )
}

export default Programme
