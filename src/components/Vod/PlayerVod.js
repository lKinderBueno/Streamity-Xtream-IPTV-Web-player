import React, {useEffect, useState} from 'react'
import ReactNetflixPlayer from "../../other/Player-github/player-github"
import styled from 'styled-components'
import {useParams,useHistory} from "react-router-dom";
import {optimizeName} from "../../other/vod-series-name-optimizer"
import {useSelector} from "react-redux"
import DB from "../../other/local-db"
import {generateUrl} from "../../other/generate-url"

const Container = styled.div`
position:absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
`

const PlayerVod = () => {
    const {category,stream_id} = useParams();
    const history = useHistory();

    const stream = useSelector(state => state.playlist).find(x=>x.stream_id === parseInt(stream_id));
    const [streamStat,setStreamStat] = useState(DB.findOne("movie",stream_id));

    const [url, setUrl] = useState();

    useEffect(()=>{
        if(!stream){
            history.replace(`/movie/`);
            return;
        }
        if(stream.direct_source)
            setUrl(stream.direct_source)
        else{
            setUrl(generateUrl("movie",stream.stream_id,stream.container_extension))
        }
    },[stream])

    useEffect(()=>{
        let stat = DB.findOne("movie",stream_id);
        !stat && (stat={id: stream_id, start:0, tot:0}) 
        setStreamStat(stat)
        DB.set("movie",stream_id, stat)
    },[category, stream_id])

    const setStat = (stat) =>{
        setStreamStat(stat);
        DB.set("movie",stream_id, stat)
    }


    return (
        <Container>
            <ReactNetflixPlayer
            src={url}
            title={optimizeName(stream.name)}
            titleMedia={optimizeName(stream.name)}
            backButton={()=> history.goBack()}
            FullPlayer
            autoPlay
            startPosition={streamStat ? parseInt(streamStat.start) : 0}
            syncDuration = {(duration, percentage) => setStat({...streamStat, start:duration, tot : parseInt(percentage)})}

            OnEnded={()=> {DB.del("movie",stream_id);history.goBack()}}
            overlayEnabled
            autoControllCloseEnabled
            Style
            primaryColor="var(--second-color)"
            secundaryColor="var(--first-color)"
            />
        </Container>
    )
}

export default PlayerVod
