# Streamity.tv v2 Xtream IPTV Player (by IPTVEditor.com)

![](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/raw/master/github-pic/top.png)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/lKinderBueno/StreamityTV-Xtream)
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CVT6HXLZ3YNSG&source=url)


### Official Streamity.tv website: [Click here](https://streamity.tv)

Streamity is an online webplayer. Watch IPTV Channels, movies TV series online on your browser with no additional software required!

### DISCLAIMER: Streamity is a player. No stream or movies is included. Pictures are just for demo purpouse.

### Features
- Xtream Api support
- Customizable name and logo
- Modern design and smooth animations
- EPG Viewer
- 12h/24h EPG time format support
- Pic in picture player
- Automatic fix and improve movie and series name
- Favorites
- Continue to watch for vod and series
- Automatic select next series episode
- React js

### Other Pictures
![](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/raw/master/github-pic/channels.png?1)
![](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/raw/master/github-pic/vod.png)


### Installation
1. Download latest release: [Click here](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/releases)
2. Open with a text editor (for example notepad++) config.js and complete empty fields ( window.dns). More instructions are available inside the file.
3. Open with a text editor (for example notepad++) config.php and write your mysql database info (database url, database name, username, password) and epg xml url. (if you don't use epg you can skip part 2 and 3)
4. Import "sql_table.sql" in your mysql database (if you are using phpMyAdmin click on "import" -> select the sql_table.sql and click on execute)

5. [OPTIONAL] Open with a text editor (for example notepad++) config.css if you want to change main color and background one.
6. [OPTIONAL] Change favicon.ico and img > banner_w.png

7. Copy and paste all the files in your server. Use the root folder, like http://domain.com/ (don't use folders like http://domain.com/player/ !)

To avoid wasting server resources, epg update will be triggered when an user login and database has less than 12 hours of programmes.
