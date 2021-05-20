import {useHistory,useLocation} from "react-router-dom";
import {MainChannelKeyboard} from "./Channel"
import {VodInfoKeyboard, MainVodKeyboard, CategoryVodKeyboard} from "./Vod"
import {NavbarKeyboard} from "./Navbar"
import {GroupKeyboard} from "./Group"

import {
    useState,
    useRef,
    useEffect,
    useCallback
} from "react";
// Usage
const KeydownLister = () => {
    // State for storing mouse coordinates
    const [focus, setFocusState] = useState();
    const history = useHistory();
    const location = useLocation();

    const controls = useRef({enabled:false})

    const setFocus = (element, delay) => {
        if(element === -1){
            history.push("menu/")
            return;
        }else if(element === 1){
            let loc = location.pathname.split("/");
            loc = loc.slice(0, loc.length-2).join("/")+"/";
            history.push(loc)
            return;
        }
        if(controls.current.nofocus || controls.current.enabled === false)
            return;
        //setTimeout(()=>{
            element = element ? element : controls.current.searchFocus()
            if(element){
                setFocusState(element)
                element.focus();
            }
        //},100)
    }


    const menuAssign = () =>{
        if(location){
            if(location.pathname.match(/search/)){
                controls.current = {disabled:true}
            }
            if(location.pathname.match(/category$/)){
                controls.current = GroupKeyboard
                !window.gSTB && (setFocus(null, true))
            }else if(location.pathname.includes("menu")){
                controls.current = NavbarKeyboard
                !window.gSTB && (setFocus())
            }else if(location.pathname.includes("live")){
                controls.current = MainChannelKeyboard
            }else if(location.pathname.includes("movie")){
                if(location.pathname.match(/info/))
                    controls.current = VodInfoKeyboard
                else if(location.pathname.match(/category/))
                    controls.current = CategoryVodKeyboard
                else controls.current = MainVodKeyboard
            }
            window.gSTB && (setFocus(null, location.pathname.includes("category")))
        }
    }
    
    useEffect(() => {
        setFocus()
        menuAssign()
    }, [])

    useEffect(()=>{
        console.log(location.pathname)
        menuAssign();
    },[location.pathname])

    // Event handler utilizing useCallback ...
    // ... so that reference never changes.
    const handler = useCallback(
        (event) => {
            if(controls.current.enabled === false)
                return;
            if ((!focus || !document.body.contains(focus)) && !controls.current.nofocus)
                setFocus();
            if ((!focus || !document.body.contains(focus)) && !controls.current.nofocus){
                console.log("no focus found")
                return;
            }

            if (event.keyCode === 39) { //right
                controls.current.right && (setFocus(controls.current.right(focus)));
            } else if (event.keyCode === 37) { //left
                controls.current.left && (setFocus(controls.current.left(focus)));
            } else if (event.keyCode === 40) { //down
                controls.current.down && (setFocus(controls.current.down(focus)));
            } else if (event.keyCode === 38) { //up
                controls.current.up && (setFocus(controls.current.up(focus)));
            } else if (event.keyCode === 27 || event.keyCode === 8) { //back
                if(controls.current.back)
                    controls.current.back(focus)
                else if(controls.current.backMenu)
                    history.push("menu");
                else history.goBack();
            } else if (event.keyCode === 13 || event.keyCode === 45)
               controls.current.focus && (controls.current.focus.click())
        },
        [focus]
    );
    // Add event listener using our hook
    useEventListener("keydown", handler);
    return focus;
}

export default KeydownLister


// Hook
function useEventListener(eventName, handler, element = window) {
    // Create a ref that stores handler
    const savedHandler = useRef();
    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect((focus) => {
        savedHandler.current = handler;
    }, [handler]);
    useEffect(
        () => {
            // Make sure element supports addEventListener
            // On
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;
            // Create event listener that calls handler function stored in ref
            const eventListener = (event) => savedHandler.current(event);
            // Add event listener
            element.addEventListener(eventName, eventListener);
            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
}