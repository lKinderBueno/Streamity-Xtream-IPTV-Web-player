import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import EpgRow from "./Epg"
import {useSelector} from "react-redux"
import {getEpgNow} from "../../other/epg-database"


const EpgSummary = styled.div`
margin-top: 1rem;
max-height: 40vh;
overflow: hidden;
`

const EpgListing = ({Epg, Shift}) => {
    const timer = useSelector(state => state.timer60);

    const [epgListing, setEpgListing] = useState([]);

    useEffect(()=>{
        const arr = getEpgNow(Epg,Shift);
        if(!arr || arr.length === 0 )
            setEpgListing([]);
        else setEpgListing(arr);
    },[Epg,Shift]);

    
    useEffect(() => {
        const arr = getEpgNow(Epg,Shift);
        if(!arr || arr.length === 0 )
            setEpgListing([]);
        else if(arr && arr.length > 0 && epgListing.length>0){
            if(arr[0].start !== epgListing[0].start)
                setEpgListing(arr);
        }else if(arr && arr.length >0 && (!epgListing || epgListing.length===0)){
            setEpgListing(arr);
        }
    }, [timer, Epg, Shift]);

    return (
        <EpgSummary>
            {epgListing.slice(0, 4).map((epg,id) => (
                <EpgRow key={Epg+" " + id} first={id===0} start={epg.start} stop={epg.end} title={epg.title} description={epg.description}/>
            ))}
        </EpgSummary>
    )
}

export default EpgListing
