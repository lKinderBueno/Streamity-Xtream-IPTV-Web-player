import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {getVodInfo, getSeriesInfo} from "../../other/load-playlist"
import {optimizeName} from "../../other/vod-series-name-optimizer"
import  {Link}  from 'react-router-dom'


const ImgHovered = styled.div`
height: 10rem;
max-height: 60vh;
background-size: cover;
background-repeat: no-repeat;
background-position: 50%;
border-radius: .5rem .5rem 0 0;
position: relative;

line-height: calc(15vw * 1.5);

&:hover{
    box-shadow: 0px;
}
`


const Container = styled.div`
position: absolute;
top: -1rem;
left: 0;

width: 22rem;
transform-origin: center center;
transform: none;
z-index: 3;
opacity: 1;
box-shadow: rgb(0 0 0 / 75%) 0px 3px 10px;
color: #fff;
background-color: transparent;
font-size: 16px;

overflow: hidden;
transform: scale(0);

transition: transform .3s ease;

`

const Header = styled.div`
position: relative;
background-color: #000;
box-sizing: inherit;
overflow: hidden;
`

const Body = styled.div`
opacity: 1;
transform: none;
background-color: #181818;
position: relative;
padding-top: .5rem;
padding-bottom: .5rem;
overflow: hidden;
`

const Buttons = styled.div`
color:white;
font-size: 2.1rem;
text-align: justify;
padding-left: 1rem;
overflow: hidden;
`

const LinkBtn = styled(Link)`
color:white; 
& > i{
    transition: all .2s ease;
}
&:hover > i, &:focus > i{
    color: rgb(255,255,255,50%);
}
`

const ABtn = styled.a`
color:white; 
& > i{
    transition: all .2s ease;
}
&:hover > i, &:focus > i{
    color: rgb(255,255,255,50%);
}
`


const PopupHover = ({name,stream_icon, stream_id, stream_url, category_id, style, isSeries, existingTmdb}) => {

    const [Name, setName] = useState(optimizeName(name))
    const [ImageSrc, setImageSrc] = useState(stream_icon)
    const [Rating, setRating] = useState(false)
    const [youtubeId, setYoutubeId] = useState(null)
    const [backdropPath, setBackdropPath] = useState(null)
    const [Genres, setGenres] = useState(false)

    useEffect(() => {
        async function fetchData() {
            (isSeries ? getSeriesInfo(stream_id,name, true, existingTmdb) : getVodInfo(stream_id,name, existingTmdb)).then(result =>{
                if(result && result.info){
                    result = result.info;
                    result.name && (setName(result.name))
                    result.image && (setImageSrc(result.image))
                    result.cover && (setImageSrc(result.cover))
                    result.youtube_trailer && (setYoutubeId(result.youtube_trailer))
                    result.backdrop_path && result.backdrop_path.length > 0 && (setBackdropPath(result.backdrop_path[0]))
                    result.genre && (setGenres(result.genre))
                    if(result.rating){
                        const push = {full:[],empty:[],half:false}
                        const quotient = Math.floor(result.rating/2);
                        const remainder = result.rating % 2 > 0 ? 1 : 0;
                        for(let i = 0;i < quotient; i++)
                            push.full.push(1);
                        for(let i = 0; i < 5-remainder-quotient +  (quotient === 1 ? 0 : 1); i++)
                            push.empty.push(1);
                        push.half = quotient === 1;
                        setRating({...push})
                    }
                }
            })
        }
        fetchData(); 
    }, [])

    return (
        <Container style={style}>
                {(youtubeId) ?
                ( <Header>
                    {youtubeId && (<iframe frameBorder="0" height="100%" width="100%" title="youtube-frame"
                      src={`https://youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&autohide=1&mute=1&loop=1&disablekb=1&modestbranding=1&playlist=${youtubeId}&origin=http://localhost:3006`}/>)
                    }
                    </Header>)
                :
                    (<ImgHovered style={backdropPath || ImageSrc ? {backgroundImage: `url(${backdropPath || ImageSrc})`} : {display:"none"}}/>)
                }
               
                <Body>
                    <Buttons className="row">
                        <div className="col-2">
                            <LinkBtn type="button" to={`/${isSeries ? "series" : "movie"}/category/${category_id}/${stream_id}/${isSeries ? "info" : "play"}/`}>
                                <i className="fas fa-play-circle"></i>
                            </LinkBtn>
                        </div>
                        {youtubeId && (
                        <div className="col-2">
                            <ABtn href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank">
                                <i className="fab fa-youtube"></i>
                            </ABtn>
                        </div>
                        )}
                        {isSeries === false &&
                        ([<div className="col-2">
                                <ABtn href={stream_url} target="_blank">
                            <i className="fas fa-download"></i>
                            </ABtn>
                        </div>,
                        
                        <div className="col text-right pr-5">
                            <LinkBtn type="button" to={{
                                pathname: `/${isSeries ? "series" : "movie"}/category/${category_id}/${stream_id}/info/`,
                                search: window.location.search,
                        }}>
                                <i className="fas fa-chevron-down"></i>
                            </LinkBtn>
                        </div>
                        ])}
                    </Buttons>
                    <h4>{Name}</h4>
                    {Rating && (
                    <div style={{color: "#46d369"}}>
                        {Rating.full.map((x,i)=> (<i key={"sf-"+i} className="fas fa-star"></i>))}
                        {Rating.half && (<i className="fas fa-star-half"></i>)}
                        {Rating.empty.map((x,i)=> (<i key={"s-"+i} className="far fa-star"></i>))}
                    </div>)}
                    {Genres && <label>{Genres}</label>}
                </Body>
            </Container>
    )
}

export default PopupHover
