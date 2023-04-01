import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import {useSelector, useDispatch} from "react-redux"

import {setPlaylist} from "../../actions/set-Playlist"
import {setGroupList} from "../../actions/set-Group"

import {resetMemory, setGroup} from "../../other/last-opened-mode"

import {loadGroup,loadPlaylist} from "../../other/load-playlist"
import {useParams, useHistory, Route,Switch, useLocation} from "react-router-dom";

import BackgroundPlayer from "./BackgroundPlayer"
import GroupRow from "./GroupRow"
import MoreInfo from "./MoreInfoVod"
import RowItem from "./RowItem"
import Player from "./Player"

import { VariableSizeList as List, VariableSizeGrid as Grid } from "react-window";
import {convertRemToPixels,convertVhToPixels} from "../../other/convert-rem"
import Popup from "../Popup/Popup"

import {
    Loading,
  } from '../../other/Player-github/style';

const Container = styled.div`
height: 100vh;
overflow: auto;
max-width: 100%;
overflow-x: hidden;
transition: filter 0.5s ease;
background-color: var(--first-color);
`

const Spin = styled.div`
height: 100vh;
overflow: auto;
overflow-y: auto;
max-width: 100%;
width: 100vw;
overflow-x: hidden;
background-color: transparent;
position: absolute;
z-index: 100000000000000000;

display:flex;
justify-content:center;
align-items:center;

`

const GroupRowContainer = styled.ul`
padding-top:2rem;
padding-bottom: 2rem;
background-color: var(--first-color);
list-style-type: none;
padding-left: 1.7rem;
max-width: 100vw;
overflow: hidden;
z-index:1;
`

