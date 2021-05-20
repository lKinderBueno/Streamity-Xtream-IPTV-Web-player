import {findParentBySelector} from "../key-navigation"
let focusMainVodKeyboard = null;


export const MainVodKeyboard = {
    left: (focus) => {
        if(focus.id==="btn-2")
            return document.getElementById("btn-1")
        let element = focus.previousElementSibling;
        while(element){
            if(element.classList.contains("vod")){
                focusMainVodKeyboard = focus.previousElementSibling
                break;
            }
            else element = element.previousElementSibling;
        }
        return element ? element : window.gSTB ? -1 : focus;
    },
    right: (focus) => {
        if(focus.id==="btn-1")
            return document.getElementById("btn-2")
        let element = focus.nextElementSibling;
        while(element){
            if(element.classList.contains("vod")){
                focusMainVodKeyboard = element
                break;
            }
            else element = element.nextElementSibling;
        }
        return element || focus;
    },
    down: (focus) =>{
        let p = findParentBySelector(focus, ".parent")
        let toFocus = focus;
        if(p && p.nextElementSibling){
            toFocus = p.nextElementSibling.querySelector(`.vod${focus.dataset.id && (`[data-id='${focus.dataset.id}']`)}`) || p.nextElementSibling.querySelector(".vod")
        }
        focusMainVodKeyboard = toFocus;
        return toFocus;
    },
    up: (focus) =>{
        let p = findParentBySelector(focus, ".parent")
        let toFocus = focus;
        if(p && p.previousElementSibling){
            toFocus = p.previousElementSibling.querySelector(`.vod${focus.dataset.id && (`[data-id='${focus.dataset.id}']`)}`) || p.previousElementSibling.querySelector(".vod")
        }else toFocus = document.getElementById("btn-1")
        focusMainVodKeyboard = toFocus;
        return toFocus;
    },
    searchFocus: (focus) =>{
        if(focusMainVodKeyboard && document.body.contains(focusMainVodKeyboard))
            return focusMainVodKeyboard;
        return document.querySelector(".vod")
    },
    backMenu: true,
    enabled:true
}

export const CategoryVodKeyboard = {
    left: (focus) => {
        if(focus.id==="btn-2")
            return document.getElementById("btn-1")
        let element = focus.previousElementSibling;
        while(element){
            if(element.classList.contains("vod")){
                focusMainVodKeyboard = focus.previousElementSibling
                break;
            }
            else element = element.previousElementSibling;
        }
        return element ? element : window.gSTB ? -1 : focus;
    },
    right: (focus) => {
        if(focus.id==="btn-1")
            return document.getElementById("btn-2")
        let element = focus.nextElementSibling;
        while(element){
            if(element.classList.contains("vod")){
                focusMainVodKeyboard = element
                break;
            }
            else element = element.nextElementSibling;
        }
        return element || focus;
    },
    down: (focus) =>{
        let toFocus = focus;
        if(focus.tagName.toLowerCase()==="button"){
            let p = findParentBySelector(focus, ".parent")
            if(p && p.nextElementSibling){
                toFocus = p.nextElementSibling.querySelector(`.vod${focus.dataset.id && (`[data-id='${focus.dataset.id}']`)}`) || p.nextElementSibling.querySelector(".vod")
            }
            focusMainVodKeyboard = toFocus;
            return toFocus;
        }else{
            let i = 0;
            do{
                if(!toFocus.nextElementSibling)
                    break;
                toFocus = toFocus.nextElementSibling;
                i++;
            }while(i<6 || !toFocus || !toFocus.nextElementSibling)

            focusMainVodKeyboard = toFocus || focus;
            return focusMainVodKeyboard;
        }
    },
    up: (focus) => {
        let toFocus = focus;
        let i = 0;
        if (!toFocus.previousElementSibling)
            toFocus = document.getElementById("btn-1")
        else {
            do {
                if(!toFocus.previousElementSibling)
                    break;
                toFocus = toFocus.previousElementSibling;
                i++;
            } while (i < 6 || !toFocus || !toFocus.previousElementSibling)
        }

        focusMainVodKeyboard = toFocus || focus;
        return focusMainVodKeyboard;
    },
    searchFocus: (focus) =>{
        if(focusMainVodKeyboard && document.body.contains(focusMainVodKeyboard))
            return focusMainVodKeyboard;
        return document.querySelector(".vod")
    },
    backMenu: true,
    enabled:true
}

export const VodInfoKeyboard = {
    down: (focus) =>{
        const id = parseInt(focus.dataset.id)+1;
        return document.querySelector(".btn-info-"+id) || focus;
    },
    up: (focus) =>{
        const id = parseInt(focus.dataset.id)-1;
        return document.querySelector(".btn-info-"+id) || focus;
    },
    right: (focus) =>{
        const id = parseInt(focus.dataset.id);
        if(id===2)
            return document.querySelector(".btn-info-3") || focus;
    },
    left: (focus) =>{
        const id = parseInt(focus.dataset.id);
        if(id===3)
            return document.querySelector(".btn-info-2") || focus;
    },
    searchFocus: (focus) =>{
        return document.querySelector(".btn-info-1")
    },
    enabled:true
}