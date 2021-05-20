import React, {useState, useEffect} from "react"
import styled from 'styled-components'
import { useHistory, useParams, useLocation } from 'react-router';
import "./Search.css"

const Container = styled.div`
position:absolute;
width:100%;
height:100%;
top:0;
left:0;
z-index: 5;
transition: all .5s ease;
opacity: 0;
`

const Box = styled.form`
position: relative;
width: 50% ;
left: 25% ;
top: 50% ;
display:flex;
`

const Input = styled.input`
&:focus{
    color:white;
    border-color: var(--second-color);
    box-shadow: 0 0 0 0.2rem var(--second-color-shadow);
    background-color: var(--first-color);
    transition: all .5s ease;
}`

const ClearButton = styled.button`
color: #fff;
background-color: var(--first-color);
border-color: var(--second-color);
transition: all .5s ease;
margin-right: 0.3rem;


&:hover, &:focus{
    background-color: #829196;
    color:white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    transition: all .5s ease;
}
`

const SearchButton = styled.button`
color: #fff;
background-color: var(--second-color);
transition: all .5s ease;
margin-left: 0.3rem;


&:hover, &:focus{
    background-color: #829196;
    color:white;
    border-color: #829196;
    box-shadow: 0 0 0 0.2rem #82919608;
    transition: all .5s ease;
}
`

const Search = () => {
    const query = useQuery();
    const history = useHistory();

    const [searchValue, setSearchValue] = useState(query.get("search") || "");
    const [startingEffect, setStartingEffect] = useState();

    const { playingMode, category } = useParams();

    useEffect(() => {
        setTimeout(()=> setStartingEffect("blur-search"),1)
    }, [])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        alert(`Submitting Name ${searchValue}`)
    }
  


    const close = (e) => {
        e.preventDefault();  
        if(!searchValue){
            clear();
            return;
        }
        setStartingEffect();
        setTimeout(()=> {
            history.replace(category ? `/${playingMode}/category/${category}/?search=${searchValue}` : `/${playingMode}/?search=${searchValue}`);
        },300)      
    }

    const clear = () => {
        setStartingEffect();
        setTimeout(()=> {
            history.replace(category ? `/${playingMode}/category/${category}` : `/${playingMode}/`);
        },300)
    }

    return (
        <>
            <Container className={startingEffect}>
                <Box onSubmit={handleSubmit}>
                    <ClearButton type="button" className="btn" onClick={clear}>
                        <i className="fa fa-times"></i>
                    </ClearButton>
                    < Input className = "form-control"
                    type = "text"
                    spellCheck = {false}
                    placeholder = "Search stream..."
                    onChange = {(e) => setSearchValue(e.target.value)}
                    value = {searchValue}
                    />
                    <SearchButton value="1" type="submit" className="btn" onClick={close}>
                        <i className="fa fa-search"></i>
                    </SearchButton>
                </Box>
            </Container>
            {/*showKeyboard !== false && isMag && (<KeyboardOverlay onValueChange={onChangeKeyboard} onKeyboardClose={onKeyboardClose} itemValue={showKeyboard}/>)*/}
        </>
    )
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }

export default Search
