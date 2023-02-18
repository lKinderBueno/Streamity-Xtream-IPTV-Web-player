import React, {useEffect, useState} from 'react'
import  {Link}  from 'react-router-dom'
import styled from 'styled-components'
import {getVodInfo, getSeriesInfo} from "../../other/load-playlist"
import {optimizeName} from "../../other/vod-series-name-optimizer"

const Container = styled.div`
height: calc(75vh - 3rem);
position: relative;
z-index: 1000;
`

const BackgroundImage = styled.div`
position:absolute;
height:  calc(75vh - 4rem);
top:0;
left:0;
z-index: -1;
width: 100vw;
filter: blur(.3rem);
`

const VideoContainer = styled.div`
position: absolute;
width: 100vw;
height:  calc(75vh - 4rem);
top: 0;
left: 0;
overflow: hidden;
z-index:-99999;
background-color: var(--first-color);

& > div{
    position: absolute;
    height: calc(130% + 6rem);
    z-index: -99999;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 150%;
    left: -25%;
    top: -6rem;
    background-color: var(--first-color);
}
`

const Overlay = styled.div`
padding: 1rem 2rem;
-webkit-text-fill-color: white; /* Will override color (regardless of order) */
-webkit-text-stroke-width: 1px;
-webkit-text-stroke-color: black;
position:absolute;
width:100vw;
height: calc(70vh - 3rem);
z-index: 2;
`

const Row = styled.div`
bottom: 0;
position: absolute;
width: 100%;
`

const Image = styled.img`
max-width: 100%;
max-height: 100%;
height: auto;
`

const Desc = styled.label`
-webkit-text-stroke-width: 0px;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
`

const ButtonMain = styled(Link)`
color: black !important;
-webkit-text-fill-color: black;
-webkit-text-stroke-width: 0px;
padding: .6rem 1.5rem;
transition: all .3s ease;
`

const ButtonSecond = styled(Link)`
color: white !important;
-webkit-text-fill-color: white;
-webkit-text-stroke-width: 0px;
padding: .6rem 1.5rem;
transition: all .3s ease;
`

const Shadow  = styled.div`
position: absolute;
width: 100vw;
height: 23vh;
bottom: 0;
left: 0;
z-index: 0;
background-image: linear-gradient(180deg,transparent,rgba(37,37,37,.61),var(--first-color));

`

const BackgroundPlayer = ({name, stream_icon, stream_id, category_id, isSeries, style, title, existingTmdb}) => {
    const [Name, setName] = useState(optimizeName(name))
    const [ImageSrc, setImageSrc] = useState(stream_icon)
    const [Description, setDescription] = useState("")
    const [youtubeId, setYoutubeId] = useState(null)
    const [backdropPath, setBackdropPath] = useState(null)

    useEffect(() => {
        async function fetchData() {
            (isSeries ? getSeriesInfo(stream_id,name, true, existingTmdb) : getVodInfo(stream_id,name, existingTmdb)).then(result =>{
                if(result && result.info){
                    result = result.info;
                    result.name && (setName(result.name))
                    result.image && (setImageSrc(result.image))
                    result.cover && (setImageSrc(result.cover))
                    result.description && (setDescription(result.description))
                    result.youtube_trailer && setYoutubeId(result.youtube_trailer)
                    result.backdrop_path && result.backdrop_path.length > 0 && (setBackdropPath(result.backdrop_path[0]))
                }
            })
        }
        fetchData(); 
    }, [stream_id])

    return (
        <Container className="parent" style={style}>
            {
            (youtubeId || !backdropPath) ?
                (<VideoContainer>
                    <div>
                        {youtubeId && (<iframe frameBorder="0" height="100%" width="100%" title="youtube-bg"
                          src={`https://youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&autohide=1&mute=1&loop=1&disablekb=1&modestbranding=1&playlist=${youtubeId}&origin=http://localhost:3006`}>
                        </iframe>)
                    }
                    </div>
                </VideoContainer>)
            :
                (<BackgroundImage style={{background: `url("${backdropPath}") no-repeat center center fixed`}}/>)
            }
            <Overlay>
                <h1><b>{title ? title : (isSeries ? "Series" : "Movies")}</b></h1>
                <Row className="row">
                    <div className="col-2">
                        <Image src={ImageSrc}/>
                    </div>
                    <div className="col-4">
                        <h3><b>{Name}</b></h3>
                        <Desc>{Description}</Desc>
                        <br/>
                        <div className="row">
                            {isSeries !== true && (
                                <div className="col-auto">
                                    <ButtonMain type="button" id="btn-1" className="btn btn-light vod" to={`/movie/category/${category_id}/${stream_id}/play/`}>
                                        <i className="fas fa-play mr-2"></i>
                                        Play
                                    </ButtonMain>
                                </div>)
                            }
                            <div className="col-auto">
                                <ButtonSecond type="button" id="btn-2" className="btn btn-secondary vod" to={`/${isSeries ? "series" : "movie"}/category/${category_id}/${stream_id}/info/`}>
                                    <i className="fas fa-info-circle mr-2"></i>
                                    More info
                                </ButtonSecond>
                            </div>
                        </div>
                        
                    </div>
                </Row>
            </Overlay>
            <Shadow/>
        </Container>
    )
}

export default BackgroundPlayer
