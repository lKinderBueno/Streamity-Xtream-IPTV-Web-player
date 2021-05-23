import React, {useState} from "react"
import {HashRouter as Router, Route,Switch} from "react-router-dom"
import {PrivateRoute,ProvideAuth} from "./other/auth"
import "./App.css"

import NavBar from "./components/NavBar"
import MainMenu from "./components/MainMenu/MainMenu"
import AccountInfo from "./components/AccountInfo"
import Login from "./components/Login"

import LateralBar from "./components/LateralBar/LateralBar"

import MainLive from "./components/Live/MainLive"
import Groups from "./components/Group/Groups"
import Search from "./components/Search/Search"
import EpgFullListing from "./components/Epg-Fullscreen/EpgFullListing"

import MainVod from "./components/Vod/MainVod"

import {useDispatch} from "react-redux"
import {setTimer60} from "./actions/timer60"
import {setTimer5} from "./actions/timer5"


function App() {
  const dispatch = useDispatch()
  setInterval(() => dispatch(setTimer60()), 50000);
  setInterval(() => dispatch(setTimer5()), 5000);

  if(window.location.protocol !== 'https:' && window.https===true)
    window.location = window.location.href.replace("http","https");
  else if(window.location.protocol === 'https:'  && window.https===false)
    window.location = window.location.href.replace("https","http");

  let url = window.location.hash.replace("#","");

  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route>
            <Route path="/:playingMode/">
              <NavBar />
              <LateralBar/>
            </Route>
            <PrivateRoute exact path = "/">
              <MainMenu/>
            </PrivateRoute>

            <Switch>
              <PrivateRoute exact path="/:playingMode/category/"><Groups/></PrivateRoute>
              <PrivateRoute exact path="/:playingMode/category/:category/"></PrivateRoute>
            </Switch>

            <Switch>
              <PrivateRoute exact path="/:playingMode/category/:category/search/"><Search/></PrivateRoute>
              <PrivateRoute exact path="/:playingMode/search/"><Search/></PrivateRoute>
            </Switch>
            <Switch>
              <PrivateRoute exact path="/live/category/:category/tvguide/"><EpgFullListing/></PrivateRoute>
              <PrivateRoute exact path="/live/category/:category/tvguide/:date"><EpgFullListing/></PrivateRoute>
            </Switch>

            <Switch>
              <Route path="/login/"><Login url={url}/></Route>
              <PrivateRoute exact path = "/info/"><AccountInfo/></PrivateRoute>
              <PrivateRoute path = "/live/category/:category"><MainLive/></PrivateRoute>
              <PrivateRoute path = "/live/"><MainLive/></PrivateRoute>
              <PrivateRoute path = "/:playingMode/category/:category"><MainVod/></PrivateRoute>
              <PrivateRoute path = "/:playingMode/"><MainVod/></PrivateRoute>
            </Switch>
          </Route>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

export default App;


