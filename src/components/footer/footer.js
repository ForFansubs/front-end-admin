import React from 'react'

import { useTheme } from '@material-ui/styles'
import styled from 'styled-components'

import { Box, Typography } from '@material-ui/core'

const FooterCopyrightText = styled.h4`
        a {
            text-decoration: none;
        }
    `

const FooterDiv = styled.footer`
    margin: 10px 0;
    position: absolute;
    width: 100%;
    height: 20px;
    right: 0px;
    bottom: 10px;
    left: 0px;
    padding: 0 20px;
`

export default function Footer() {
    const theme = useTheme()

    return (
        <>
            <FooterDiv theme={theme}>
                <FooterCopyrightText>
                    <Box display="flex" alignItems="center">
                        <a href="http://aybertocarlos.com" rel="noopener noreferrer" target="_blank">
                            <Typography variant="h6">aybertocarlos &copy; {(new Date()).getFullYear()}</Typography>
                        </a>
                    </Box>
                </FooterCopyrightText>
            </FooterDiv>
        </>
    )
}