import React from 'react'
import { useGlobal } from 'reactn'

import Header from '../header/header'
import Footer from '../footer/footer'

import { ToastContainer, Slide } from 'react-toastify';
import { Box } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import styled from 'styled-components'

const JikanStatusDiv = styled(Box)`
    background-color: ${props => props.jikanstatus ? green["A700"] : red["A200"]};
    color: ${props => props.jikanstatus ? "black" : "white"};
    text-align: center;
`

const PaddingDiv = styled.div`
    box-sizing: border-box;
    padding: 80px 20px 20px;
`

export default function Wrapper(props) {
    const [jikanStatus] = useGlobal('jikanStatus')

    return (
        <>
            <Header />
            <PaddingDiv>
                <JikanStatusDiv jikanstatus={jikanStatus.status ? "true" : ""} mb={1} boxShadow={2}>
                    JIKAN API: {jikanStatus.status ? `AKTİF [${jikanStatus.version}]` : "KAPALI"}
                </JikanStatusDiv>
                {props.children}
                <Footer />
            </PaddingDiv>
            <ToastContainer transition={Slide} />
        </>
    )
}