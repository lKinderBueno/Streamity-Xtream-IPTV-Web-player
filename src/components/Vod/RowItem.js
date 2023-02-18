import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {optimizeName} from "../../other/vod-series-name-optimizer"
import PopupHover from "./PopupHover"
import {Link} from "react-router-dom";
import DB from "../../other/local-db"
import {generateUrl} from "../../other/generate-url"

const Li = styled(Link)`
height: calc(15vw * 1.5);
max-height: 60vh;
text-align: center;
flex: 0 0 15.266667%;
max-width: 15.266667%;
padding-left: .4rem;
padding-right: .3rem;
cursor: pointer;
outline-width: 0;
text-decoration: none !important;

&:focus > div {
    box-shadow: rgb(255 0 0 / 75%) 0px 3px 10px;
    outline-width: 0;
}
`

const ImgContainer = styled.div`
height: calc(100% - 1.5rem);

width: 100%;
background-size: cover;
background-repeat: no-repeat;
background-position: 50%;
border-radius: .5rem;
position: relative;

line-height: calc(15vw * 1.5);
transition: box-shadow .3s ease;
text-decoration: none;

&:hover, &:focus {
    box-shadow: rgb(255 0 0 / 75%) 0px 3px 10px;
    outline-width: 0;

}
`

const Title = styled.label`
font-size: 1.2rem;
    padding: .1rem;
    line-height: 1.6rem;
  overflow: hidden;
  color:white;
`

const Bar = styled.div`
position: absolute;
display: flex;
height: 4%;
bottom: -5%;
width: calc(100% - .7rem);
background-color: black;
border-radius: 10rem;

& > div{
    height:100%;
    border-radius: 10rem;
    background-color : var(--second-color);
}
`

const Name = styled.div`
height: 1.5rem;
color: white;
width: calc(100%);
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
box-shadow: none !important;
text-align: center;
text-decoration: none;
padding-top: 0.1rem;
`

let timeout = null;

const noCoverStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0c0f13",//randomColor[0],
    border: "0.2rem solid white",
    justifyContent: "center"
}

const RowItem = ({name, stream_icon, last, stream_id, category_id, id, style, isSeries, container_extension, existingTmdb}) => {
    const [noCover,setNoCover] = useState(!stream_icon);
    const [streamStat, setStreamStat] = useState()
    const [popup, setPopup] = useState(false);
    const [popupStyle, setPopupStyle] = useState({transform: "scale(0)"})

    const styleLast={
        position: "absolute",
        height: "calc(15vw * 1.5)",
        right: "calc(-7% - 0.4rem)",
        width: "100%",
        filter: "brightness(0.5)",
        pointerEvents: "none",
        cursor: "default",
        textDecoration: "none"
    }

    const showPopup = (mode) =>{
        clearTimeout(timeout);
        if(mode === true){
            timeout = setTimeout(()=>{
                setPopup(true);
                setTimeout(()=>{
                    setPopupStyle({transform: "scale(1)"})
                },100)
            },700);
        }else {
            setPopupStyle({transform: "scale(0)"})
            setTimeout(()=>{
                setPopup(false);
            },100)
        }
    }

    useEffect(() => {
        setStreamStat(DB.findOne(isSeries ? "series" : "movie",stream_id, category_id === "fav"))
    }, [isSeries, stream_id, category_id])


    return (
        <Li className={`col-2 ${!last && ("vod")}`} 
        data-id={id} 
        style={last ? {...style, ...styleLast} : style} 
        onMouseEnter={() => showPopup(true)} onMouseLeave={() => showPopup(false)} 
        to={{
            pathname:`/${isSeries ? "series" : "movie"}/category/${category_id}/${stream_id}/info/`,
            search: window.location.search,
        }}
        >
            <ImgContainer style={!noCover ? {backgroundImage: `url(${stream_icon})`} : noCoverStyle}>
                {!noCover ? 
                <img src={stream_icon} width={0} height={0} onError={()=>setNoCover(true)} alt={name}/>
                :
                <Title>{optimizeName(name)}</Title>
                }
            </ImgContainer>
            {!noCover && (<Name>{optimizeName(name)}</Name>)}
            {streamStat && streamStat.tot > 3 && streamStat.tot < 95 && (
                <Bar>
                    <div style={{width:streamStat.tot+"%"}}/>
                </Bar>
            )}
            {popup && !last && (<PopupHover name={name} stream_icon={stream_icon} stream_id={stream_id} stream_url={generateUrl("movie", stream_id, container_extension)} category_id={category_id} style={popupStyle} isSeries={isSeries} existingTmdb={existingTmdb}/>)}
        </Li>
    )
}

export default RowItem