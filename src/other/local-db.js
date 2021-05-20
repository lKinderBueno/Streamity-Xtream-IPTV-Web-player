import {getInfo} from "./user_info"

let history = {live:[], movie:[], series:[]};
let favorite = {live:[], movie:[], series:[]};

export const initDb = () =>{
  let txt = localStorage.getItem("history-" + getInfo().username);
  txt ? (history = JSON.parse(txt)) : saveDB(0);

  txt = localStorage.getItem("favorite-" + getInfo().username);
  txt ? (favorite = JSON.parse(txt)) : saveDB(1);
}

const findOne = (type, key, fav) =>{
  const db = getDb(fav);
  const el = db[type].find(x=>parseInt(x.id) === parseInt(key))
  if(!el)
    return null;
  return el && fav !== true ? {...el, date: new Date(el.date)} : el;
}

const findAll = (type, fav) =>{
  if(fav !== true)
    return history[type].sort((a,b)=> a.date-b.date).map(x=> {return {...x, date : new Date(x.date)}});
  else return favorite[type];
}

const set = (type,key,value, fav) =>{
  const db = getDb(fav);
  
  fav !== true && (value = {...value, date: Date.now()})

  const i = db[type].findIndex(x=>x.id === key);
  i !== -1 ? db[type][i] = value : db[type].unshift(value) 

  reorderDB(fav);
  saveDB(fav);
}

const del = (type, key, fav) =>{
  if(fav !== true)
    history[type] = history[type].filter(x=> parseInt(x.id) !== parseInt(key));
  else favorite[type] = favorite[type].filter(x=> parseInt(x.id) !== parseInt(key));

  saveDB(fav);
}

const reorderDB = (fav) =>{
  if (fav !== true) {
    history.live = history.live.slice(0, 20).sort((a, b) => b.date - a.date)
    history.movie = history.movie.slice(0, 20).sort((a, b) => b.date - a.date)
    history.series = history.series.slice(0, 20).sort((a, b) => b.date - a.date)
  }else{
    favorite.live = favorite.live.slice(0, 30)
    favorite.movie = favorite.movie.slice(0, 30)
    favorite.series = favorite.series.slice(0, 30)
  }
}

const saveDB = (fav) =>{
  window.localStorage.setItem((fav !== true ? "history-" : "favorite-") + getInfo().username, JSON.stringify(fav !== true ? history : favorite));
}

const getDb = fav => fav !== true ? history : favorite

export default {findOne, findAll, set, del}