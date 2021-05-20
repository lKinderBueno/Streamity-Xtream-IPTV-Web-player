import React from 'react'
import styled from 'styled-components'

/*
const Container = styled.div`
position:relative;
bottom:1.5rem;
width:100%;
text-align:center;
color:white;
background-color: var(--first-color);
line-height:1rem;
transform: translate(0%,0%);
`

const Box = styled.div`
padding: 0 0.3rem;
margin-right: 0.5rem;
`

const Row = styled.div`
place-content: center;
justify-content: center;
`

const Column = styled.div`
display: flex;
`
*/

const FloatingRow = styled.div`
bottom: .2rem;
position: absolute;
color: white;
width: 50%;
background-color: var(--first-color);
`

const Tips = () => {
    return (
        <div>
            <FloatingRow style={{textAlign: "end",paddingRight:"10px"}}>
                <i className="fas fa-long-arrow-alt-left mr-2"></i>
                    Detailed TV guide
            </FloatingRow>
            <FloatingRow style={{right: 0, paddingLeft:"10px"}}>
                <i className="fas fa-long-arrow-alt-right mr-2"></i>
                        Category
            </FloatingRow>
        </div>
        
    )
}

export default Tips

/*
<Container>
            <Row className="row">
                <Column className="col-auto">
                    <i className="fas fa-long-arrow-alt-left mr-2"></i>
                    Detailed TV guide
                </Column>
                <Column className="col-auto">
                    <i className="fas fa-long-arrow-alt-right mr-2"></i>
                    Category
                </Column>
            </Row>
        </Container>
*/