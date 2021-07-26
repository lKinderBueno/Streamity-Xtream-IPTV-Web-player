/*----- Player name -----*/
window.playername = "IPTVEditor Web Player";

/*----- DNS -----*/
//Iptv provider dns url (for example "http://domain.com:80")
window.dns = "http://domain.com:80";

/*----- CORS -----*/
/*/ Change on false if iptv provider has the Access-Control-Allow-Origin set on "*" or allows your player domain.
Leave on "true" in the other case. Player will use "proxy.php" file to manage the requests.  */
window.cors = true; //false

/*---- HTTPS -----*/
/* If streams are using an ssl protol change this box on true.*/
window.https = false;  //true;

/*----- TMDB API [OPTIONAL] -----*/
/* By default player will use movie info from the provider. In case these info are missing it will be used tmdb as alternative
Here you can get a tmdb api key: https://developers.themoviedb.org/3/getting-started/introduction  */
window.tmdb = "";





//!!!!!!! Don't change this !!!!!!!
document.getElementsByTagName("title")[0].innerText = window.playername