# Streamity.tv v2 Xtream version (by IPTVEditor.com dev)

![](https://streamity.tv/asset/img/git-min.png)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/lKinderBueno/StreamityTV-Xtream)
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CVT6HXLZ3YNSG&source=url)


### Official Streamity.tv website: [Click here](https://streamity.tv)

Streamity is an online webplayer. Watch IPTV Channels, movies TV series online on your browser,
directly from your PC, phone or tablet, everywhere with no additional software required!

### (URL version: [Click here](https://github.com/lKinderBueno/Streamity-URL-IPTV-Web-player))


### Features
- Xtream Api support
- Modern design and smooth animations
- Customizable name and logo
- EPG Viewer
- Support to epg
- Save last movie and series watched
- Save last episode watch
- Support to favorites
- Automatic select next series episode
- Automatic fix and improve movie and series name
- Pic in picture player
- Most of the code runs client side
- React js

### Other Pictures
![](https://streamity.tv/asset/img/2-min.png)
![](https://streamity.tv/asset/img/11-min.png?1)


### Installation
1. Download the latest release: [Click here](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/releases)
2. Open with a text editor (for example notepad++) config.js and complete empty fields ( window.dns). More instructions are available inside the file.
3. Open with a text editor (for example notepad++) config.php and write your mysql database info (database url, database name, username, password) and epg xml url. (if you don't use epg you can skip part 2 and 3)
4. Import "sql_table.sql" in your mysql database (if you are using phpMyAdmin click on "import" -> select the sql_table.sql and click on execute)

5. [OPTIONAL] Open with a text editor (for example notepad++) config.css if you want to change main color and background one.
6. [OPTIONAL] Change favicon.ico and img > banner_w.png

7. Copy and paste all the files in the root folder (don't use folders!)

To avoid wasting server resources, epg update will be triggered when an user login and database has less than 12 hours of programmes.