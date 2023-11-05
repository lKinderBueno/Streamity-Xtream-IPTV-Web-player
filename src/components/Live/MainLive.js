import React, { useEffect, useState} from 'react'
import Player from "../Player/Player"
import EpgListing from "./EpgListing"
import Channels from "./Channels"

import styled from "styled-components"
import {useSelector, useDispatch} from "react-redux"

import {setPlaylist} from "../../actions/set-Playlist"
import {setGroupList} from "../../actions/set-Group"

import {resetMemory, setGroup} from "../../other/last-opened-mode"

import {loadGroup,loadPlaylist} from "../../other/load-playlist"
import {useParams, useHistory} from "react-router-dom";

import Popup from "../Popup/Popup"

import DB from "../../other/local-db"

const Main = styled.div`
padding: 3vh 1vw;
background-color: var(--first-color);
height: calc(100vh - 3rem);
z-index:1;
transition: filter 0.5s ease;

`

const ChannelTitle = styled.h5`
color:white;
white-space: nowrap;
text-overflow: ellipsis;
`


const MainLive = () => {
    const [blurBackground, setBlurBackground] = useState()

    const playingChannel = useSelector(state => state.playingCh);
    const playlist = useSelector(state => state.playlist);
    const dispatch = useDispatch()
    const history = useHistory()

    const { category } = useParams();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(()=>{
        const fun = async() => {
            setBlurBackground(((isNaN(category) || category === undefined) || history.location.pathname.includes("menu")) ? {filter:"blur(.5rem)",  pointerEvents: "none"} : {});
            
            if(category != undefined && category != 0){
                let chs = await loadPlaylist("live",category)
                chs = chs || [];
                if(category==="fav")
                    chs = chs.filter(x=> DB.findOne("live",x.stream_id,true))
                dispatch(setPlaylist(chs));
                if(chs.length === 0)
                    setShowPopup(1)
            }else if(resetMemory("live")){
                await loadGroup("live").then(gps => {
                    if(!gps || gps.length===0){
                        history.replace("/")
                        return;
                    }
                    gps.unshift({category_name : "Only favorites", category_id:"fav"})
                    setGroup(gps[1].category_id)
                    dispatch(setGroupList(gps));
                    history.replace("/live/category/"+gps[1].category_id+"/")           
                })
            }else history.replace("/live/category/");
        }
        fun()
    },[dispatch,category])

    useEffect(() => {
        if(history.location)
            setBlurBackground(((isNaN(category) && category === undefined) || history.location.pathname.includes("menu")) ? {filter:"blur(.5rem)",  pointerEvents: "none"} : {});
    }, [history.location.pathname, category])


    return (
        <div>
        <Main style={blurBackground}>
            <div className="row">
                <div className="col-5" style={{paddingLeft:"15px", maxHeight : "calc(100vh - 4rem)"}}>
                    <ChannelTitle>{playingChannel ? playingChannel.name : "No channel selected"}</ChannelTitle>
                    {<Player/>}
                    <EpgListing Epg={playingChannel ? playingChannel.epg_channel_id : null} Shift={playingChannel ? playingChannel.shift : 0}/>
                </div>
                <div className="col-7" style={{paddingLeft:0}}>
                    <Channels playlist={playlist}/>
                </div>
            </div>
        </Main>
        {showPopup && <Popup title={`No stream found in selected category.`} icon={"fas fa-times"}  onclick={()=>{
        setBlurBackground({})
          setShowPopup(0);
          history.replace("/live/category/")
        }}/>}
        {/*window.gSTB && (<Tips/>)*/}
        </div>
    )
}

export default MainLive
