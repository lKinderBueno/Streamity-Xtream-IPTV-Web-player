import React, {useState,useRef,useEffect} from 'react'
import styled from 'styled-components';
import {useHistory} from "react-router-dom";
import {useAuth} from "../other/auth"
import Popup from "./Popup/Popup"
import Cookies from 'js-cookie'

const Container = styled.div`
position:absolute;
width:100%;
height:100%;
top:0;
left:0;
background-color: var(--first-color);
transition: all .5s ease;
overflow:hidden;

& > * >input{
    background-color: var(--first-color); 
    color:white;
}
`

const Box = styled.form`
width: 50vw;
left: 25vw;
top: 25vh;
position: absolute;

& > h2, & > h5{
    color:white;
    text-align: center;
}

& > label{
    color:white;
}
`

const Input = styled.input`
margin-bottom: 1rem;

&:focus{
    color:white;
    border-color: var(--second-color);
    box-shadow: 0 0 0 0.2rem var(--second-color-shadow);
    background-color: var(--first-color);
    transition: all .5s ease;
}
`

const Button = styled.button`
color: #fff;
background-color: var(--second-color);
transition: all .5s ease;
width:100%;

&:hover, &:focus{
    background-color: #829196;
    color:white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    transition: all .5s ease;
}
`

const Login = ({url}) => {
    
    const [dns, setDns] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [blur, setBlur] = useState();
    const [m3u8, setM3u8] = useState(window.m3u8warning === true  && !Cookies.get("m3u8_play"));

    const history = useHistory();
    const auth = useAuth();

    useEffect(() => {
        if(auth.isAuth())
            history.push(url||"/")
        else auth.authLogin(()=>history.push(url||"/"))
    },[auth,history]);
    
    useEffect(()=>{
        m3u8 ? setBlur({filter:"blur(.3rem)"}) : setBlur({});
    },[m3u8])

    const inputRef = useRef(0)

    const remoteController = (event) => {
        let active = document.activeElement;
        if (event.keyCode === 40 && active.nextSibling) {
            if(active.nextSibling.tagName==="LABEL")
                active = active.nextSibling;
            active.nextSibling.focus();
        } else if (event.keyCode === 38 && active.previousSibling) {
            if(active.previousSibling.tagName==="LABEL")
                active = active.previousSibling;
            active.previousSibling.focus();
        } else if (event.keyCode === 13)
            active.click();
    }

    const login = (e) =>{
        e.preventDefault();
        setBlur({filter:"blur(.3rem)"})
        auth.signin(dns ,username,password, 
            () => window.location="/"//history.replace("/")
            ,
            (title,description) => {
                setShowPopup({title:title,description:description});
            }
        )
    }

    const closePopup = () =>{
        setBlur({filter:"blur(0)"});
        setShowPopup(false);
        inputRef.current.focus();
    }

    return (
        <>
        <Container style={blur}>
            <Box onKeyDown={remoteController} onSubmit={login}>
                {false && (<h2>Welcome to {window.playername}</h2>)}
                <h2 className=''><img src="/img/banner_w.png" alt="" className="d-inline-block" style={{maxWidth: "30vw", maxHeight:"18vh"}}/></h2>
                
                <h5>Write your credentials to continue</h5>
                <br/>
                {!window.dns && 
                ([
                    <label>Provider URL:</label>,
                    <Input ref={inputRef} className="form-control" type="text" spellCheck={false} placeholder="http://domain.com:80" name="dns" autoFocus onChange={(e)=> setDns(e.target.value)} value={dns} />
                ])                
                }
                <label>Username</label>
                <Input ref={window.dns ? inputRef : null} className="form-control" type="text" spellCheck={false} placeholder="Username" name="username" autoFocus onChange={(e)=> setUsername(e.target.value)} value={username} />
                <label>Password</label>
                <Input className="form-control" type="password" spellCheck={false} placeholder="****" name="password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
                <Button type="button" value="1" onClick={login} className="btn">Login</Button>
            </Box>
        </Container>
        {showPopup && <Popup unsecure={true} title={showPopup.title} description={showPopup.description} icon={"fas fa-user-times"}  onclick={closePopup}/>}
        {m3u8 && (
            <Popup unsecure={true} error={false} title={"Informations"} description={"To login use your IPTVEditor's playlist username and password, not your email.<br/>IPTVEditor Web Player can play live channels streams only in M3U8 format.<br/>The conversion will be done automatically if streams are in Xtreamcodes format (this won't affect your playlist)."} icon={"fas fa-info-circle"} onclick={()=>  {Cookies.set("m3u8_play",1,{ expires: 365 }); setM3u8(!m3u8);}}/>
        )}
        {/*showKeyboard !== false && isMag && (<KeyboardOverlay onValueChange={onChange} onKeyboardClose={onKeyboardClose} itemValue={showKeyboard}/>)*/}
        </>
    )
}

export default Login
