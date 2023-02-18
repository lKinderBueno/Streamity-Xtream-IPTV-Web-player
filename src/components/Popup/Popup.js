import React, {useState,useEffect} from 'react'
import styled from 'styled-components'

const Container = styled.div`
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`

const Message = styled.div`
padding: 0rem 2rem;
color: #fff;
box-shadow: 0 15px 35px rgb(50 50 93 / 20%), 0 5px 15px rgb(0 0 0 / 17%);
pointer-events: auto;
border: 0 solid rgba(0, 0, 0, .2);
border-radius: .4375rem;
outline: 0;
`

const Header = styled.div`
border-color: rgba(255, 255, 255, .075);
display: flex;
padding: 1.25rem;
border-bottom: 0 solid #e9ecef;
border-top-left-radius: .4375rem;
border-top-right-radius: .4375rem;
align-items: flex-start;
justify-content: space-between;

& > h6{
    font-size: 1.0625rem;
    line-height: 1.1;
    margin-bottom: 0;
}

& > button{
    overflow: visible;
    text-transform: none;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1;
    float: right;
    text-shadow: none;
    transition: all .15s ease;
    border: 0;
    appearance: none;
    cursor: pointer;
    text-decoration: none;
    margin: -1rem -1rem -1rem auto;
    padding: 1.25rem;
    color: rgba(0, 0, 0, .9);
    outline: 0;
    background-color: transparent;
    opacity: .75;

    & > span{
        color:white;
    }
    
}
`

const Body = styled.div`
position: relative;
padding: 1.5rem;
flex: 1 1 auto;
text-align: center;

& > h4{
    font-size: .95rem;
    font-weight: 600;
    letter-spacing: .025em;
    text-transform: uppercase;
}


& > i{
    font-size: 3em;
    line-height:5rem;
}
`

const Footer = styled.div`
display: flex;
padding: 1.25rem;
border-top: 0 solid #e9ecef;
border-bottom-right-radius: .4375rem;
border-bottom-left-radius: .4375rem;
flex-wrap: wrap;
align-items: center;
justify-content: flex-end;
border-color: rgba(255, 255, 255, .075);
`

const ErrorButton = styled.button`
color: #212529;
border-color: #fff;
background-color: #e6e6e6;
box-shadow: none;
text-decoration: none;
cursor: pointer;

&:hover{
    background-color: #829196;
    color: white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    -webkit-transition: all .5s ease;
    transition: all .5s ease;
    background-color: var(--second-color);
}
`

const SafeButton = styled.button`
color: #212529;
border-color: #fff;
background-color: #e6e6e6;
box-shadow: none;
text-decoration: none;
cursor: pointer;

&:hover{
    background-color: #5536f5;
    color: white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    -webkit-transition: all .5s ease;
    transition: all .5s ease;
}
`


const Popup = ({type,title,description,icon, onclick, error=true, unsecure}) => {
    const [style, setStyle] = useState({
        opacity: 0,
        transform: "scale(0.9)",
        background: error === true ? "linear-gradient(87deg, #f5365c 0, #f56036 100%)" : "linear-gradient(87deg, #6536f5 0px, #36bbf5 100%)"
    });

    useEffect(() => {
        setStyle({
            opacity: 1,
            transform: "translateX(0)",
            transition: "opacity 300ms, transform 300ms",
            background: error === true ? "linear-gradient(87deg, #f5365c 0, #f56036 100%)" : "linear-gradient(87deg, #6536f5 0px, #36bbf5 100%)"
        })
    },[]);

    const onCloseEvent = () =>{
        setStyle({
            opacity: 0,
            transform: "scale(0.9)",
            transition: "opacity 300ms, transform 300ms",
            background: error === true ? "linear-gradient(87deg, #f5365c 0, #f56036 100%)" : "linear-gradient(87deg, #6536f5 0px, #36bbf5 100%)"
        })

        setTimeout(()=>{
            onclick && (onclick());
        },150)
    }

    return (
        <Container>
            <Message  style={style}>
                <Header>
                    <h6></h6>
                    <button onClick={onCloseEvent}><span>×</span></button>
                </Header>
                <Body>
                    <i className={icon + " ni-3x"}></i>
                    <h4>{title}</h4>
                    {unsecure === true ? 
                    (<p dangerouslySetInnerHTML={{__html:description}}></p>)
                    :
                    (<p>{description}</p>)
                    }
                </Body>
                <Footer>
                    {error === true ? 
                    (<ErrorButton autoFocus className="btn" onClick={onCloseEvent}>Ok, got it</ErrorButton>)
                    :
                    (<SafeButton autoFocus className="btn" onClick={onCloseEvent}>Ok, got it</SafeButton>)
                    }
                </Footer>
            </Message>
        </Container>
    )
}

export default Popup
