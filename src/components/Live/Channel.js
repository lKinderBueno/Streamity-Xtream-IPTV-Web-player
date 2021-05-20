import React, {useEffect} from "react"
import styled from "styled-components"
import ChannelEpg from "./ChannelEpg"
import "../../other/Transition.css"

const Li = styled.li`
/*border-radius: .4rem;*/
vertical-align: middle;
display: inline-flex;
justify-content: center;
align-items: center;
color: #829196;
width: 90% !important;
left: 5% !important;
border-bottom: #000 1px solid;

&:focus, &:hover{
    outline-width: 0px;
    /*background-color: #fff;
    transition: background-color .3s ease-in-out;
    color: #020d18 !important;
    border-radius: 5px;*/
    cursor: pointer;
    border-bottom: #000 0px solid !important;
}

&:hover *, &:focus *{
    /*color: #020d18 !important;*/
    cursor :pointer;
}


& + & {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}

`

const ChannelNumber = styled.div`
align-self: center;
text-align: left;
padding: 0;
padding-left: 1rem;

& > div{
    font-size: 1rem !important;
}
`
const HeaderChannel = styled.div`
padding-bottom: .4rem!important;
line-height: 1!important;
font-size: 1rem;
font-weight: 700;
`
const Logo = styled.div`
/*background: #203d79;*/
padding: .1rem .1rem;
border-radius: .2rem;
text-align: center;
width: 100%;
font-weight: bold;
min-height: 3rem;
max-height: 3rem;

background-position-x: center;
background-position-y: center;
background-size: contain;
background-repeat: no-repeat;

&>img{
    max-height: 3rem;
    height: auto;
    width: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
`

const ChannelContainer = styled.div`
/*padding-bottom: .2rem;
padding-top: .2rem;*/
`

const Channel = ({ Name, Image, Epg, Shift, Number, id, selected, selectEvent, virtualScrollStyle }) => {
    const style = {}

    useEffect(()=>{       
        if(selected){
            setTimeout(() => {
                document.getElementById("selectedCh") && (document.getElementById("selectedCh").className += " hvr-shutter-in-horizontal-on")
            }, 100)
        }
    },[])    
    
    

    return (
        <Li tabIndex={-1} onClick={!selected ? selectEvent : undefined} style={virtualScrollStyle} id={selected ? "selectedCh" : ""} className={selected ? "channel hvr-grow-shadow  hvr-shutter-in-horizontal" : "channel hvr-reveal hvr-grow-shadow"}> 
            <ChannelContainer className="container" style={{style}}>
                <div className="row">
                    <ChannelNumber className="col-sm-1 order-1">
                        <HeaderChannel>
                            <span>{Number}</span>
                        </HeaderChannel>
                    </ChannelNumber>
                    <div className="col-md-2 col-sm-3 order-2">
                        <Logo style={{backgroundImage:`url(${Image})`}}>
                            {//<img src={Image} loading={"lazy"} /*onError={()=>{this.onerror=null;this.src='../images/nologo.png?1'}} */ align="middle" alt="" />
                            }
                        </Logo>
                    </div>
                    <ChannelEpg Name={Name} Epg={Epg} Shift={Shift} chId={id} isPlaying={selected}/>
                </div>
            </ChannelContainer>
        </Li>
        
    )
}

export default Channel
