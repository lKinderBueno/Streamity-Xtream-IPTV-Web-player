import React from 'react'
import styled from "styled-components"
import PulsingDot from "./PulsingDot"
import {useSelector} from "react-redux"

const dateFormat = require("dateformat");

const EpgTitle = styled.div`
padding-left: 1rem!important;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 29vw;
`
const EpgDescription = styled.div`
font-weight: 100;
overflow-wrap: break-word;
overflow: hidden;
/*word-wrap: break-word;
word-break: break-all;*/
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 6;
padding-right: 12px;
`
const EpgList = styled.div`
   & > div {
    place-self: center;
    padding-right: 0;
    padding-left: 0;
   }
`


function EpgRow({title,description,start,stop,first}) {
    const h24Format = useSelector(state => state.h24);

    return (
        <div style={{color:"white"}}  className="ml-4 pb-1">
            <EpgList className="row">
                <div className="col-auto">
                    <PulsingDot isPlaying={start <= Date.now() && stop > Date.now()}></PulsingDot>
                </div>
                <div className="col-auto">
                {dateFormat(new Date(start), h24Format)} - {dateFormat(new Date(stop), h24Format)}
                </div>
                <div className="col-auto">
                    <EpgTitle><b>{title}</b></EpgTitle>
                </div>
            </EpgList>
            {first && (
            <div className="row mt-1">
                <EpgDescription>{description}</EpgDescription>
            </div>
            )}
        </div>
    )
}

export default EpgRow
