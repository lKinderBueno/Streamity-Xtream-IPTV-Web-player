import React from 'react'
import styled from 'styled-components'
import TimeBarIndicator from "./TimeBarIndicator"
import TimeLine from "./TimeLine"

const Container = styled.div`
position: sticky;
display: block;
top: 0px;
margin: 0px;
width: 408rem;
background: #fff;
scroll-behavior: smooth;
box-shadow: 0 3px 8px 0 rgb(0 0 0 / 12%);
`



const TimeBar = ({day, h24, scrollBtn}) => {
    return (
        <Container>
            <TimeLine h24={h24} scrollBtn={scrollBtn}/>
            {day===0 && (<TimeBarIndicator/>)}
        </Container>
    )
}

export default TimeBar
