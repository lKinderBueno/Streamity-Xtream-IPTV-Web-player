import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Programme from "./Programme"
import ProgrammeFake from "./Programme-fake"
import {getEpg, downloadEpgData} from "../../other/epg-database"

const Container = styled.ul`
width: calc(408rem);
display: block;
position: relative;
background-image: url(/img/placeholder-channel-events_border.svg);
background-repeat: repeat-x;
background-size: contain;
height: 6.625rem;
list-style-type:none;
min-width: 408rem;
max-width: 408rem;

&:before{
    content: "";
    background-image: url(/img/placeholder-channel-events_border.svg);
    background-repeat: repeat-x;
    width: 500px;
    height: 100%;
    position: absolute;
    left: -504px;
}
`

const ProgrammeListing = ({Epg, Shift, today, moveFocus,chId, day, liveTime, catchup}) => {
    const [epgListing, setEpgListing] = useState([]);
    const catchupDate =  catchup > 0 ? Date.now() - (catchup * 1000 * 60 * 60 * 24) : 0

    useEffect(() => {
        async function fetchData(d) {
            if (!Epg)
                return;
            await downloadEpgData(chId, Epg, d+1, Shift);

            const newEpg = getEpg(Epg, d+1, Shift);
            if (newEpg) {
                setEpgListing([...newEpg]);
            } else setEpgListing([]);
        }
        fetchData(day);
    }, [day])

    

    return (
        <Container onKeyDown={moveFocus} autoFocus>
            {epgListing.length === 0 ?
                fakeEpgGenerator(today).map((epg) => (
                    (<ProgrammeFake key={chId+"-"+epg.start} start={epg.start} stop={epg.end} dayTime={today} chId={chId}></ProgrammeFake>)
                ))
                :
                epgListing.map((epg,id) => (
                    <Programme key={chId+"-"+epg.start} start={epg.start} stop={epg.end} title={epg.title} description={epg.description} dayTime={today} chId={chId} liveTime={liveTime} catchup={catchupDate > 0 && epg.start >= catchupDate && epg.start <= Date.now()}/>
                ))
            }
        </Container>
    )
}

export default ProgrammeListing


const fakeEpgGenerator = (today) =>{
    let toReturn = [];
    for(let i = 0; i < 24; i+=3){
        toReturn.push({start: today+(i*3600000), end: today+((i+3)*3600000)})
    }
    return toReturn;
}