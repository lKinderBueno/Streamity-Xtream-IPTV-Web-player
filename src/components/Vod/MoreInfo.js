import styled from "styled-components"
import React, {useEffect, useState} from 'react'
import {getVodInfo, getSeriesInfo} from "../../other/load-playlist"
import {optimizeName} from "../../other/vod-series-name-optimizer"
import {useParams, Link, useHistory } from "react-router-dom";
import {useSelector} from "react-redux"
import Seasons from "../Series/Seasons"
import DB from "../../other/local-db"
import {generateUrl} from "../../other/generate-url"


const Container = styled.div`
position: absolute;
width: 100vw;
height: 95vh;  
top:0;
left:0;
user-select: none;
`

const Box = styled.div`
position absolute;
width: 80vw;
/*top: 0;*/
left: 10vw;z\
margin-top: 2vh;
background-color: #181818;
border-radius: .8rem;
box-shadow: rgb(0 0 0 / 75%) 0px 3px 10px;
overflow:auto;

transform: translateY(-50%);
top: 50%;

max-height: 90vh;
    overflow-y: auto;
`

const Header = styled.div`
height: 40vh;
max-height: 60vh;
background-color: #000;
box-sizing: inherit;
overflow: hidden;
background-color: var(--first-color);
pointer-events: none;

`

const ImgHovered = styled.div`
height: 40vh;
max-height: 60vh;
background-size: cover;
background-repeat: no-repeat;
background-position: 50%;
border-radius: .5rem .5rem 0 0;
position: relative;

line-height: calc(15vw * 1.5);
`

const Body = styled.div`
opacity: 1;
transform: none;
background-color: #181818;
position: relative;
padding: 1.2rem 2.5rem;
overflow: hidden;
color:white;
`

const Image = styled.img`
height: auto;
position: absolute;
top: 12vh;
left: 2rem;
height: 25vh;
box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
`

const RatingDiv = styled.div`
color: #46d369;
padding-right: .5rem;
`

const DescriptionDiv = styled.div`
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 8; /* number of lines to show */
-webkit-box-orient: vertical;
cursor: pointer;
` 

const TitleInfo = styled.span`
color: #777;
margin-right: .2rem;
display: inline-flex;
`

const TitleData = styled.span`
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2; /* number of lines to show */
-webkit-box-orient: vertical;
`

const ButtonMain = styled(Link)`
color: black !important;
-webkit-text-fill-color: black;
-webkit-text-stroke-width: 0px;
padding: .6rem 1.5rem;
transition: all .3s ease;
`

const ButtonFavorite = styled.button`
color: black !important;
-webkit-text-fill-color: black;
-webkit-text-stroke-width: 0px;
padding: .6rem 1.5rem;
transition: all .3s ease;
`

const ButtonSecond = styled.a`
color: white !important;
-webkit-text-fill-color: white;
-webkit-text-stroke-width: 0px;
padding: .6rem 1.5rem;
transition: all .3s ease;
`
const CloseBtn = styled.i`
position: absolute;
top: 1vh;
right: 2rem;
color: white;
cursor: pointer;
z-index:100;
font-size: x-large;
text-align: right;
z-index:1000000;

background-color: rgb(0 0 0 / 75%);
border-radius: 50%;
padding: 0.05rem;
`

