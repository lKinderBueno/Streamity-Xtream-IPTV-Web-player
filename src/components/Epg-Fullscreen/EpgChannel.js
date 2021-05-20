import React from 'react'
import styled from 'styled-components'
import ProgrammeListing from "./ProgrammeListing"

const Container = styled.div`
display: block;
margin-top: 1rem;
`

const Channel = styled.div`
display: inline-block;
z-index: 2;
padding-bottom: .5rem;
position: -webkit-sticky;
position: sticky;
left: 160px;
z-index: 1;
line-height:.4rem;
transition: all 0.1s ease 0s;

& > button{
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    border-radius: .75rem;
    background-color: #fff;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 0;
    text-decoration: none;
    color: #303030;
}

& > button > p{
    padding-right: 1rem;
    margin-top: revert;
    margin-bottom: revert;
}
`

const ChannelLogo = styled.div`
padding-right: .5rem;
margin-right: .5rem;
padding-left: .5rem;
color: #fff;
border-right: .1rem solid #e5e5e5;

& > img{
    display: block;
    height: 100%;
    max-height: 1.625rem;
    width: auto;
    max-width: 100%;
}
`



const EpgChannel = ({Name,Image, Epg, Shift, day, moveFocus, style, leftScroll, chId, catchup}) => {
    let today = new Date()
    today.setDate(today.getDate()+day);
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1)

    return (
        <Container style={style}>
            <Channel className="chLogo" style={{left: (leftScroll+160)+"px"}}>
                <button >
                    <ChannelLogo>
                        <img loading={"lazy"} src={Image} alt={Name}></img>
                    </ChannelLogo>
                    <p>{Name}</p>
                </button>
            </Channel>
            <ProgrammeListing Epg={Epg} Shift={Shift} today={today.getTime()} day={day} tomorrow={tomorrow.getTime()} moveFocus={moveFocus} chId={chId} liveTime={day===0} catchup={catchup}></ProgrammeListing>
        </Container>
    )
}

export default EpgChannel
