import React from 'react'
import styled from 'styled-components'
import {convertRemToPixels} from "../../../other/convert-rem"

const Container = styled.div`
display: flex;
flex-flow: row;
flex-wrap: nowrap!important;
transform: translateY(0px);
`

const ArrowContainer = styled.div`
position: sticky;
top: 0;
z-index: 3;
display: inline-block;

& > div{
    justify-content: flex-end;
    background: linear-gradient(to right,#fff 0,#fff 92%,rgba(255,255,255,0) 100%);
    display: flex;
    align-items: center;
    height: 4.5rem;
}

`
const Arrow = styled.button`
border: none!important;
    cursor: pointer;
    min-width: 0!important;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 10%);
    border-radius: 1.375rem;
    width: 2.5rem;
    height: 2.5rem;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;

    &:focus{
        outline-width: 0px;
    }
`

const TimeLineDiv = styled.div`
    width: 6760px;
    display: inline-block;
    background: #fff;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 10%);

    & > div{
        height: 4.5rem;
        display: flex;
        align-items: center;
        position: relative;
    }

    & > div > button{
        position: absolute;
        left: 0;
        width: 1rem;
        white-space: nowrap;
        background: 0 0;
        border: none;
        outline: 0;
        padding: .4375rem 1.4375rem;
        font-size: .875rem;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        text-transform: none;
    }

`

const TimeLine = ({h24,scrollBtn}) => {
    let hours = [];
    if(h24 === true){
        for(let i = 0; i < 23; i++){
            let h= i+1<10 ? "0"+(i+1) : i+1;
            hours.push({text:`${h}:00`,margin: 12 + (17*i)});
        }
    }else{
        let counter = 0;
        for(let i = 0; i < 12; i++){
            let h = i;
            if(h===0)
                h=12;
            else h = h<10 ? "0"+i : i;
            hours.push({text:`${h}:00 AM`,margin: 12 + (17*counter)});
            counter++;
        }
        for(let i = 0; i < 12; i++){
            let h = i;
            if(h===0)
                h=12;
            else h = h<10 ? "0"+i : i;
            hours.push({text:`${h}:00 PM`,margin: 12 + (17*counter)});
            counter++;
        }
    }
    

    return (
        <Container>
            <ArrowContainer style={{left:0, marginRight: "-2.5rem"}} onClick={() => scrollBtn(-convertRemToPixels(30))}>
                <div style={{left:0, paddingLeft:"10px"}}>
                    <Arrow><i className="fas fa-arrow-left"></i></Arrow>
                </div>
            </ArrowContainer>
            <TimeLineDiv>
                <div>
                    {hours.map((x,id)=>(
                        <button key={"time"+id} style={{transform: `translateX(${x.margin}rem)`}}>
                            <span>{x.text}</span>
                        </button>
                    ))}
                </div>
            </TimeLineDiv>
            <ArrowContainer style={{right:0}}  onClick={() => scrollBtn(convertRemToPixels(30))}>
                <div style={{right:0, paddingRight:"10px"}}>
                    <Arrow><i className="fas fa-arrow-right"></i></Arrow>
                </div>
            </ArrowContainer>
        </Container>
    )
}

export default TimeLine