const MainVod = () => {
    const { category, playingMode } = useParams();

    const [playlist, setPlaylistState] = useState([]);
    
    const [allItems, setAllItems] = useState(true)
    const [loadedCategory, setLoadedCategory] = useState(-1)
    const [showPopup, setShowPopup] = useState(false);

    const categories = useSelector(state => state.groupsList);

    const [randomMovie, setRandomMovie] = useState()

    const [blurBackground, setBlurBackground] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()

    const query = useQuery();
    const searchText = query.get("search");

    useEffect(() => {
        location.pathname.match(/info|fullscreen|menu/) ? showBlur(1) : showBlur(0);
      }, [location.pathname]);

    useEffect(()=>{
        location.pathname.match(/info|fullscreen|menu/) ? showBlur(1) : showBlur(0);
        setAllItems(((isNaN(category) && category === undefined) || location.pathname.match(/info|fullscreen|menu/)))
        if(!location.pathname.match(/info|fullscreen|menu/)) 
            setRandomMovie({...searchRandomMovie((isNaN(category) && category === undefined) ? playlist : playlist.filter(x=> x.category_id === category))})
    },[])

    useEffect(() => {
        if(!searchText){
            setShowPopup(0)
            return;
        }
        const searched = searchText ? playlist.filter(x => x.name.toLowerCase().includes(searchText.toLowerCase())) : playlist
        if (searched.length === 0) {
            setShowPopup(1)
        }
    }, [searchText]);

    useEffect(() => {
        if(location.pathname.match(/info|fullscreen|menu/) || category === loadedCategory) 
            return;

        setLoadedCategory(category);
        setAllItems(((isNaN(category) && category === undefined) || location.pathname.match(/info|fullscreen|menu/)))

        showBlur(1);
        setIsLoading(true);

        if (resetMemory(playingMode)) {
            loadGroup(playingMode).then(gps => {
                dispatch(setGroupList(gps || []));
                if (!gps || gps.length === 0) {
                    history.replace("/")
                    return;
                }
            })               
        }
        loadPlaylist(playingMode, category).then(chs => {
            dispatch(setPlaylist(chs || []));
            showBlur(0);
            setPlaylistState(chs || []);
            setRandomMovie({...searchRandomMovie((isNaN(category) && category === undefined) ? chs : chs.filter(x=> x.category_id === category))})
        })
    }, [dispatch, category, playingMode])

    const showBlur = (mode) =>{
        setBlurBackground(mode !== 0 ? {filter:"blur(.5rem)"} : {});
        if(mode===0)
            setIsLoading(false)
    }

    const Row = ({ index, style }) => (
        index===0 ?
            randomMovie && randomMovie.name ? 
                <BackgroundPlayer key={`bg-${randomMovie.stream_id || randomMovie.series_id}`} name={randomMovie.name} category_id={randomMovie.category_id} stream_id={randomMovie.stream_id || randomMovie.series_id} isSeries={playingMode==="series"} stream_icon={randomMovie.stream_icon || randomMovie.cover}/>
                :
                <div></div>
        :
            <GroupRow 
            key={categories[index-1].category_id} 
            category_id={categories[index-1].category_id} 
            name={categories[index-1].category_name} 
            isSeries={playingMode==="series"} 
            playlist={playlist.filter(s => s.category_id === categories[index-1].category_id && (searchText ? s.name.toLowerCase().includes(searchText.toLowerCase()) : true))} 
            style={{...style, paddingLeft: "1.8rem"}}/>
    );

    const Cell = ({ columnIndex, rowIndex, style }) => {
        if(rowIndex === 0){
            if(columnIndex !== 0)
                return null
            else{
                return randomMovie && randomMovie.name ? 
                <BackgroundPlayer key={`bg-${randomMovie.stream_id || randomMovie.series_id}`} name={randomMovie.name} category_id={randomMovie.category_id} stream_id={randomMovie.stream_id || randomMovie.series_id} isSeries={playingMode==="series"} stream_icon={randomMovie.stream_icon || randomMovie.cover} existingTmdb={randomMovie.tmdb}/>
                :
                <div></div>
            }
        }else{
            const index = ((rowIndex-1)*6)+columnIndex;
            if(!playlist[index] || (searchText && !playlist[index].name.toLowerCase().includes(searchText.toLowerCase())))
                return null;
            return(
                <RowItem id={index} key={"vod"+playlist[index].stream_id} 
                name={playlist[index].name} stream_icon={playlist[index].stream_icon} 
                stream_id={playlist[index].stream_id} 
                stream_url={playlist[index].direct_source} 
                category_id={playlist[index].category_id}  
                existingTmdb={playlist[index].tmdb}
                last={false} style={{...style,paddingBottom:".7rem"}}/>
          )

        }
    };


    return (
        <div>
            <Route path="/:playingMode/">
                { isLoading === true && (<Spin>
                    <Loading color={"var(--second-color);"}>
                        <div>
                          <div />
                          <div />
                          <div />
                        </div>
                    </Loading>
                </Spin>)}
                <Container style={categories.length < 100 && allItems ? blurBackground : {...blurBackground, overflowY:"hidden"}}>
                    {categories.length < 100 && allItems && randomMovie && (randomMovie.stream_id || randomMovie.series_id) && (<BackgroundPlayer key={`bg-${randomMovie.stream_id || randomMovie.series_id}`} name={randomMovie.name} category_id={randomMovie.category_id} stream_id={randomMovie.stream_id || randomMovie.series_id} isSeries={playingMode==="series"} stream_icon={randomMovie.stream_icon || randomMovie.cover}/>)}
                    <GroupRowContainer style={(categories.length > 100 && allItems) ? {paddingLeft: "0rem", paddingTop:0} : {} }>
                    {allItems ?
                        (window.gSTB || categories.length > 100 ?
                            <List
                          height={convertVhToPixels("100vh")}
                          itemCount={categories.length + 1}
                          itemSize={(index) => index === 0 ? convertVhToPixels("70vh") : convertVhToPixels("15vw")*1.8}
                          useIsScrolling={true}
                          style={{overflowX:"hidden"}}
                        >{Row}</List>
                        :
                        categories.map(x=> (<GroupRow key={x.category_id} category_id={x.category_id} name={x.category_name} isSeries={playingMode==="series"} playlist={playlist.filter(s => s.category_id === x.category_id && (searchText ? s.name.toLowerCase().includes(searchText.toLowerCase()) : true))}/>))
                        )
                    :
                    ( <Grid
                        columnCount={6}
                        columnWidth={(index)=> index===0 ? convertVhToPixels("15vw") : (convertVhToPixels("15vw"))}
                        height={convertVhToPixels("100vh")}
                        rowCount={parseInt(Math.round((playlist.length / 6)))+1}
                        rowHeight={(index)=> index===0 ? convertVhToPixels("70vh") : (convertVhToPixels("15vw")*1.5)}
                        width={convertVhToPixels("90vw")}
                        useIsScrolling={true}
                        style={{overflowX:"hidden"}}    
                      >
                        {Cell}
                      </Grid>
                    )}
                    </GroupRowContainer>             
                </Container>
                {showPopup && <Popup title={`No stream found with '${searchText}'`} description={"Search will be resetted."} icon={"fas fa-search"}  onclick={()=>{
                  setShowPopup(0);
                  history.replace(location.pathname.split("?")[0])
                }}/>}
                <Switch>
                    <Route path="/movie/category/:category/:stream_id/play">
                        <Player/>
                    </Route>
                    <Route path="/movie/category/:category/:stream_id/info">
                        <MoreInfo key={"info-"+category}/>
                    </Route>
                </Switch>
            </Route>
        </div>
    )
}

export default MainVod


function searchRandomMovie(playlist){
    playlist = playlist.filter(x=> !x.name.match(/xxx|porn|sex|bbc|bitch|cunt|cock|cum|piss|anal|tits|blowjob|masturbate|dick|suck|gangbang/i));
    const tempPlaylist = playlist.filter(x=> x.rating >= 7)
    if(tempPlaylist.length > 0){
        return {...tempPlaylist[Math.floor(Math.random() * tempPlaylist.length)]}
    }else return {...playlist[Math.floor(Math.random() * playlist.length)]}
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}
  