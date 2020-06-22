# Streamity.tv Xtream version

![](https://streamity.tv/asset/img/git-min.png)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/lKinderBueno/StreamityTV-Xtream)

### Official Streamity.tv website: [Click here](https://streamity.tv))

Streamity is an online webplayer. Watch IPTV Channels, movies TV series online on your browser,
directly from your PC, phone or tablet, everywhere with no additional software required!

### (URL version: [Click here](https://github.com/lKinderBueno/Streamity-URL-IPTV-Web-player))


### Features
- Xtream Api support
- Customizable name and logo
- EPG Viewer
- Support to epg xml api, epg api, epg database mode
- EPG Shift in dashboard (each customer can shift epg)
- TMDB Api Support
- Save last movie and series watched
- Save last episode watch
- Automatic select next series episode
- Automatic fix and improve movie and series name
- Hide live/movie/series player
- Hide EPG
- Recatpcha 
- Pic in picture player
- Mobile friendly
- Save credentials
- Most of the code runs client side
- Javascript pure

### Other Pictures
![](https://streamity.tv/asset/img/2-min.png)
![](https://streamity.tv/asset/img/11-min.png?1)


### Installation
1. Download the latest release: [Click here](https://github.com/lKinderBueno/Streamity-Xtream-IPTV-Web-player/releases)
2. Extract everything in your domain folder (for example public_html)
3. Run installer.php (for example domain.com/installer.php)
4. Compile all the fields and then press on Install
5. Done


### Installer configuration
Basic configuration:
- IPTV Name: Your IPTV Service name (ex. Streamity)
- Upload IPTV Logo: Your IPTV Logo
- Upload IPTV Icon: Your IPTV Icon
- Replace index page with dashboard: your index page will be replaced with the dashboard page

IPTV configuration:
- IPTV Provider Host: your iptv provider url. It is required to login and fetch user data

EPG configuration:
- XML + Database (reccomended for 20MB+ epg file): Every 4 hours Streamity.tv player will convert your epg xml file into an SQL database. This settings is the most reccommended if your epg xml file is over 20MB and will offer the best experience to your customer.
- API Epg: The epg will loaded every time a customer will access to "live player". The epg url will be generated using xtream api.
- API Epg - Low Ram: If your iptv provider epg is heavy this will increase the player loading times. 
Enabling this mode every time an user click on a channel, the relative epg will be downloaded. 
Server loading times will be reduced a lot, but the EPG viewer will be disabled because totally incompatible with this mode.
- Disable Epg

TMDb Api (optional)
- Streamity.tv syncs missing Vods and Series info (as cover, description, episode series title etc etc) with TMDb Api. VODs and Series info will be searched first from IPTV provider server and then from TMDb.

reCAPTCHA v2 (optional)
- reCAPTCHA is a free security service that protects your websites from spam and abuse. It will be integrated in the login page. 
IMPORTANT: Is advised to use an SSL protocol (https) in the login page to avoid issue with reCAPTCHA

Disable components
- Disable Live channels
- Disable Movie
- Disable Series

Advanced configuration (optional)
- When a customer login for the first time on Streamity.tv player on a new browser, the server will calculate the number of channels/vods/series avaible on the account.
This procedure will delay the login of 30-40 seconds for IPTV lists with a lot of channels.
Checking this box will disable this feature.
Number of channels/vod/series will be continue to be calculated during the opening of each player.
(for example: Live channels player will calculate only number of live channels)

