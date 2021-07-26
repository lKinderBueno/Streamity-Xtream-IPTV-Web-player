import React, {useState, useEffect} from "react"
import  {useHistory, useLocation}  from 'react-router-dom'
import "./LateralBar.css"


const LateralBar = () => {
    const [navbar,setNavbar] = useState(false)
    //const keyboard = Keyboard();

    const location = useLocation();
    const history = useHistory()

    useEffect(()=>{
        setNavbar(location.pathname.includes("menu"))
    },[location.pathname])


    return (
        <>
        {/*window.gSTB && (
        <LateralBarTv>
            <div>
                <Button style={location.pathname.includes("live") ? {borderColor:"var(--second-color)"}:{}}>
                    <i className="fas fa-tv"></i>
                </Button>
                <Button style={location.pathname.includes("movie") ? {borderColor:"var(--second-color)"}:{}}>
                    <i className="fas fa-film"></i>
                </Button>
                <Button style={location.pathname.includes("series") ? {borderColor:"var(--second-color)"}:{}}>
                    <i className="fas fa-video"></i>
                </Button>
            </div>
        </LateralBarTv>
        )*/}
        <div className={`netflix-nav netflix-nav-black ${navbar ? "visible" : ""}`}>
        	<div className={`netflix-nav netflix-nav-red ${navbar ? "visible" : ""}`}>
        		<div className={`netflix-nav netflix-nav-white ${navbar ? "visible" : ""}`}>

        			<button className="netflix-nav-btn netflix-close-btn" onClick={()=>history.goBack()}><i className="fas fa-times"></i></button>

        			<img className="netflix-logo" src="/img/banner_b.png" alt="Player Logo" />

        			<ul className="netflix-list">
                    <li>
                        <button className="lateral-focus" onClick={()=>{!location.pathname.includes("live") && (history.replace("/live/"))}}>
                        <i className="fas fa-tv mr-1"></i>Live Channels
                        </button>
                    </li>
                    {location.pathname.includes("live") && (
                    <li>
        				<ul>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace(location.pathname.replace("menu",location.pathname.replace("menu","search")))}>
                                <i className="fas fa-search mr-2"></i>
                                Search
                                </button>
                            </li>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace(location.pathname.replace("menu","tvguide"))}>
                                <i className="fas fa-tv mr-2"></i>
                                TV Guide
                                </button>
                            </li>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace("/live/category/")}>
                                <i className="fas fa-grip-lines mr-2"></i>
                                Select category
                                </button>
                            </li>
        				</ul>
        			</li>)}


                    <li>
                        <button className="lateral-focus" onClick={()=>{!location.pathname.includes("movie") && (history.replace("/movie/"))}}>
                        <i className="fas fa-film mr-1"></i>Movies
                        </button>
                    </li>
                    {location.pathname.includes("movie") && (
                    <li>
        				<ul>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace(location.pathname.replace("menu","search"))}>
                                <i className="fas fa-search mr-2"></i>
                                Search
                                </button>
                            </li>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace("/movie/category/")}>
                                <i className="fas fa-grip-lines mr-2"></i>
                                Select category
                                </button>
                            </li>
        				</ul>
        			</li>)}


                    <li>
                        <button className="lateral-focus" onClick={()=>!location.pathname.includes("series") && history.replace("/series/")}>
                        <i className="fas fa-video mr-2"></i>
                        TV Series
                        </button>
                    </li>
                    {location.pathname.includes("series") && (
                    <li>
        				<ul>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace(location.pathname.replace("menu","search"))}>
                                <i className="fas fa-search mr-2"></i>
                                Search
                                </button>
                            </li>
                            <li>
                                <button className="lateral-focus" onClick={()=>history.replace(location.pathname.replace("menu","/series/category/"))}>
                                <i className="fas fa-grip-lines mr-2"></i>
                                Select category
                                </button>
                            </li>
        				</ul>
        			</li>)}
                    <li>
                        <button className="lateral-focus" onClick={()=>history.replace("/info/")}>
                        <i className="fas fa-user-alt mr-2"></i>
                        Account info
                        </button>
                    </li>
        			</ul>
        		</div>
        	</div>
        </div>
        </>
    )
}

export default LateralBar
