import React from "react"
import  {Link,useLocation, useParams}  from 'react-router-dom'
import styled from "styled-components"
import {useSelector} from "react-redux"
import {useAuth} from "../other/auth"


const Nav = styled.nav`
height: 3rem;
background-color: var(--first-color);
border-bottom: 1px solid #000;
`;

const ContainerButton = styled.div`
position:absolute;
right:2rem;
top:.5rem;
display: flex;

& > a{
    color: #fff;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    text-transform: uppercase;
    display: flex;
    background: #829196;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
}

`

const CategoryButton = styled(Link)`
margin-right: 1rem;
&:hover {
    width: 11rem;
    -webkit-transition: width 1s;
    transition: width .5s;
    overflow:hidden;
    white-space: nowrap;
    border-radius:5px;
    text-decoration: none;
    color: #fff;
    padding-left:0.3rem;
    padding-right:0.3rem;
  }

&:hover::after {
    padding-left:0.3rem;
    padding-right:0.3rem;
    content: 'Select category';
}
`

const EPGButton = styled(Link)`
margin-right: 1rem;
&:hover {
    width: 8rem;
    -webkit-transition: width 1s;
    transition: width .5s;
    overflow:hidden;
    white-space: nowrap;
    border-radius:5px;
    text-decoration: none;
    color: #fff;
    padding-left:0.3rem;
    padding-right:0.3rem;
  }

&:hover::after {
    padding-left:0.3rem;
    padding-right:0.3rem;
    content: 'TV Guide';
}
`

const SearchButton = styled(Link)`
margin-right: 1rem;
&:hover {
    width: 8rem;
    -webkit-transition: width 1s;
    transition: width .5s;
    overflow:hidden;
    white-space: nowrap;
    border-radius:5px;
    text-decoration: none;
    color: #fff;
    padding-left:0.3rem;
    padding-right:0.3rem;
  }

&:hover::after {
    padding-left:0.3rem;
    padding-right:0.3rem;
    content: 'Search...';
}
`

const NavButton = styled(Link)`
margin-right: 1rem;
&:hover {
    width: 10rem;
    -webkit-transition: width 1s;
    transition: width .5s;
    overflow:hidden;
    white-space: nowrap;
    border-radius:5px;
    text-decoration: none;
    color: #fff;
    padding-left:0.3rem;
    padding-right:0.3rem;
  }

&:hover::after {
    padding-left:0.3rem;
    padding-right:0.3rem;
    content: 'Open menu';
}
`

const NavBar = () => {
    const fullScreen = useSelector(state => state.fullScreen);
    const location = useLocation();
    let auth = useAuth();

    const { playingMode } = useParams();

    return (
        <Nav className="navbar" style={{display : fullScreen ? "none" : ""}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/img/banner_w.png" alt="" height="20rem" className="d-inline-block align-top"/>
                </Link>
            </div>
            <ContainerButton>
                {auth.isAuth() && !location.pathname.includes("menu") && (
                <>
                    {location.pathname.includes("live") && (<EPGButton to={`${location.pathname.split("?")[0]}tvguide/`}><i className={"fas fa-tv"}></i></EPGButton>)}
                    
                    <SearchButton to={{
                        pathname : `${location.pathname.split("?")[0]}search/`,
                        search: window.location.search,
                    }}><i className={"fas fa-search"}></i></SearchButton>

                    <CategoryButton to={{
                        pathname: `/${playingMode}/category/`,
                        search: window.location.search,
                    }}><i className={"fas fa-grip-lines"}></i></CategoryButton>
                    <NavButton to={`menu/`}><i className="fas fa-ellipsis-v"></i></NavButton>
                </>)}
            </ContainerButton>
        </Nav>
    )
}

export default NavBar
