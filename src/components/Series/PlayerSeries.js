import React, {useState, useEffect} from 'react'
import ReactNetflixPlayer from "../../other/Player-github/player-github"
import styled from 'styled-components'
import {useParams,useHistory} from "react-router-dom";
import {optimizeName} from "../../other/vod-series-name-optimizer"
import {useSelector} from "react-redux"
import DB from "../../other/local-db"

const Container = styled.div`
position:absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
`

const PlayerSeries = () => {
    const {category,season,episode, stream_id} = useParams();
    const history = useHistory();

    const tvseries = useSelector(state => state.playlist).find(x=> parseInt(x.series_id) === parseInt(stream_id)).name;
    const streamsTemp = useSelector(state => state.playlistEpisodes)/*.map(x => {
        return {
            ...x,
            playing: parseInt(x.episode_num) === parseInt(episode)
        }
    });*/

    const [stream, setStream] = useState();
    const [streams, setStreams] = useState([]);
    const [streamStat, setStreamStat] = useState()

    useEffect(()=>{
        if(!streamsTemp || streamsTemp.length === 0){
            history.replace(`/series/`);
            return;
        }
        setStreams(streamsTemp.map(x => {
            return {
                ...x,
                playing: parseInt(x.episode_num || x.episode) === parseInt(episode),
                id: x.episode_num || x.episode,
                name: x.title
            }
        }))
    },[streamsTemp,episode])
    
    useEffect(()=>{
        if(streams && streams.length>0){
            const s = streams.find(x=>x.playing===true)
            /*if(!s.direct_source)
                s.direct_source = generateUrl("series", s.stream, s.container_extension)*/

            let stat = DB.findOne("series",stream_id);
            (!stat || (stat && (parseInt(stat.season) !== parseInt(season) || parseInt(stat.episode) !== parseInt(episode)))) && (stat={id: stream_id, season: season, episode: s.id, start:0, tot:0}) 
            setStreamStat(stat)
            DB.set("series",stream_id, stat)
            
            setStream(s);
        }
    },[streams])

    const setStat = (stat) =>{
        setStreamStat(stat);
        DB.set("series",stream_id, stat)
    }

    return (
        <Container>
            <ReactNetflixPlayer
            src={stream && (stream.direct_source || stream.url || stream.url2)}
            title={stream && (optimizeName(tvseries))}
            titleMedia={stream && (optimizeName(tvseries))}
            extraInfoMedia = {stream && (optimizeName(stream.title))}
            backButton={()=> history.goBack()}
            FullPlayer
            autoPlay
            startPosition={streamStat ? parseInt(streamStat.start) : 0}
            overlayEnabled
            autoControllCloseEnabled
            Style
            primaryColor="var(--second-color)"
            secundaryColor="var(--first-color)"
            reprodutionList={streams}
            playlistTitle = {"Season " + season}
            syncDuration = {(duration, percentage) => setStat({...streamStat, start:duration, tot : parseInt(percentage), episode: episode, season: season})}

            dataNext={()=>{
                let next = streams.find(x=>x.episode_num > stream.episode_num);
                return { title: next ? `Next: ${next.title}` : ""}
            }}

            onClickItemListReproduction={(id, playing) => {
                let next = streams.find(x=>x.episode_num === id);
                history.replace(`/series/category/${category}/${stream_id}/play/season/${season}/episode/${next.episode_num}/`)
            }}

            onEnded={() => {
                if(stream){
                    let next = streams.find(x=>x.episode_num > stream.episode_num);
                    if(!next)
                        return history.back();
                    else history.replace(`/series/category/${category}/${stream_id}/play/season/${season}/episode/${next.episode_num}/`)
                }
            }}

            />
        </Container>
    )
}

export default PlayerSeries
