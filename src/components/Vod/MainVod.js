import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import {useSelector, useDispatch} from "react-redux"

import {setPlaylist} from "../../actions/set-Playlist"
import {setGroupList} from "../../actions/set-Group"

import {resetMemory} from "../../other/last-opened-mode"

import {loadGroup,loadPlaylist} from "../../other/load-playlist"
import {useParams, useHistory, Route,Switch, useLocation} from "react-router-dom";

import BackgroundPlayer from "./BackgroundPlayer"
import GroupRow from "./GroupRow"
import MoreInfo from "./MoreInfo"
import PlayerSeries from "../Series/PlayerSeries"

import RowItem from "./RowItem"
import PlayerVod from "./PlayerVod"

import { VariableSizeList as List, VariableSizeGrid as Grid } from "react-window";
import {convertRemToPixels, convertVhToPixels} from "../../other/convert-rem"
import Popup from "../Popup/Popup"

import DB from "../../other/local-db"

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

    const [streamList, setStreamList] = useState([])  //downloaded provider
    const [playlist, setPlaylistState] = useState(streamList); //used on player
    
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

    const [refresh, setRefresh] = useState(1);

    useEffect(() => {
        if(location.pathname.match(/category/) && !category)
            showBlur(1)
        else location.pathname.match(/info|fullscreen|menu/) ? showBlur(1) : showBlur(0);
      }, [location.pathname, category]);

    useEffect(()=>{
        if(location.pathname.match(/category/) && !category)
            showBlur(1)
        else location.pathname.match(/info|fullscreen|menu/) ? showBlur(1) : showBlur(0);
        setAllItems(((isNaN(category) && category === undefined) || location.pathname.match(/info|fullscreen|menu/)))
        if(!location.pathname.match(/info|fullscreen|menu/)) 
            setRandomMovie({...searchRandomMovie((isNaN(category) && category === undefined) ? playlist : playlist.filter(x=> x.category_id === category))})
    },[category])

    useEffect(() => {
        if(!searchText){
            setPlaylistState(streamList)
            setShowPopup(0)
            return;
        }
        const searched = searchText ? streamList.filter(x => x.name.toLowerCase().includes(searchText.toLowerCase())) : streamList
        if (searched.length === 0) {
            setPlaylistState(streamList)
            setShowPopup(1)
        }else setPlaylistState(searched)
    }, [searchText]);

    useEffect(() => {
        const f = async()=> {
            let cat = categories
            const reset = resetMemory(playingMode);
            if(reset === false && (location.pathname.match(/info|fullscreen|menu/) || (location.pathname.match(/category/) && category === undefined) || category === loadedCategory)) {
                return;
            }

            setLoadedCategory(category);
            setAllItems(((isNaN(category) && category === undefined) || location.pathname.match(/info|fullscreen|menu/)))

            showBlur(1);
            setIsLoading(true);

            setRefresh(0)
            if (reset === true || cat.length === 0) {
                await loadGroup(playingMode).then(gps => {
                    if (!gps || gps.length === 0) {
                        history.replace("/")
                        return;
                    }
                    gps.unshift({category_id:"fav", favorite:1, category_name: "Only favorites"},{category_id:"toend", history: 1, category_name:"Continue to watch"})
                    dispatch(setGroupList(gps || []));
                    cat = gps
                })               
            }
            await loadPlaylist(playingMode, category || "ALL").then(chs => {
                if(category && isNaN(category)){
                    chs = chs.filter(s=> {
                        const f = DB.findOne(playingMode, playingMode === "series" ? s.series_id : s.stream_id, category === "fav")
                        return f && (category === "fav" ||  (f.tot > 3 &&  f.tot < 95) );
                    })
                }
                dispatch(setPlaylist(chs || []));
                showBlur(0);
                setStreamList(chs||[]);
                setPlaylistState(chs || []);
                setRandomMovie({...searchRandomMovie((isNaN(category) && category === undefined) ? chs : chs.filter(x=> x.category_id === category))})
                setRefresh(1)
            })
        }
        f().catch(err=>console.log(err))
    }, [dispatch, category, playingMode, location.pathname])

    const showBlur = (mode) =>{
        setBlurBackground(mode !== 0 ? {filter:"blur(.5rem)",  pointerEvents: "none"} : {});
        if(mode===0)
            setIsLoading(false)
    }

    const Row = ({ index, style }) => (
        index===0 ?
            randomMovie && randomMovie.name ? 
                <BackgroundPlayer 
                key={`bg-${randomMovie.stream_id || randomMovie.series_id}`} 
                name={randomMovie.name} category_id={randomMovie.category_id} 
                stream_id={randomMovie.stream_id || randomMovie.series_id} 
                isSeries={playingMode==="series"} 
                stream_icon={randomMovie.stream_icon || randomMovie.cover}
                style={style}
                existingTmdb={randomMovie.tmdb}
                title= {category && (isNaN(category) ? "Continue to watch" : categories.find(x=> parseInt(x.category_id) === parseInt(category)).category_name)}
                />
                :
                <div></div>
        :
            <GroupRow 
            key={categories[index-1].category_id} 
            category_id={categories[index-1].category_id} 
            name={categories[index-1].category_name} 
            isSeries={playingMode==="series"} 
            playlist={ getGroupRowPlaylist(index)} 
            style={{...style, paddingLeft: "1.8rem", textDecoration: "none"}}/>
    );

    const Cell = ({ columnIndex, rowIndex, style }) => {
        if(rowIndex === 0){
            if(columnIndex !== 0)
                return null
            else{
                return randomMovie && randomMovie.name ? 
                [<BackgroundPlayer 
                    key={`bg-${randomMovie.stream_id || randomMovie.series_id}`} 
                    name={randomMovie.name} category_id={randomMovie.category_id} 
                    stream_id={randomMovie.stream_id || randomMovie.series_id} 
                    isSeries={playingMode==="series"} 
                    stream_icon={randomMovie.stream_icon || randomMovie.cover}
                    style={style}
                    existingTmdb={randomMovie.tmdb}
                    title= {category && (isNaN(category) ? getOtherCategoryName(category) : categories.find(x=> parseInt(x.category_id) === parseInt(category)).category_name)}
                />,
                <div></div>]
                :
                <h3 style={{color:"white", marginLeft: "1%"}}>{category && categories.length > 0 && (isNaN(category) ? getOtherCategoryName(category) : categories.find(x=> parseInt(x.category_id) === parseInt(category)).category_name)}</h3>
            }
        }else{
            const index = ((rowIndex-1)*6)+columnIndex;
            if(!playlist[index])
                return null;
            return(
                <RowItem id={index} key={"vod"+(playlist[index].stream_id || playlist[index].series_id)} 
                name={playlist[index].name} 
                stream_icon={playlist[index].stream_icon || playlist[index].cover} 
                stream_id={playlist[index].stream_id || playlist[index].series_id} 
                stream_url={playlist[index].direct_source} 
                isSeries={playingMode==="series"} 
                container_extension={playlist[index].container_extension}
                category_id={playlist[index].category_id}  
                existingTmdb={playlist[index].tmdb}
                last={false} style={{...style,paddingBottom:".7rem", marginLeft:"1%", textDecoration: "none"}}/>
          )

        }
    };

    const getGroupRowPlaylist = (index) => {
        if (categories[index - 1].history === 1 || categories[index - 1].favorite === 1) {
            return playlist.filter(s => {
                const f = DB.findOne(playingMode, playingMode === "series" ? s.series_id : s.stream_id, categories[index - 1].favorite === 1)
                return f && (categories[index - 1].favorite === 1 || (f.tot > 3 &&  f.tot < 95));
            })
        } else {
            return playlist.filter(s => parseInt(s.category_id) === parseInt(categories[index - 1].category_id))
        }
    }

    const getOtherCategoryName = (cat) => cat === "fav" ? "Only favorites" : "Continue to watch"


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
                <Container style={{...blurBackground, overflowY:"hidden"}}>
                    <GroupRowContainer style={{paddingLeft: "0rem", paddingTop:0}}>
                    {refresh !== 0 &&
                    (allItems && playlist.length>0 ?
                        <List
                        refresh={refresh}
                          height={convertVhToPixels("100vh") - convertRemToPixels(3.5)}
                          itemCount={categories.length + 1}
                          itemSize={(index) => {
                              if(index === 0)
                                return convertVhToPixels("70vh");
                            else if(getGroupRowPlaylist(index).length > 0){
                                return convertVhToPixels("15vw")*1.8
                            }else {
                                return 0
                            }
                        }}
                          useIsScrolling={true}
                          style={{overflowX:"hidden"}}
                        >{Row}</List>
                    :
                        <Grid
                          columnCount={6}
                          columnWidth={(index)=> index===0 ? convertVhToPixels("16.6vw") : (convertVhToPixels("16.6vw"))}
                          height={convertVhToPixels("100vh") - convertRemToPixels(3.5)}
                          rowCount={parseInt(Math.ceil((playlist.length / 6)))+1}
                          rowHeight={(index)=> {
                              if(index===0){
                                  if((randomMovie && randomMovie.name))
                                    return convertVhToPixels("70vh")
                                else return convertVhToPixels("5vh")
                              }else return convertVhToPixels("15vw")*1.5
                        }}
                          width={convertVhToPixels("100vw")}
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
                    <Route path="/movie/category/:category/:stream_id/play/">
                        <PlayerVod/>
                    </Route>
                    <Route path="/series/category/:category/:stream_id/play/season/:season/episode/:episode/">
                        <PlayerSeries/>
                    </Route>
                    <Route path="/:playingMode/category/:category/:stream_id/info/">
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
  