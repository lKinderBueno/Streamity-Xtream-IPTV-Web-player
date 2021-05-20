import React from 'react'
import styled from 'styled-components'
import {useSelector} from "react-redux"

const dateFormat = require("dateformat");

const Container = styled.li`
position: absolute;
left: 0;
height: 100%;
background-color: #fff;
transition: all 0.3s ease 0s;

&:hover, &:focus{
    z-index: 2;
    width: fit-content !important;
    max-width: 600px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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


const ProgrammeFake = ({start, stop, dayTime, chId}) => {
    const h24Format = useSelector(state => state.h24);
    /*
    length = each minute is 0.25px;
    start = each minute is 2.73px
    */
    const lengthStyle = ((stop-start)/3600000)*17;
    const startStyle = -2+((start-dayTime)/3600000)*17;
    const Spacing = {
        minWidth : lengthStyle + "rem",
        width : lengthStyle + "rem",
        transform: `translateX(${startStyle}rem)`
    }


    return (
        <Container tabIndex={2}  data-start={start} data-stop={stop} style={Spacing}  className={`noActive`} id={`ch${chId}-${start}`}>
            <div>
                <div>
                    <BodyData>
                        <Title>No programme available</Title>
                        <Description></Description>
                        <Time>{dateFormat(new Date(start), h24Format)} - {dateFormat(new Date(stop), h24Format)}</Time>
                    </BodyData>
                    <ProgressBar>
                        <Progress style={{width: "0%"}}></Progress>
                    </ProgressBar>
                </div>
            </div>
        </Container>
    )
}

export default ProgrammeFake
