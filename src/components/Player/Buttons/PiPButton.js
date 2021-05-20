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
margin-left: auto;
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

const PiPButton = ({onClick, enabled}) => {
    return (
        <ButtonObj type="button" title={!enabled ? "Picture in Picture" : "Exit Picture in Picture"} onClick={onClick}>
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
              <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/>
            </svg>
          </i>
        	<PopupText aria-live={!enabled ? "Picture in Picture" : "Exit Picture in Picture"}>{!enabled ? "Picture in Picture" : "Exit Picture in Picture"}</PopupText>
        </ButtonObj>
    )
}

export default PiPButton
