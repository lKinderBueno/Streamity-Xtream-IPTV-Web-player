import React from 'react'
import styled from 'styled-components'
import {useSelector} from "react-redux"
import { useState, useEffect, useMemo } from 'react'

const Line = styled.div`
width: 0.1rem;
    position: absolute;
    top: 0;
    height: 100%;
    background: #064497;
`

const TimeLongLine = () => {
    const timer = useSelector(state => state.timer60);
    const date = useMemo(() => new Date(timer),[timer]);

    const [length, setLength] = useState((date.getHours()*17) + (date.getMinutes()*0.25));
    useEffect(() => {
        setLength((date.getHours()*17) + (date.getMinutes()*0.25));
    },[timer,date])
    return (
        <div>
            <Line style={{left: `calc(${length}rem - 2.1rem)`}}/>
        </div>
    )
}

export default TimeLongLine
