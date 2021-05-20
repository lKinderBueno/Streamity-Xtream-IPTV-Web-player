import React, {useState, useEffect} from "react"
import "./Groups.css"
import styled from "styled-components"
import {useSelector} from "react-redux"
import {useHistory, useParams} from "react-router-dom";
import {getGroup} from "../../other/last-opened-mode"



const Input = styled.input`
&:focus{
    border-color: var(--second-color);
    box-shadow: 0 0 0 0.2rem var(--second-color-shadow);
    transition: all .5s ease;
}`


const Groups = () => {
    const [navbar,setNavbar] = useState(false)
    const [searchValue, setSearchValue] = useState("");

    const history = useHistory();
    const { playingMode, category } = useParams();
    
    const groupsTemp = useSelector(state => state.groupsList);
    const [groups, setGroups] = useState(groupsTemp)

    const closeBar = () => {
        setNavbar(false)
        setTimeout(()=> history.goBack(),500);
    }

    useEffect(()=>{
        setNavbar(isNaN(category))
    },[category])

    const searchGroup = (text) =>{
        setSearchValue(text);
        setGroups(text ? groupsTemp.filter(x=> x.category_name.toLowerCase().includes(text.toLowerCase())) : groupsTemp)
    }

    useEffect(()=>{
        setSearchValue()
        setGroups(groups)
    },[groupsTemp])

    const selectGroup = (gp) =>{
        setNavbar(false);
        if(gp===-1 && playingMode !== "live")
            setTimeout(()=>history.replace(`/${playingMode}/`), 500);
        else{
            setGroups(groups[gp].category_id)
            setTimeout(()=>history.replace(`/${playingMode}/category/${groups[gp].category_id}/`), 500);
        }
    }


    useEffect(() => {
        if(!groups || groups.length===0)
            history.replace("/")
    }, []);

    return (
        <>
        <div className={`netflix-nav-rev netflix-nav-rev-black ${navbar ? "visible" : ""}`}>
        	<div className={`netflix-nav-rev netflix-nav-rev-red ${navbar ? "visible" : ""}`}>
        		<div className={`netflix-nav-rev netflix-nav-rev-white ${navbar ? "visible" : ""}`}>
                    <div className="row">
                        <div className="col-7">
                            < Input className = "form-control"
                                type = "text"
                                spellCheck = {false}
                                placeholder = "Search category..."
                                onChange = {(e) => searchGroup(e.target.value)}
                                value = {searchValue}
                            />
                        </div>
                        <div className="col-auto">
                            <button className="netflix-nav-rev-btn netflix-close-btn netflix-close-btn-reverse" onClick={closeBar}><i className="fas fa-times"></i></button>
                        </div>
                    </div>
                   

        			<ul className="netflix-list netflix-list-reverse">
                    {playingMode !== "live" && (
                        <li key={"GP-1"}>
                            <button tabIndex = {-1}
                                href = "#"
                                id={"*"} 
                                className = "lateral-focus hvr-grow-shadow group"
                                onClick={()=> selectGroup(-1)}
                                >
                                    All
                            </button>
                        </li>
                    )}
                    {groups && Array.isArray(groups) &&  (groups.map((gp,id) => (
                        <li key={"GP"+gp.category_id}>
                            <button tabIndex = {-1}
                                href = "#"
                                id={gp.category_id===getGroup() ? "selectedGp" : ""} 
                                className = "lateral-focus hvr-grow-shadow group"
                                onClick={()=> selectGroup(id)}
                                >
                                    {gp.category_name}
                            </button>
                        </li>
                    )))}
        			</ul>
        		</div>
        	</div>
        </div>
        </>
    )
}

export default Groups
