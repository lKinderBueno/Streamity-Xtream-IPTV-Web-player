import styled from "styled-components"
import {useSelector} from "react-redux"
import React, {useRef,useEffect} from "react"
import NavBar from "./NavBar"
import EpgChannel from "./EpgChannel"
import TimeBar from "./TimeBar/TimeBar"
import TimeLongLine from "./TimeBar/TimeLongLine"
import Popup from "./Popup"
import focusElement from "../../other/focused-element"
import { FixedSizeList as List } from "react-window";
import {convertRemToPixels,convertVhToPixels} from "../../other/convert-rem"
import {useHistory, useParams} from "react-router-dom";


const Container = styled.div`
position:absolute;
top:0px;
left:0px;
width:100vw;
height:100%;
max-height:100vh;
background-color:white;
z-index:20;
overflow:hidden;
`

const ChannelsContainer = styled.div`
display: block;
height: calc(100vh - 3.5rem);
margin: 0 auto;
flex-grow: 1;
overflow-x:hidden;
/*overflow: hidden;*/


& > div{
    display: block;
    position: relative;
    scrollbar-width: none;
    height: 100%;
    scroll-behavior: smooth;
}

& > div > div{
    transform: translateY(0px);
    position: absolute;
    left: 0;
    contain: content;
    min-width: 408rem;
    max-width: 408rem;
}
`

const EpgChannelsContainer = styled.div`
top:4rem;
max-height:calc(100vh - 8rem);
`

const ClosePopup = styled.a`
color:white;
position:absolute;
right:1rem;
top:0.2rem;
font-weight: 500;
line-height: 1.2;
font-size: 2.5rem;
transition: all .15s ease;
z-index:1000;

&:hover{
    color: #020d18;
    cursor: pointer;
}
`

