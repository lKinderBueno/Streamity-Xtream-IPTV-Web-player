import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import {useSelector} from "react-redux"
import ChannelEpgBar from "./ChannelEpgBar"
import DB from "../../other/local-db"

import {getSingleEpgNow, downloadEpgData} from "../../other/epg-database"
import {generateUrl} from "../../other/generate-url"

const dateFormat = require("dateformat");

const HeaderChannel = styled.div`
padding-bottom: .4rem!important;
line-height: 1!important;
font-size: 0.65rem;
font-weight: 700;
`

const BodyChannel = styled.div`
text-transform: capitalize;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
`
const Title = styled.label`
font-size: 1rem;
max-width: 100%;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;`

const TitleEpg = styled.label`
padding-left: 2%;
font-size: 0.9rem;
font-weight: 100;
max-width: 70%;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;`

/*const PlayingButton = styled.i`
font-size: 2.2rem;
color: #fff;
margin-left:2px;
`*/

const Actions = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
align-self: center;
gap: .5rem;
z-index:10;
`

const Favorite = styled.div`
display: flex;
cursor: pointer;
`

const DownloadLink = styled.a`
display: flex;
color: inherit;
transition: color .2s ease;

&:hover, &:focus {
    color: var(--second-color);
}
`

const ChannelEpg = ({chId, Name, Epg, Shift, isPlaying}) => {
    const h24Format = useSelector(state => state.h24);
    const streamFormat = useSelector(state => state.streamFormat);
    const timer = useSelector(state => state.timer60);
    const [epgNow, setEpgNow] = useState(false);
    const [favorite, setFavorite] = useState(null)

    useEffect(() => {
        setFavorite(!!DB.findOne("live",chId,true))
        if(!Epg)
            return;
        async function fetchData() {
            await downloadEpgData(chId, Epg, 1, Shift);
            const newEpg = getSingleEpgNow(Epg,Shift);
            if(!newEpg)
                setEpgNow(false);
            else if(newEpg && (epgNow === false || epgNow.start !== newEpg.start)){
                setEpgNow({...newEpg});
            } 
        }
        fetchData();
      }, []);

    useEffect(() => {
        setFavorite(!!DB.findOne("live",chId,true))
    }, [isPlaying])
    
    useEffect(() => {
        const newEpg = getSingleEpgNow(Epg,Shift);
        if(!newEpg)
            setEpgNow(false);
        else if(newEpg && (epgNow === false || epgNow.start !== newEpg.start)){
            setEpgNow({...newEpg});
        } 
    }, [timer]);

    const setFavoriteGlob = (event) =>{
        event.stopPropagation();

        if(!!favorite)
            DB.del("live",chId,true)
        else DB.set("live",chId,{id: chId}, true)
        setFavorite(!favorite);
    }

    return (
        <>
            <div className= {/*isPlaying ?*/ "col-md-8 col-sm-6 col-xs-5 order-3" /*: "col-md-9 col-sm-8 col-xs-7 order-3"*/}>
                <HeaderChannel className="lh-1">
                    <span>{epgNow !== false && `${dateFormat(new Date(epgNow.start), h24Format)} - ${dateFormat(new Date(epgNow.end), h24Format)}`}</span>
                </HeaderChannel>
                <BodyChannel className={"lh-sm"}>
                    <Title><b>{Name}</b></Title>
                    <TitleEpg>{epgNow.title}</TitleEpg>
                </BodyChannel>
            </div>
            {/*isPlaying ? (<div className="col-md-1 text-center order-4 p-0" style={{width:"1rem"}}>
                <PlayingButton className="far fa-play-circle"></PlayingButton>
    </div>)*/}
            <Actions className={`col-md-1 text-center order-4 p-0 ${isPlaying ? "playing" : ""}`}>
                <DownloadLink href={generateUrl("live", chId, streamFormat || "ts")} target="_blank" rel="noreferrer" title={`Open stream (.${streamFormat || "ts"})`} onClick={(e)=> e.stopPropagation()}>
                    <i className="fas fa-external-link-alt"></i>
                </DownloadLink>
                <Favorite onClick={setFavoriteGlob}>
                    <i className={favorite !== false ? "fas fa-star" : "far fa-star"}></i>
                </Favorite>
            </Actions>
            <div className="col-12 order-5">
                {epgNow !== false ?
                (<ChannelEpgBar key={chId+ " " +epgNow.start} start={epgNow.start} stop={epgNow.end} isPlaying={isPlaying} />)
                :
                <ChannelEpgBar />
                }
            </div>
        </>
    )
}

export default ChannelEpg

