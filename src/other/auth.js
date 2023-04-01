import React, { useState, useContext, createContext } from "react";
import {Route,Redirect} from "react-router-dom"
import * as axios from "./axios";
import {setInfo} from "./user_info"
import Cookies from 'js-cookie'
import {initDb} from "./local-db"

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

export function useProvideAuth() {
  const [auth, setAuth] = useState(0);

  const signin = (dns, username, password, successFallback, failFallback) => {
    if(dns)
      axios.setDns(dns);
      
    axios.post("player_api.php",{
      username: username.trim(),
      password: password.trim(),
    }).then(result => {
      if(result){
        if(result.data)
          result = result.data
        else if(result.response && result.response.data)
          result = result.response.data
      }
      if(result && result.user_info){
        if(result.iptveditor)
          axios.setDns(`${process.env.REACT_APP_IPTVEDITOR_API}webplayer`);
        if(result.user_info.auth === 0)
          failFallback("No account found","No account found with inserted credentials." + (window.location.host.includes("iptveditor.com") ? "<br/>To login use your IPTVEditor's playlist username and password, not your email." : ""));
        else if(result.user_info.auth){
          if(result.user_info.status !== "Active")
            failFallback("Account expired",`Account expired on ${new Date(parseInt(result.user_info.exp_date+"000")).toGMTString()}`);
          else {
            setAuth(1);
            setInfo(result.user_info, result.server_info);
            initDb();
            successFallback && (successFallback());

          }
        }
      }else if(result.title){
        failFallback && (failFallback(result.title,result.body));
      }else{
        failFallback && (failFallback("Server error","Server didn't generated any reply. Please try later #2"));
      }
    }).catch(err => {
      console.log(err);
      if(err && err.response && err.response.data && err.response.data.user_info && err.response.data.user_info.auth === 0)
        failFallback && (failFallback("No account found","No account found with inserted credentials." + (window.location.host.includes("iptveditor.com") ? "<br/>To login use your IPTVEditor's playlist username and password, not your email." : "")));
      else failFallback && (failFallback("Server error","Server didn't generated any reply. Please try later #1"));
    })
  };

  const authLogin = (fallback) =>{

    const dns = window.dns.length === 0 && (Cookies.get("dns")) ;
    const username = Cookies.get("username");
    const password = Cookies.get("password");

    if(username && password)
      signin(dns,username,password,fallback);      
  }

  const signout = (action) => {
    setAuth(null);
    action && (action());
  };

  const isAuth = () => {
    return !!auth;
  }

  return {
    signin,
    signout,
    isAuth,
    authLogin
  };
}


export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}