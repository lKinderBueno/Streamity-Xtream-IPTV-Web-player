import {optimizeName, secondsToHms, createMovieInfo, createEpisode} from "./vod-series-name-optimizer"
import * as axios from "./axios";

export async function getVodTmdbData(name, existingTmdb){
    const language = navigator.language || navigator.userLanguage; 
    name = optimizeName(name);

    if(!window.tmdb){
      return createMovieInfo(name)
    }

    let tmdb = existingTmdb || await axios.get(`https://api.themoviedb.org/3/search/movie${language ? `?language=${language.toLowerCase()}&`:"?"}api_key=${window.tmdb}&query=${encodeURI(name)}`
    ,{ headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edg/86.0.622.28' }  } ).catch(err=> {return null});;
    
    if(existingTmdb || (tmdb && tmdb.data && tmdb.data.results.length>0)){
       let tmdbId = existingTmdb || tmdb.data["results"][0]["id"];
       tmdb = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}${language ? `?language=${language.toLowerCase()}&`:"?"}api_key=${window.tmdb}&append_to_response=images,credits,videos`,
       { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edg/86.0.622.28' }  } ).catch(err=> {return null});;
    
       if(tmdb && tmdb.data && !tmdb.data.success){
          tmdb = tmdb.data;
          
          let imageVod = "";
          let coverBig = "", durationSecs = 0, duration = "", rating10 = 0;
          let youtubeTrailer = "", releaseDate = "";
          let director = "", actors = "", cast = "", description = "", plot = "", age = "";
          let country = "", genre = "", backdropPath = "", status = "Released", runtime = 0;
    
          if(tmdb.title)
             name = tmdb.title;
          if(tmdb.poster_path){
             imageVod = `https://image.tmdb.org/t/p/original${tmdb.poster_path}`;
          }
          if(tmdb.images && tmdb.images.backdrops && tmdb.images.backdrops.length>0){
             coverBig = `https://image.tmdb.org/t/p/original${tmdb.images.backdrops[0].file_path}`;
          }
          if(tmdb.status)
             status = tmdb.status;
          if(tmdb.runtime){
             runtime = tmdb.runtime;
             durationSecs = runtime*60;
             duration = secondsToHms(durationSecs);
          }
          if(tmdb.vote_average)
             rating10 = tmdb.vote_average;
          if(tmdb.videos && tmdb.videos.results && tmdb.videos.results.length >0){
             let trailer = tmdb.videos.results.find(x=> x.type === "Trailer") || tmdb.videos.results.find(x=> x.type === "Teaser");
             if(trailer)
                youtubeTrailer = trailer.key;
          }
          if(tmdb.release_date){
             releaseDate = tmdb.release_date;
             age = `${parseInt((new Date() - new Date(releaseDate))/(1000*60*60*24))} days ago`;
          }
          if(tmdb.credits && tmdb.credits.cast){
             cast = tmdb.credits.cast.map(x=>x.name).join(', ');
             actors = cast;
          }
          if(tmdb.credits && tmdb.credits.crew){
             let crew = tmdb.credits.crew.filter(x=> x.job === "Director");
             if(crew){
                director = crew.map(x=>x.name).join(', ');
             }
          }
          if(tmdb.overview){
             description = tmdb.overview;
             plot = description;
          }
          if(tmdb.production_countries && tmdb.production_countries.length>0){
             country = tmdb.production_countries[0].name;
          }
          if(tmdb.genres)
             genre = tmdb.genres.map(x=>x.name).join(', ');
          if(tmdb.backdrop_path)
             backdropPath = `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`;
          return createMovieInfo(name, imageVod, tmdbId, releaseDate, coverBig,youtubeTrailer,director,actors, cast, description, plot, age, country, genre, backdropPath, durationSecs, duration, rating10, status, runtime)
       }else return null;
    }else return null;
}


