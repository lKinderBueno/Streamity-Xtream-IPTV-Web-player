let focusMainChannelKeyboard = null;


export const MainChannelKeyboard = {
    down: (focus) =>{
        if(focus && focus.nextElementSibling)
            focusMainChannelKeyboard = focus.nextElementSibling;
        return focusMainChannelKeyboard;
    },
    up: (focus) =>{
        if(focus && focus.previousElementSibling)
            focusMainChannelKeyboard = focus.previousElementSibling;
        return focusMainChannelKeyboard;
    },
    searchFocus: (focus) =>{
        if(focusMainChannelKeyboard && document.body.contains(focusMainChannelKeyboard))
            return focusMainChannelKeyboard;
        return document.getElementById("selectedCh") || document.querySelector(".channel")
    },
    backMenu: true,
    enabled:false
}
