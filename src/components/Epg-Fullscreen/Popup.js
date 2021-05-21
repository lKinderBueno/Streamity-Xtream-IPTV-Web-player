import React, { useEffect, useState } from "react"
import styled from "styled-components"
import {useSelector, useDispatch} from "react-redux"
import {setEpgPopup} from "../../actions/epgPopup"
import focusElement from "../../other/focused-element"
import {setPlayingChannel} from "../../actions/playingChannel"
import {useHistory, useLocation} from "react-router-dom"

const dateFormat = require("dateformat");

const Container = styled.div`
position:absolute;
top:0px;
left:0px;
z-index: 999999;
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
background: rgba(0,0,0,.5);
max-height: 100vh;
transition: opacity 0.2s ease;
opacity:0;
`

const Box = styled.div`
flex: 0 0 100%;
width: 100%;

& > div{
    margin: 20px auto 0;
    width: 400px;
    box-shadow: none!important;
    border-radius: .55rem;
    position: relative;
    overflow: hidden;
}
`

const Body = styled.div`
position: relative;
padding: 1.25rem 1.5rem;
text-align: left;
background-color: #fff;

& > div{
    justify-content: space-between;
    align-items: flex-start;
    padding: .4375rem 0;
    border-bottom: 1px solid #e4e4e4;
}
`

const Title = styled.div`
display: block;
margin-top: 0;
margin-bottom: .3125rem;
font-weight: 500;
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
-webkit-line-clamp: 1;

`

const DateDiv = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
padding-bottom: .5rem;

& > div{
    display: flex;
    flex-direction: row;
    flex-flow: nowrap;
}
`

const Description = styled.div`
text-overflow: ellipsis;
line-height: 20px;
display: -webkit-box;
-webkit-line-clamp: 20;
overflow: auto;
-webkit-box-orient: vertical;
`

const Button = styled.button`
display: inline-block;
    padding: .75rem 1.25rem;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.1;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background-color: #064497;
    border: .0625rem solid #064497;
    border-radius: 1.375rem;
    min-width: 9.375rem;
    text-transform: uppercase;
    pointer-events: auto;
    display: table;
    margin: 0 auto;
&:focus, &:hover{
    cursor: pointer;
    color: #fff;
    background-color: #042e66;
    border-color: #042e66;
    outline-width: 0px;
}
`

const Popup = () => {
    const h24Format = useSelector(state => state.h24);
    const Info = useSelector(state => state.epgPopup);
    const playlist = useSelector(state => state.playlist)
    const [ch, setCh] = useState(playlist)

    const [style, setStyle] = useState({opacity:0})
    
    useEffect(()=>{
        ch && (setStyle({opacity:0}))
    },[ch])

    useEffect(()=>{
        if(Info && playlist){
            setCh(playlist.find(x=>parseInt(x.stream_id) === parseInt(Info.chId)))
            setInterval(()=>setStyle({opacity:1},50));
        }
    },[Info, playlist])

    const history = useHistory();
    const location = useLocation();

    const dispatch = useDispatch();

    return (
        Info && (
            <Container style={style}>
                <Box>
                    <div>
                        <Body>
                            <div>
                                <Title>{Info.title || ""}</Title>
                                <DateDiv>
                                <div>{dateFormat(new Date(Info.start), h24Format)} - {dateFormat(new Date(Info.stop), h24Format)}</div>
                                </DateDiv>
                            </div>
                            {Info.description &&
                            (<Description>{Info.description || ""}</Description>)
                            }
                            <div style={{display:"flex"}}>
                                <Button onClick = {
                                    () => {
                                        setStyle({opacity:0})
                                        setTimeout(()=>{
                                            dispatch(setEpgPopup());
                                            focusElement.getFocus() && (focusElement.getFocus().focus());
                                        },50)
                                    }
                                } autoFocus > Close </Button>
                                {(Info.catchup || (Info.stop > Date.now() && Info.start <= Date.now())) && 
                                    (<Button onClick = {
                                        () => {
                                            dispatch(setPlayingChannel(
                                                Info.stop > Date.now() && Info.start <= Date.now() 
                                                ? 
                                                ch 
                                                : 
                                                {...ch, 
                                                    timeshift: new Date(Info.start), 
                                                    duration: parseInt((Info.stop - Info.start)/(60*1000)), 
                                                    title: Info.title, 
                                                    desc: Info.description
                                                }))
                                            dispatch(setEpgPopup());
                                            history.push(location.pathname.replace(/tvguide.*/,""))
                                        }
                                    } autoFocus > Play </Button>)
                                }                                    
                            </div>
                            
                        </Body>
                    </div>
                </Box>
            </Container>
        )
    )
}

export default Popup
