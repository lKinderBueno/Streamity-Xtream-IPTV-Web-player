import React from "react"
import styled from 'styled-components';
import RowItem from "./RowItem"
import NextArrow from "./NextArrow"
import {Link} from "react-router-dom"

const Li = styled.li`
color: white;
height: calc(15vw * 1.7 + 1.75rem);
padding-bottom: 1rem;

& > div{
    position:relative;
    height: 100%;
    width: 100%;
}
`

const H3 = styled(Link)`
font-size: 1.75rem;
margin-bottom: .5rem;
font-weight: 500;
line-height: 1.2;
margin-top: 0;
color:white;
text-decoration: underline;
text-decoration-color : transparent;
transition: text-decoration-color 0.5s ease;


&:focus, &:hover{
    color:white;
}
`


const maxItem = 7;

const GroupRow = ({category_id, name, style, playlist, isSeries, existingTmdb}) => {
    return (
        playlist.length > 0 && (
        <Li style={style} className="parent">
            <H3 to={`/${isSeries ? "series" : "movie"}/category/${category_id}/`}>{name}</H3>
            <div className="row" style={{marginTop:".5rem"}}>
                {playlist.slice(0, maxItem).map((x,id)=>
                    (<RowItem id={id} key={"vod"+ (x.stream_id || x.series_id)} name={x.name} stream_icon={x.stream_icon || x.cover} stream_id={x.stream_id || x.series_id} stream_url={x.direct_source} category_id={category_id} container_extension={x.container_extension} last={id+1===maxItem} isSeries={isSeries} existingTmdb={x.tmdb}/>)
                    )}
                {playlist.length > maxItem && (<NextArrow category_id={category_id} isSeries={isSeries}/>)}
            </div>
        </Li>
        )
    )
}

export default GroupRow
