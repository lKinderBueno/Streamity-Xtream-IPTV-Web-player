import React, {useState,useEffect} from 'react'
import "./MainMenu/MainMenu"
import styled from "styled-components"
import {getInfo, logout} from "../other/user_info"
import  {useHistory}  from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux"
import {setH24} from "../actions/h24"

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

const Li = styled.li`
font-size: 3rem;
text-align: left;

& > button{
    text-transform: none !important;
}

& > button:after{
    height: 0px !important;    
}
`

const Button = styled.button`
color: #fff;
background-color: var(--first-color) !important;
transition: all .5s ease;
width:100%;

&:after{
    height: 0px !important;
}

&:hover, &:focus{
    background-color: #829196;
    color:white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    transition: all .5s ease;
}
`

const ButtonLogout = styled.button`
color: #fff;
background-color: var(--second-color) !important;
transition: all .5s ease;
width:100%;

&:after{
    height: 0px !important;
}

&:hover, &:focus{
    background-color: var(--second-color) !important;
    color:white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    transition: all .5s ease;
}
`
const Checkbox = styled.input`
font-size: 3rem;
height: 3rem;
width: 3rem;
`



const AccountInfo = () => {
    const [style, setStyle] = useState();
    const info = getInfo();
	const history = useHistory();
    const dispatch = useDispatch()
    const h24 = useSelector(state => state.h24)

    useEffect(() => {
		setTimeout(()=>{
			setStyle("nav-active");
            document.getElementById("info-back").focus();
		},10)
    },[]);

    
    const back = (page) =>{
		setStyle();
        setTimeout(()=>{
		    history.goBack();
        },600)
	}

    return (
        <Container className={style}>
            <Box className="nav">
	        	<div className="nav__content">
	        		<ul tabIndex={0} className="nav__list" style={{padding: "0 20%"}}>
						<Li tabIndex={-1} className="nav__list-item">Username: <button className="hover-target">{info.username}</button></Li>
	        			<Li tabIndex={-1} className="nav__list-item">Password: <button className="hover-target">{info.password}</button></Li>
	        			<Li tabIndex={-1} className="nav__list-item">Max connections: <button className="hover-target">{info.max_connections}</button></Li>
	        			<Li tabIndex={-1} className="nav__list-item">Expire on: <button className="hover-target">{info.expiry.toGMTString()}</button></Li>
	        			<Li tabIndex={-1} className="nav__list-item">{info.message}</Li>
                        <Li tabIndex={-1} className="nav__list-item">
                            <div class="form-check" style={{paddingLeft: "0rem"}}>
                              <Checkbox class="form-check-input" type="checkbox" defaultChecked={h24==="HH:MM"} onChange={()=>dispatch(setH24(h24!=="HH:MM"))} id="h24"/>
                              <label class="form-check-label" for="h24" style={{paddingLeft: "1.5rem"}}>
                                Use 24H format
                              </label>
                            </div>
                        </Li>
                        <div class="row">
                            <div class="col-8">
                                <Li autoFocus tabIndex={-1} className="nav__list-item" id="info-back" onClick={() => back()}><Button className="form-control">RETURN BACK</Button></Li>
                            </div>
                            <div class="col-4">
                                <Li tabIndex={-1} className="nav__list-item" onClick={logout}><ButtonLogout className="form-control">LOGOUT</ButtonLogout></Li>
                            </div>
                        </div>

	        		</ul>
	        	</div>
	        </Box>
        </Container>
    )
}

export default AccountInfo
