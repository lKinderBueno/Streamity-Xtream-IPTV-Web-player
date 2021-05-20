import React from 'react'
import styled from "styled-components"

const Container = styled.div`
min-height: 2rem;
height: 6.5rem;
padding: 0.6rem;
border-radius: .2rem;
border: 0.1rem solid transparent;

border-top-color: black;
border-down-color: black;

cursor:pointer;

transition: background-color 0.3s ease, border-color 0.3s ease;

&:hover{
    background-color: #333;
    border-color: white;
}

& .playbtn{
    opacity: 0;
}

&:hover .playbtn{
    opacity: 1;
}

& *{
    cursor:pointer;
}
`

const Number = styled.div`
text-align:right;
`

const Image = styled.img`
    max-width: 100%;
    display: block;
`

const PlayButton = styled.div`
position: absolute;
display: flex;
place-content: center;
align-items: center;
height: 100%;
width: calc(100% - 1.5rem);
background-color: #00000033;
transition: opacity 0.3s ease;

`

const TitleContainer = styled.div`
display: inline;
align-items: center;

& > * {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

& > h5{
    -webkit-line-clamp: 1;
}

& > label{
    -webkit-line-clamp: 2;
    font-weight: 300;
}
`

const Bar = styled.div`
position: absolute;
display: flex;
height: 4%;
bottom: 0;
width: calc(100% - 1.9rem);
background-color: var(--first-color);

& > div{
    height:100%;
    background-color : var(--second-color);
}
`
 
const DownloadIcon = styled.a`
transition: font-size 0.2s ease;
font-size: 1rem;
cursor: pointer; 
color: white; 
&:hover{
    font-size: 1.4rem;
    color:white;
}
`

const Episode = ({episode, image, duration, title, description, selected, playEpisode, percentage, url}) => {
    return (
        <Container className="row" style={selected ? {backgroundColor: "#333"} : {}} onClick={()=>playEpisode(episode)}>
            <div className="col-1 align-self-center">
                <Number>{episode}</Number>
            </div>
            <div className="col-2 center-container">
                <PlayButton className="playbtn"><i className="fa fa-play"></i></PlayButton>
                {selected && percentage > 3 && percentage < 95 && (
                <Bar>
                    <div style={{width: percentage+"%"}}/>
                </Bar>
                )}
                <Image src={image}/>

            </div>
            <TitleContainer className="col-7 align-self-center">
                <h5>
                    {title}
                </h5>
                {description && (
                <label>
                    {description}
                </label>
                )}
            </TitleContainer>
            <div className="col-1 align-self-center">
                {secondsToHms(duration)}
            </div>
            <div className="col-1 center-container">
                <DownloadIcon href={url} target="_blank">
                    <i className="fas fa-download"></i>
                </DownloadIcon>
            </div>
        </Container>
    )
}

export default Episode

const secondsToHms = d => {
    if(!d)
        return "";
    d = parseInt(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    if (h) {
      return `${h}:${m<10 ? "0"+m : m}:${s<10 ? "0"+s : s}`;
    }

    return `${m}:${s<10 ? "0"+s : s}`;
  };