const MoreInfo = ({style}) => {
    const {category,stream_id, playingMode} = useParams();
    const history = useHistory();

    const stream = useSelector(state => state.playlist).find(x=> playingMode === "series" ? parseInt(x.series_id) === parseInt(stream_id) : parseInt(x.stream_id) === parseInt(stream_id));

    const [expandDescription, setExpandDescription] = useState(false)
    const [Name, setName] = useState(stream && (optimizeName(stream.name)))
    const [Description, setDescription] = useState("")
    const [ImageSrc, setImageSrc] = useState(stream && (stream.stream_icon))
    const [Rating, setRating] = useState(false)
    const [youtubeId, setYoutubeId] = useState(null)
    const [backdropPath, setBackdropPath] = useState(null)
    const [Genres, setGenres] = useState("")
    const [Actor, setActor] = useState("")
    const [Year, setYear] = useState("")
    const [seasons, setSeasons] = useState({})
    const [favorite, setFavorite] = useState(null)
    const [url, setUrl] = useState();

    useEffect(() => {
        setFavorite(!!DB.findOne(playingMode,stream_id,true))

        async function fetchData() {
            if(!stream){
                history.replace(`/${playingMode}/`);
                return;
            }
            (playingMode === "series" ? getSeriesInfo(stream.series_id, stream.name, false, stream.tmdb) : getVodInfo(stream.stream_id,stream.name, stream.tmdb)).then(result =>{
                if(result && result.info){
                    let info = result.info;
                    info.name && (setName(info.name))
                    info.description && (setDescription(info.description))
                    info.image && (setImageSrc(info.image))
                    info.cover && (setImageSrc(info.cover))
                    info.youtube_trailer && setYoutubeId(info.youtube_trailer)
                    info.backdrop_path && info.backdrop_path.length > 0 && (setBackdropPath(info.backdrop_path[0]))
                    info.genre && (setGenres(info.genre))
                    info.actors && (setActor(info.actors))
                    info.releasedate && (setYear(info.releasedate))

                    if(info.rating){
                        const push = {full:[],empty:[],half:false}
                        const quotient = Math.floor(info.rating/2);
                        const remainder = info.rating % 2 > 0 ? 1 : 0;
                        for(let i = 0;i < quotient; i++)
                            push.full.push(1);
                        for(let i = 0; i < 5-remainder-quotient +  (quotient === 1 ? 0 : 1); i++)
                            push.empty.push(1);
                        push.half = quotient === 1;
                        setRating({...push})
                    }
                    playingMode === "series" && (setSeasons(result.episodes));
                }
            })
        }
        fetchData(); 
    }, [])

    useEffect(()=>{
        if(!stream)
            return;
        playingMode === "movie" && (setUrl(generateUrl("movie",stream.stream_id,stream.container_extension)))
    },[stream])

    const setFavoriteGlob = (event) =>{
        event.stopPropagation();
        if(!!favorite)
            DB.del(playingMode,stream_id,true)
        else DB.set(playingMode,stream_id,{id: stream_id}, true)
        setFavorite(!favorite);
    }
    

    return (
        <Container style={style}>
            <Box>
                {!window.gSTB && (<CloseBtn className="fas fa-times-circle" onClick={()=> history.goBack()}></CloseBtn>)}
                {(youtubeId) ?
                ( <Header>
                    {youtubeId && (<iframe frameBorder="0" height="100%" width="100%" title="youtube-pop"
                      src={`https://youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&autohide=1&mute=1&loop=1&disablekb=1&modestbranding=1&playlist=${youtubeId}&origin=http://localhost:3006`}/>)
                    }
                    </Header>)
                :
                    (<ImgHovered style={backdropPath || ImageSrc ? {backgroundImage: `url(${backdropPath || ImageSrc})`} : {display:"none"}}/>)
                }
                <Image src={ImageSrc}/>
                <Body>
                    <h1>{Name}</h1>
                    <div className="row">
                        <div className="col-8">
                            <div style={{display:"flex"}}>
                                {Rating && (
                                <RatingDiv>
                                    {Rating.full.map((x,i)=> (<i key={"sf-"+i} className="fas fa-star"></i>))}
                                    {Rating.half && (<i className="fas fa-star-half"></i>)}
                                    {Rating.empty.map((x,i)=> (<i key={"s-"+i} className="far fa-star"></i>))}
                                </RatingDiv>)}
                                <label><b>{Year}</b></label>
                            </div>
                            <DescriptionDiv style={expandDescription ? {"-webkit-line-clamp": "unset"} : {}} onClick={()=>setExpandDescription(!expandDescription)}>
                                {Description}
                            </DescriptionDiv>
                            
                        </div>
                        <div className="col-4">
                            {Actor &&
                            ([<TitleInfo>Cast: </TitleInfo>,
                            <TitleData>{Actor}</TitleData>,
                            <br/>,
                            ])}

                            {Genres &&
                            ([<TitleInfo>Genres: </TitleInfo>,
                            <TitleData>{Genres}</TitleData>,
                            <br/>,
                            ])}

                            {playingMode !== "series" && (
                                <ButtonMain type="button" 
                                className="btn btn-light btn-block mb-2 mt-1 btn-info-1" 
                                data-id={1} 
                                to={{
                                    pathname:`/movie/category/${category}/${stream_id}/play/`,
                                    search: window.location.search,
                                    }}>
                                    <i className="fas fa-play mr-1"></i>
                                    Play
                                </ButtonMain>
                            )}
                            <ButtonFavorite type="button" className="btn btn-warning btn-block mb-2 mt-1 btn-info-1" onClick={setFavoriteGlob} >
                                <i className={`${favorite !== false ? "fas fa-star" : "far fa-star"} mr-1`}></i>
                                {favorite !== false ? "Remove from " : "Add to "} favorites
                            </ButtonFavorite>
                            <div className="btn-group btn-block" role="group">
                                {youtubeId && (
                                <ButtonSecond type="button" className="btn btn-block btn-info-2" data-id={2} style={{backgroundColor:"#c4302b"}}  href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank"><i className="fab fa-youtube mr-1"></i>
                                    Trailer
                                </ButtonSecond>)}

                                {url ? (
                                    <ButtonSecond type="button" className={`btn btn-secondary btn-info-${!youtubeId ? 2 : 3}`} data-id={!youtubeId ? 2 : 3} href={url} target="_blank">
                                        <i className={`fas fa-download ${!youtubeId && ("mr-1")}`}></i>
                                        {!youtubeId && ("Download")}
                                    </ButtonSecond>
                                )
                                :
                                youtubeId && (
                                    <ButtonSecond type="button" className="btn btn-block" data-id={2} style={{backgroundColor:"#c4302b"}}  href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank">
                                        <i className="fab fa-youtube mr-1"></i>
                                        Trailer
                                </ButtonSecond>)
                            }
                            </div>
                        </div>
                    </div>
                    {playingMode === "series" && (
                       <Seasons seasonData={seasons} cover={backdropPath || ImageSrc}/>
                    )}
                </Body>
            </Box>
        </Container>
    )
}

export default MoreInfo
