import React from "react"
import styled from 'styled-components'
import {Link} from "react-router-dom"

const Li = styled(Link)`
height: calc(22.5vw);
max-height: 60vh;

width: 15.266667%;
flex: 0 0 15.266667%;

position: absolute;
right: calc(-7% - 0.4rem); 

padding-left: calc(5% - 0.4rem); 

opacity: 0;
transition: opacity 0.2s ease;
color:white;

cursor: pointer;

&:hover, &:focus, & > i:focus{
    opacity: 1;
    color:white;
    outline-width: 0;

}



`

const I = styled.i`
font-size: 3vw;
padding-top: calc(6.5vw * 1.5);
`


const NextArrow = ({category_id, isSeries}) => {
    return (
        <Li className="vod" data-id="7" to={`/${isSeries ? "series":"movie"}/category/${category_id}/`}>
            <I className="fas fa-chevron-right"></I>
        </Li>
    )
}

export default NextArrow