export async function getSeriesTmdbData(name, streams, existingTmdb) {
   const language = navigator.language || navigator.userLanguage;
   name = optimizeName(name);

   let info = {};
   let episodes = {};

   let tmdb = existingTmdb || await axios.get(`https://api.themoviedb.org/3/search/tv${language ? `?language=${language.toLowerCase()}&`:"?"}api_key=${window.tmdb}&query=${encodeURI(name)}`, {
      headers: {
         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edg/86.0.622.28'
      }
   }).catch(err => {
      return null
   });;

   if (existingTmdb || (tmdb && tmdb.data && tmdb.data.results.length > 0)) {
      const tmdbId = existingTmdb || tmdb.data["results"][0]["id"];
      let seasons = "";
      streams && streams.length > 0  && (seasons =  Array.from(new Set(streams.map(x => x.season))).map(x=> `",season/${x}`))
      tmdb = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}${language ? `?language=${language.toLowerCase()}&`:"?"}api_key=${window.tmdb}&append_to_response=images,credits,videos${seasons}`, {
         headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.55 Safari/537.36 Edg/86.0.622.28'
         }
      }).catch(err => {
         return null
      });;

      if (tmdb && tmdb.data && !tmdb.data.success) {
         tmdb = tmdb.data;
         if (tmdb.name)
            info.name = tmdb.name;
         if (tmdb.poster_path)
            info.cover = `https://image.tmdb.org/t/p/original${tmdb.poster_path}`;
         if (tmdb.credits && tmdb.credits.cast)
            info.cast = tmdb.credits.cast.map(x => x.name).join(', ');
         if (tmdb.created_by)
            info.director = tmdb.created_by.map(x => x.name).join(', ');
         if (tmdb.genres)
            info.genre = tmdb.genres.map(x => x.name).join(', ');
         if (tmdb.first_air_date)
            info.releaseDate = tmdb.last_air_date;
         if (tmdb.vote_average) {
            info.rating = tmdb.vote_average.toString();
            info.rating_5based = tmdb.vote_average / 2;
         }
         if (tmdb.backdrop_path)
            info.backdrop_path = [`https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`];
         if (tmdb.videos && tmdb.videos.length > 0) {
            let trailer = tmdb.videos.find(x => x.Type === "Trailer");
            if (trailer)
               info.youtube_trailer = trailer.key;
         }
         if (tmdb.episode_run_time && tmdb.episode_run_time > 0)
            info.episode_run_time = tmdb.episode_run_time[0].toString();

         let duration_secEp = info.episode_run_time ? info.episode_run_time * 60 : 0;
         let durationEp = info.episode_run_time ? info.episode_run_time.toString() : 0;


         if (streams && streams.length > 0) {
            Array.from(new Set(streams.map(x => x.season))).forEach(season => {
               const eps = streams.filter(ch => parseInt(ch.season) === parseInt(season)).sort(function (a, b) {
                  return a.episode - b.episode
               });
               episodes[season.toString()] = [];

               eps.forEach(ep => {
                  if (tmdb[`season/${season}`]) {
                     let titleEp = "";
                     let airdateEp = "";
                     let crewEp = "";
                     let ratingEp = "0";
                     let imageEp = "";
                     let overview = "";
                     const epData = tmdb[`season/${season}`].episodes.find(x => parseInt(x.episode_number) === parseInt(ep.episode));
                     if (epData) {
                        titleEp = epData.name;
                        airdateEp = tmdb[`season/${season}`].air_date;
                        if (epData.crew)
                           crewEp = epData.crew.map(x => x.name).join(',');
                        if (epData.vote_average)
                           ratingEp = (epData.vote_average / 2).toString();
                        imageEp = epData.still_path ? `https://image.tmdb.org/t/p/original${epData.still_path}` : "";
                        overview = epData.overview;
                        episodes[season.toString()].push(createEpisode(ep.direct_source || ep.url, ep.id, ep.season, ep.episode, duration_secEp, durationEp, titleEp, airdateEp, crewEp, ratingEp, imageEp, overview));
                     } else episodes[season.toString()].push(createEpisode(ep.direct_source || ep.url, ep.id, ep.season, ep.episode, duration_secEp, durationEp));
                  } else {
                     episodes[season.toString()].push(createEpisode(ep.direct_source || ep.url, ep.id, ep.season, ep.episode, duration_secEp, durationEp));
                  }
               });
            })
         }
      } else {
         if (streams && streams.length > 0) {
            Array.from(new Set(streams.map(x => x.season))).forEach(season => {
               const eps = streams.filter(ch => parseInt(ch.season) === parseInt(season)).sort(function (a, b) {
                  return a.episode - b.episode
               });
               episodes[season.toString()] = [];

               eps.forEach(ep => {
                  episodes[season.toString()].push(createEpisode(ep.direct_source || ep.url, ep.id, ep.season, ep.episode));
               });
            })
         }
      }
   } else if (streams && streams.length > 0) {
      Array.from(new Set(streams.map(x => x.season))).forEach(season => {
         const eps = streams.filter(ch => parseInt(ch.season) === parseInt(season)).sort(function (a, b) {
            return a.episode - b.episode
         });
         episodes[season.toString()] = [];


         eps.forEach(ep => {
            episodes[season.toString()].push(createEpisode(ep.direct_source || ep.url, ep.id, ep.season, ep.episode));
         });
      })
   }
   return {
      "info": info,
      "episodes": episodes
   }
}

export function clearEpisodeName(seriesName, data){
   if(!data || !data.episodes)
      return;
   Object.keys(data.episodes).forEach(season=>{
      data.episodes[season].forEach(ep=>{
         ep.title = ep.title.replace(seriesName,"").replace(/S\d{1,2}E\d{1,2}/,"").trim();
         if(!ep.title || ep.title === "-")
            ep.title = "Episode " + (ep.episode_num || ep.episode)
      })
   })
}