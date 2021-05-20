import {nextInput} from "../key-navigation"

export const NavbarKeyboard = {
    down: (focus) =>{
        return nextInput(focus,document.querySelectorAll(".lateral-focus"),"lateral-focus", false) || focus;
    },
    up: (focus) =>{
        return nextInput(focus,document.querySelectorAll(".lateral-focus"),"lateral-focus", true) || focus;
    },
    searchFocus: (focus) =>{
        return document.querySelector(".lateral-focus")
    },
    right: () => 1
}
