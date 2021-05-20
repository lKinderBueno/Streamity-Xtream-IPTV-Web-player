import React, {useEffect,useRef, useState} from 'react'
import styled from "styled-components"
import {useSelector, useDispatch} from "react-redux"
import Channel from "./Channel"
import {setPlayingChannel} from "../../actions/playingChannel"
import { FixedSizeList as List } from "react-window";
import {convertRemToPixels,convertVhToPixels} from "../../other/convert-rem"
import {useHistory,useLocation} from "react-router-dom";
import Popup from "../Popup/Popup"

const ChannelsList = styled.ul`
height: calc(95vh - 3rem);
padding: .8rem .6rem;
background-color: var(--first-color);
list-style-type: none;
border-left: 1px solid #000;
transform: translateY(-1px);
box-shadow: 0 7px 14px rgb(50 50 93 / 10%), 0 3px 6px rgb(0 0 0 / 8%);
&:focus{
    outline-width: 0px;
}
`

const Channels = ({playlist}) => {
    const playingChannel = useSelector(state => state.playingCh);
    
    const query = useQuery();
    const searchText = query.get("search");
    
    const [showPopup, setShowPopup] = useState(false);
    const [channelsPlaylist, setChannelsPlaylist] = useState(playlist);


    const dispatch = useDispatch()
    const history = useHistory();
    const location = useLocation();
    const listRef = useRef();

    
    useEffect(() => {
      if(playingChannel){
        setTimeout(()=>focusChannel(),100)
      }
    }, [playingChannel]);

    useEffect(() => {
      setChannelsPlaylist(playlist)
      setTimeout(()=>focusChannel(),100)
    }, [playlist]);


    useEffect(() => {
      const searched = searchText ? playlist.filter(x=> x.name.toLowerCase().includes(searchText.toLowerCase())) : playlist
      if(searched.length>0){
        setChannelsPlaylist(searched)
        setTimeout(() => focusChannel(), 100);
      }else if(searchText)
        setShowPopup(1)
      else history.push("/live/category/")
    }, [searchText]);

    const focusChannel = () => {
      if(document.getElementById("selectedCh"))
        document.getElementById("selectedCh").focus()
      else if(document.querySelector(".channel"))
        document.querySelector(".channel").focus()
    }


    const Row = ({ index, style }) => (
        <Channel key={channelsPlaylist[index].stream_id} 
                Name={channelsPlaylist[index].name} 
                Shift = {channelsPlaylist[index].shift} 
                Epg={channelsPlaylist[index].epg_channel_id} 
                id={channelsPlaylist[index].stream_id} Image={channelsPlaylist[index].stream_icon} 
                Number={channelsPlaylist[index].num} 
                selectEvent={() => {
                    dispatch(setPlayingChannel(channelsPlaylist[index]))
                }}
                virtualScrollStyle={style} 
                selected={playingChannel && playingChannel.stream_id === channelsPlaylist[index].stream_id} />
    );

    return (
      <>
        <ChannelsList tabIndex={0} >
            <List
              height={convertVhToPixels("95vh")-convertRemToPixels(5)}
              itemCount={channelsPlaylist.length}
              itemSize={convertRemToPixels(5)}
              style={{overflowY:"auto", maxHeight: "calc(95vh - 3rem)"}}
              useIsScrolling={true}
              ref={listRef}
            >
              {Row}
            </List>          
        </ChannelsList>
        {showPopup && <Popup title={`No stream found with '${searchText}'`} description={"Search will be resetted."} icon={"fas fa-search"}  onclick={()=>{
          setShowPopup(0);
          focusChannel();
          history.replace(location.pathname.split("?")[0])
        }}/>}
      </>
    )
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export default Channels
