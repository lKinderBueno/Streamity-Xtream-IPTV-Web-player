import React, {useState,useEffect} from 'react'
import styled from "styled-components"
import Episode from './Episode'
import {useDispatch} from "react-redux"
import {setPlaylistEpisodes} from "../../actions/set-Playlist-Episodes"
import {useHistory, useLocation, useParams} from "react-router-dom";
import DB from "../../other/local-db"
import {generateUrl} from "../../other/generate-url"

const Select = styled.select`
display: flex;
align-items: center;
min-width: 4em;
position: relative;
font-size: 1.3rem;
background-color: rgb(36, 36, 36);
color: white;
cursor: pointer;
border: 0.1em solid rgb(77, 77, 77);
border-radius: 0.2em;
outline: 0;
font-weight: 600;
padding: 0.3rem 0.5rem;

transition: all 0.2s ease;

&:focus, &:hover{
    border-color: white;
    box-shadow: 0 0 0 0.2rem rgb(255 255 255 / 25%);
}

& > option{

}
`

const Container = styled.div`

margin-top:1rem;
`

const Seasons = ({seasonData, cover}) => {
    const [seasons,setSeasons] = useState([])
    const [streamStat, setStreamStat] = useState({})
    const [selectedSeason, setSelectedSeason] = useState();

    const {stream_id} = useParams();

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    
    useEffect(()=>{
        if(!seasonData)
            return;
        const s = Object.keys(seasonData).map(x => {
            return {
                id: parseInt(x),
                name: "Season " + x,
                episodes: seasonData[x].map(y => {
                    return {
                        ...y,
                        episode_num: parseInt(y.episode_num),
                        url:  y.url || y.direct_source || generateUrl("series", y.id, y.container_extension),
                        url2: generateUrl("series", y.id, y.container_extension)
                    }
                })
            }
        });
        if(s.length > 0){
            setSeasons(s);

            let stat = DB.findOne("series",stream_id);
            (!stat && (stat={id: stream_id, season: s[0].id, episode: s[0].episodes[0].episode_num, start:0}))
            
            stat.season = parseInt(stat.season);
            stat.episode = parseInt(stat.episode);

            if(stat.tot>95 || stat.tot< 3){
                stat.tot = 0;
                let season = s.find(x=>x.id === stat.season);
                 
                if(season.episodes[season.episodes.length-1].episode_num > stat.episode){
                    stat.episode++;
                }else{
                    season = s.find(x=>x.id === stat.season+1);
                    if(season && season.episodes && season.episodes.length >0){
                        stat.season = season.id;
                        stat.episode = season.episodes[0].episode_num
                    }else stat={id: stream_id, season: s[0].id, episode: s[0].episodes[0].episode_num, start:0}
                } 
            }
                
            setSelectedSeason(stat.season);
            setStreamStat(stat)
        }
    }, [seasonData, stream_id])

    const playEpisode = (episode) =>{
        const list = seasons.find(x=>x.id === selectedSeason).episodes.map(x=> {return{...x, id:x.info.id}});
        dispatch(setPlaylistEpisodes(list))
        history.push(location.pathname.replace("info",`play/season/${selectedSeason}/episode/${episode}`))
    }

    return (
        <>
        <div className="row">
            <div className="col-8">
                <h3>Episodes</h3>
            </div>
            <div className="col-4">
                <Select className="form-select btn-block" onChange={e=> setSelectedSeason(parseInt(e.target.value))} value={selectedSeason || (seasons[0] && (seasons[0].id))} >
                    {seasons.map(x=> <option value={x.id} selected={selectedSeason === x.id} key={"season-"+x.id}>{x.name} ({x.episodes.length} episodes)</option>)}
                </Select>
            </div>
        </div>
        <Container>
            {streamStat && seasons.find(x=> x.id === selectedSeason) && (
                seasons.find(x=> x.id === selectedSeason).episodes.map(ep=>
                    <Episode  key={"ep-"+ep.episode_num}
                    episode={ep.episode_num} 
                    image={ep.info.movie_image || cover}
                    cover={cover}
                    duration={ep.info.duration_secs}
                    title={ep.title}
                    description={ep.overview}
                    selected={ep.episode_num===streamStat.episode}
                    percentage={ep.episode_num===streamStat.episode ? streamStat.tot : false}
                    playEpisode={playEpisode}
                    url={ep.url2}
                    />    
                )
            )}
        </Container>
        </>
    )
}

export default Seasons
