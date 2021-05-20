import React, {useEffect, useRef} from 'react'
import styled from "styled-components"
import {useSelector,useDispatch} from "react-redux"
import {useHistory, useParams} from "react-router-dom";
import {setGroup, getGroup} from "../../other/last-opened-mode"

import "../../other/Transition.css"

const Background = styled.div`
width:100vw;
height:100vh;
background-color: transparent;
right:0;
top:0;
position: absolute;
z-index:100;
transition: all 1s ease;
`

const Container = styled.div`
position: absolute;
height:100vh;
width:75vw;
right:0;
top:0;
transition: all .5s ease;
transform: translateX(75vw);
`

const SmokeEffect = styled.div`
position: absolute;
height:100vh;
width:25vw;
background-image: linear-gradient(to left, #212121 0% , transparent);
right:50vw;
top:0;
z-index:11;
`

const GroupContainer = styled.div`
position: absolute;
background-color:#212121;
right:0vw;
top:0;
height:100vh;
width:50vw;
z-index:15;
vertical-align: middle;
padding: 1rem 0;
`

const GroupList = styled.ul`
right:1rem;
list-style: none;
display: table-cell;
vertical-align: middle;
min-height:calc(100vh - 5rem);
height:calc(100vh - 5rem);
width:45vw;
&:focus{
    outline-width: 0px;
}
`

const GroupScroller = styled.div`
height:calc(100vh - 7rem);
padding: 1rem 1.5rem;
overflow:auto;
`

const GroupItem = styled.li`
display: block;
color:white;
text-align: end;
font-size: 1.5rem;
border-radius: 5px;
overflow: hidden;
text-overflow: ellipsis;
text-decoration: none;
padding-right: 1rem;
transition: all .15s ease;

&:hover, &:focus{
    outline-width: 0px;
    cursor: pointer;
    background-color: #fff;
    color: #020d18;
}
`

const Title = styled.h1`
color:white;
text-align: center;
`

const CloseMessage = styled.h5`
color:white;
text-align: center;
`


const ClosePopup = styled.a`
color:white;
position:absolute;
right:49vw;
margin-bottom: .5rem;
font-weight: 500;
line-height: 1.2;
font-size: 2.5rem;
transition: all .15s ease;

&:hover{
    color: #020d18;
    cursor: pointer;
}
`

let timeout;
const Groups = () => {
    const gpContainerRef = useRef(null)
    const backGroundRef = useRef(null)
    const dispatch = useDispatch()
    const history = useHistory();
    const { playingMode } = useParams();
    const category = getGroup();
    
    const groups = useSelector(state => state.groupsList);


    const selectGroup = (gp) =>{
        setGroup(groups[gp].category_id)
        history.replace(`/${playingMode}/category/${groups[gp].category_id}/`);
    }

    useEffect(() => {
        if(!groups || groups.length==0)
            history.replace("/")
        setTimeout(()=>{
            backGroundRef.current && (backGroundRef.current.style.backgroundColor="#00000085");
            gpContainerRef.current && (gpContainerRef.current.style.transform="translateX(0)");
        }, 100);
    }, []);

    const closePopup = () =>{
        backGroundRef.current.style.backgroundColor="transparent";
        gpContainerRef.current.style.transform="translateX(75vw)";
        setTimeout(()=>{
            history.replace(`/${playingMode}/category/${category}/`);
        }, 150);
    }

    return (
        <Background ref={backGroundRef}>
            <Container ref={gpContainerRef}>
                <SmokeEffect onClick={closePopup}/>
                <GroupContainer>
                    <ClosePopup href="#" onClick={closePopup}><i className="far fa-times-circle"></i></ClosePopup>
                    <Title>Choose a Category</Title>
                    <GroupScroller style={{overflow:"auto"}}>
                        <GroupList tabIndex={0} autoFocus>
                            {groups.map((gp,id) => (
                                <GroupItem tabIndex={-1} className={"hvr-grow-shadow group"}
                                id={gp.category_id===category ? "selectedGp" : ""} 
                                key={"GP"+gp.category_id} 
                                onClick={()=>selectGroup(id)}
                                >{gp.category_name}</GroupItem>
                            ))}
                        </GroupList>
                    </GroupScroller>
                    {/*window.gSTB && (<CloseMessage>Press <i className="fas fa-long-arrow-alt-left"></i> to close</CloseMessage>)*/}
                </GroupContainer>
            </Container>
            
        </Background>
    )
}

export default Groups
