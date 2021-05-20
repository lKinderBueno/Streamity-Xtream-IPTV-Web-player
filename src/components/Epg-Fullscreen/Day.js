import React from 'react'
import styled from 'styled-components'
import {Link, useLocation } from "react-router-dom";

const DayLi = styled.li`
margin-right: .9375rem;
display: inline;

& > a{
    padding: 0;
    color: #fff;
    background-color: transparent;
    border-radius: 1.375rem;
    text-decoration: none;
    white-space: nowrap;
    font-size:.9rem

}

& > a > span{
}`

const selectedDay = {
    alignItems: "center",
    lineHeight: "1.2",
    padding: ".35rem 1.5625rem",
    maxHeight: "2.8rem",
    borderRadius: "1.375rem",
    backgroundColor: "#2359a2",
    overflow: "hidden",
    textTransform: "uppercase"
}



function Day({name, isSelected, date}) {
    const location = useLocation();

    return (
        <DayLi>
            <Link href="#" to={generateUrlFromDate(location.pathname,date)} style={isSelected ? selectedDay : {}}>
                <span>{name}</span>
            </Link>
        </DayLi>
    )
}

const generateUrlFromDate = (url, date) =>{
    if(!date)
        date = "";
    url = url.replace(/\/$/,"");
    let splitted = url.split("/");
    let d = splitted[splitted.length-1];
    if(isNaN(new Date(d).getTime())){
        return url + "/" + date + "/";
    }else return `${splitted.slice(0,-1).join("/")}/${date ? date+"/" : ""}`;

}

export default Day