let isScrolling;
const EpgFullListing = () => {
    const channelsPlaylist = useSelector(state => state.playlist);
    const playingChannel = useSelector(state => state.playingCh);
    const h24 = useSelector(state => state.h24);

    const history = useHistory();
    const {category, date} = useParams();
    const scrollRef = useRef(null)
    const listRef = useRef();

    const day = date ? parseInt((new Date(date) - Date.now()) / (1000 * 60 * 60 * 24), 10)+1 : 0;




    const executeScroll = () => day === 0 && (scrollRef.current.scroll(new Date().getHours()*230,0));

    let leftScroll = 0;
    
    let activeElement;
    useEffect(() => {
        playingChannel && (listRef.current.scrollToItem(channelsPlaylist.findIndex(x=>x.stream_id === playingChannel.stream_id), "center"));
        executeScroll();
        setTimeout(()=>{
            let toSelect = activeElement || document.querySelector(".isActive") || document.querySelector(".noActive")
            toSelect && (toSelect.focus())
        },50)
        centerLogo();
    })

    const centerLogo = (event) =>{
        clearTimeout( isScrolling );
        isScrolling = setTimeout(function() {
            if(Math.abs(scrollRef.current.scrollLeft-leftScroll)>100){
                leftScroll = scrollRef.current.scrollLeft;
                Array.from(document.querySelectorAll(".chLogo")).forEach(x=> x.style.left = `calc(${leftScroll}px + 140px)`)
            }
        }, 66);
    }

    const navButtonScroll = (val) =>{
        scrollRef.current.scroll({left:scrollRef.current.scrollLeft+val,behavior: 'smooth'})
    }

    const close = () =>{
        setTimeout(()=>document.getElementById("selectedCh") ? document.getElementById("selectedCh").focus() : document.querySelector(".channel").focus(),100)
        history.push("/live/category/"+category+"/")
    }

    const moveFocus = (event) => {
        if(event.keyCode === 27 || event.keyCode === 8){
            close();
            return;
        }

        activeElement = document.activeElement;
        if(event.keyCode === 39 && activeElement.nextSibling) {
            //window.gSTB && (activeElement.parentNode.parentNode.parentNode.parentNode.scrollLeft=activeElement.nextSibling.style.transform.match(/\d{1,}\.{0,}\d{0,}/g)+"rem");
            activeElement.nextSibling.focus();
        }
        else if(event.keyCode === 37 && activeElement.previousSibling) {
            //window.gSTB && (activeElement.parentNode.parentNode.parentNode.parentNode.scrollLeft=activeElement.previousSibling.style.transform.match(/\d{1,}\.{0,}\d{0,}/g)+"rem");
            activeElement.previousSibling.focus();
        }else if(event.keyCode === 13) {
            focusElement.setFocus(activeElement);
            activeElement.click();
        }else if(event.keyCode === 40 || event.keyCode === 38) {
            let start = parseInt(activeElement.dataset.start);
            //let stop = parseInt(activeElement.dataset.stop);

            let next = activeElement.parentElement.parentElement;
            next = event.keyCode === 40 ? next.nextElementSibling : next.previousSibling;
            do{
                if(!next)
                    break;
                if(next && next.children.length > 1 && next.children[1].children && next.children[1].children.length > 0)
                    break;
                else next = next = event.keyCode === 40 ? next.nextElementSibling : next.previousSibling;
            }while(next &&  !next.children[1].children)
            if(next && next.children[1].children && next.children[1].children.length > 0){
                
                let element = Array.from(next.children[1].children).sort((a,b) => {
                    let nextStartA = Math.abs(parseInt(a.dataset.start)-start);
                    let nextStartB = Math.abs(parseInt(b.dataset.start)-start);

                    //let nextStopA = Math.abs(parseInt(a.dataset.stop)-stop);
                    //let nextStopB = Math.abs(parseInt(b.dataset.stop)-stop);
                    
                    return nextStartA-nextStartB //> nextStopA-nextStopB ? nextStartA-nextStartB : nextStopA-nextStopB
                })

                let toFocus = element[0] || next.children[1].children[0];
                if(toFocus){
                    toFocus.focus();
                    setTimeout(() => {
                        document.getElementById(toFocus.id) && (document.getElementById(toFocus.id).focus())
                    }, 10);
                }
            }
        }
    }

    const Row = ({ index, style }) => (
        <EpgChannel day={day} Shift={channelsPlaylist[index].shift} chId={channelsPlaylist[index].stream_id} key={index} Name={channelsPlaylist[index].name} Image={channelsPlaylist[index].stream_icon} Epg={channelsPlaylist[index].epg_channel_id} moveFocus={moveFocus} style={style} leftScroll={leftScroll} catchup={channelsPlaylist[index].tv_archive_duration}></EpgChannel>
      );
    /*
    ORIGINALE:
    {channelsPlaylist.map((x,id)=> (
        <EpgChannel day={day} key={id} Name={x.Name} Image={x.Image} Epg={x.Epg} moveFocus={moveFocus}></EpgChannel>
    ))}

    <List
      width={convertRemToPixels(370)}
      height={convertRemToPixels(50)}
      itemCount={channelsPlaylist.length}
      itemSize={convertRemToPixels(10)}
    >
      {Row}
    </List>
    */

    let height = 0;
    height = convertVhToPixels("100vh")-convertRemToPixels(9)

    return (
        <Container>
            <NavBar day={day}></NavBar>
            <ClosePopup onClick={close}><i className="far fa-times-circle"></i></ClosePopup>
            <ChannelsContainer style={{overflow:"auto"}}   ref={scrollRef} onScroll={centerLogo} >
                <div>
                    <TimeBar day={day} h24={h24==="HH:MM"} scrollBtn={navButtonScroll}/>
                    <EpgChannelsContainer>
                        <List
                          height={height}
                          itemCount={channelsPlaylist.length}
                          itemSize={convertRemToPixels(10)}
                          style={{overflowX:"hidden", overflowY:"auto", bottom:0, marginTop:"0.6rem"}}
                          ref = {listRef}
                          useIsScrolling={true}
                        >
                          {Row}
                        </List>
                        {day === 0 && (<TimeLongLine/>)}
                    </EpgChannelsContainer>
                </div>
            </ChannelsContainer>
            <Popup/>
        </Container>
    )
}

export default EpgFullListing

