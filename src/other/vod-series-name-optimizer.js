export function optimizeName(name) {
   name = name.replace("\r", "").replace(/(-\s*\d{2,4})|vod|fhd|hd|360p|4k|h264|h265|24fps|60fps|720p|1080p|vod|x264|x265|\.avi|\.mp4|\.mkv|\[.*]|\(.*\)|\{.*\}|-|_|\./gim, " ").replace(/(- \d\d\d\d$)/, "");
   name = name.replace("   ", " ");
   name = name.replace("  ", " ");
   return name.trim();
}

export function secondsToHms(d) {
   d = Number(d);
   var h = Math.floor(d / 3600);
   var m = Math.floor(d % 3600 / 60);
   var s = Math.floor(d % 3600 % 60);
   return `${h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
}

export function createMovieInfo(name, image, tmdbId = -1, releaseDate = "", coverBig = "", youtubeTrailer = "", director = "", actors = "", cast = "", description = "", plot = "", age = "", country = "", genre = "", backdropPath = "", durationSecs = 0, duration = "", rating10 = 0, status = "Released", runtime = 0) {
   return {
      "info": {
         "name": name,
         "tmdb_id": tmdbId,
         "cover_big": coverBig,
         "movie_image": image,
         "releasedate": releaseDate,
         "youtube_trailer": youtubeTrailer,
         "director": director,
         "actors": actors,
         "cast": cast,
         "description": description,
         "plot": plot,
         "age": age,
         "country": country,
         "genre": genre,
         "backdrop_path": [
            backdropPath
         ],
         "duration_secs": durationSecs,
         "duration": duration,
         "rating": rating10,
         "status": status,
         "runtime": runtime
      },
   }
}

export function createEpisode(url, id, season, episode_number, duration_sec = 0, duration = "", title = "", airdate = "", crew = "", rating = "0", image = "", overview) {
   return {  //season
      "episode_num": episode_number,
      "title": title === "" ? `Episode ${episode_number}` : title,
      "container_extension": "mp4",
      "url": url,
      "id": id,
      "overview": overview,
      "info": {
         "air_date": airdate,
         "crew": crew,
         "rating": parseInt(rating),
         "id": id,
         "movie_image": image,
         "duration_secs": duration_sec,
         "duration": duration,
      },
      "season": season,
   }
}