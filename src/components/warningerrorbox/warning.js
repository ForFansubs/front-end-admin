import React from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import WarningIcon from '@material-ui/icons/Warning'
import yellow from '@material-ui/core/colors/yellow'
import styled from 'styled-components'

const ContentEpisodesError = styled(Box)`
    border-left: ${yellow.A200} 4px solid;
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px
    }
`

export default function WarningBox(props) {
    const { children, mb, bgcolor, variant } = props

    return (
        <ContentEpisodesError boxShadow={2} p={1} bgcolor={bgcolor ? bgcolor : "background.level2"} mb={mb ? mb : 0}>
            <WarningIcon /><Typography variant={variant ? variant : "subtitle2"}>{children}</Typography>
        </ContentEpisodesError>
    )
}