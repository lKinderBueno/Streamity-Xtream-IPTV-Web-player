import React from 'react'
import styled from 'styled-components'

const ButtonObj = styled.button`
cursor: pointer;
position: relative;
text-align: center;
margin: 0;
padding: 0;
height: 100%;
width: 4em;
-webkit-flex: none;
flex: none;
background: none;
border: none;
color: inherit;
display: inline-block;
font-size: inherit;
line-height: inherit;
text-transform: none;
text-decoration: none;
transition: none;
-webkit-appearance: none;
appearance: none;
transition: text-shadow .2s ease;

&:focus{
    outline: 0!important;
}

&:hover{
    text-shadow: 0em 0em 1em white;
}

`

const PopupText = styled.span`
border: 0;
clip: rect(0 0 0 0);
height: 1px;
overflow: hidden;
padding: 0;
position: absolute;
width: 1px;
`

const Button = ({onClick, enabled, iconOn, iconOff, textOn, textOff}) => {
    return (
        <ButtonObj type="button" title={!enabled ? textOn : textOff} onClick={onClick}>
          <i className={!enabled ? iconOn : iconOff}></i>
        	<PopupText aria-live={!enabled ? textOn : textOff}>{!enabled ? textOn : textOff}</PopupText>
        </ButtonObj>
    )
}

export default Button
