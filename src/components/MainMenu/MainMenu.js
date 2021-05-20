import React, {useState,useEffect} from 'react'
import styled from "styled-components"
import  {useHistory}  from 'react-router-dom'

import "./MainMenu.css"
const Container = styled.div`
background-color: #212529;
position:absolute;
width:100%;
height:100%;
top:0;
left:0;
`

const Box = styled.div`
position: fixed;
z-index: 98;
&:before, &:after {
	content: "";
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: rgba(20, 21, 26,0.6);
	border-bottom-left-radius: 200%;
	z-index: -1;
	-webkit-transition: -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
	transition: -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
	transition: transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
	transition: transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, -webkit-transform cubic-bezier(0.77, 0, 0.175, 1) 0.6s, border-radius linear 0.8s;
	-webkit-transform: translateX(100%) translateY(-100%);
          transform: translateX(100%) translateY(-100%);
}
&:after {
	background: rgba(9,9,12,1);
	-webkit-transition-delay: 0s;
          transition-delay: 0s;
}
&:before {
	-webkit-transition-delay: .2s;
    transition-delay: .2s;
}
`

const MainMenu = () => {
	const [style, setStyle] = useState();
	const history = useHistory();
	
	useEffect(() => {
		setTimeout(()=>{
			setStyle("nav-active");
			document.querySelector(".nav__list-item") && (document.querySelector(".nav__list-item").focus());
		},10)
    },[]);

	const redirect = (page) =>{
		setStyle();
		setTimeout(()=>{
			history.push(page)
        },600)
	}

	const remoteController = (event) =>{
        const active = document.activeElement;
        if (event.keyCode === 40 && active.nextSibling) {
          active.nextSibling.focus();
        } else if (event.keyCode === 38 && active.previousSibling) {
          active.previousSibling.focus();
        }
        //clearTimeout(timeout);
    }

	/*const stopRemote = () =>{
        clearTimeout(timeout);
    }*/

	const moveFocus = (event) => {
        remoteController(event);
    }
	
    return (
        <Container className={style}>
            <Box className="nav">
	        	<div className="nav__content">
	        		<ul tabIndex={0} className="nav__list" onKeyDown={moveFocus} >
						<li tabIndex={-1} className="nav__list-item" onClick={() => redirect("/live/category/")}><button className="hover-target">Live Channels</button></li>
	        			<li tabIndex={-1} className="nav__list-item" onClick={() => redirect("/movie/")}><button className="hover-target">Movies</button></li>
	        			<li tabIndex={-1} className="nav__list-item" onClick={() => redirect("/series/")}><button className="hover-target">TV Series</button></li>
	        			<li tabIndex={-1} className="nav__list-item" onClick={() => redirect("/info/")}><button className="hover-target">account info</button></li>
	        		</ul>
	        	</div>
	        </Box>
        </Container>
    )
}

export default MainMenu
