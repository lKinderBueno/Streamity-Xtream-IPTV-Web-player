import React from "react"
import styled from "styled-components"
import Day from "./Day"
import {dateToName, dateToReadable} from "../../other/convert-day-name"

const Nav = styled.div`
background: #064497;
border: none;
box-shadow: inset 0 5px 10px 0 rgb(0 0 0 / 10%);
`

const DaysList = styled.ul`
list-style: none;
padding-left: 0;
margin: 0;
display: flex;
align-items: center;
overflow-x: auto;
display: block;
justify-content: space-between;
flex-flow: row wrap;
align-items: center;
padding: 1rem 2rem;
width: 100%;

`

const NavBar = ({day}) => {
    return (
        <Nav>
            <DaysList>
                <Day name={"Today"} isSelected={day===0}></Day>
                <Day name={"Tomorrow"} isSelected={day===1} date={dateToReadable(Date.now() + (1*86400000))}></Day>
                <Day name={dateToName(Date.now() + (2*86400000))} isSelected={day===2} date={dateToReadable(Date.now() + (2*86400000))}></Day>
                <Day name={dateToName(Date.now() + (3*86400000))} isSelected={day===3} date={dateToReadable(Date.now() + (3*86400000))}></Day>
                <Day name={dateToName(Date.now() + (4*86400000))} isSelected={day===4} date={dateToReadable(Date.now() + (4*86400000))}></Day>
            </DaysList>
        </Nav>
    )
}


export default NavBar
