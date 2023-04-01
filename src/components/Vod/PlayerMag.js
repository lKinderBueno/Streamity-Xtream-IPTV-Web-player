import React from 'react'
import ReactNetflixPlayer from "../../other/Player-github/player-github-mag"
import styled from 'styled-components'
import {useParams,useHistory} from "react-router-dom";
import {optimizeName} from "../../other/vod-series-name-optimizer"
import {useSelector} from "react-redux"
import {initStb, stbVolume, stbFullScreen, stbPlayStream, stbPause, stbGetDuration, stbPosition, stbPositionPercent} from "../../other/stb"

const Container = styled.div`
position:absolute;
width: 100%;
height: 100%;
top: 0;
left: 0;
`

const PlayerMag = () => {
    const {category,stream_id} = useParams();
    const history = useHistory();
    stbFullScreen(true);
    stbVolume(0)

    const stream = useSelector(state => state.playlist).find(x=>x.stream_id === parseInt(stream_id));
    stbPlayStream(stream.direct_source)

    
    return (
        <Container>
            <ReactNetflixPlayer
            src={stream.direct_source}
            title={optimizeName(stream.name)}
            titleMedia={optimizeName(stream.name)}
            backButton={()=> history.goBack()}
            FullPlayer
            autoPlay
            startPosition={0}
            OnEnded={()=> history.goBack()}
            overlayEnabled
            autoControllCloseEnabled
            Style
            primaryColor="var(--second-color)"
            secundaryColor="var(--first-color)"
            />
        </Container>
    )
}

export default PlayerMag
