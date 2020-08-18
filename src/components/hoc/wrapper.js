import React from 'react'
import { useGlobal } from 'reactn'

import Header from '../header/header'

import { ToastContainer, Slide } from 'react-toastify';
import { makeStyles } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
    OutsideContainer: {
        display: "flex",
        width: "100%",
        height: "100%"
    },
    JikanStatusContainer: {
        backgroundColor: props => props.jikanStatus ? green["A700"] : red["A200"],
        color: props => props.jikanStatus ? "black" : "white",
        boxShadow: theme.shadows[2],
        textAlign: "center",
        marginBottom: theme.spacing(2)
    },
    PaddingDiv: {
        boxSizing: "border-box",
        padding: theme.overrides.defaultMargin,
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            padding: theme.overrides.defaultMarginMobile
        }
    },
    ScrollNode: {
        width: "100%",
        height: "100%",
        overflowY: "auto",
        "-webkit-transform": "translateZ(0)",
        transform: "translateZ(0)",
        '&::-webkit-scrollbar-track': {
            marginTop: 64,
            [theme.breakpoints.down('xs')]: {
                marginTop: 56
            }
        },
        [theme.breakpoints.down('sm')]: {
            overflowY: "scroll",
            scrollbarWidth: "none", /* Firefox */
            "-ms-overflow-style": "none"  /* Internet Explorer 10+ */
        }
    },
    MainContainer: {
        isolation: "isolate"
    },
    '@global': {
        '*::-webkit-scrollbar': {
            width: 8,
            [theme.breakpoints.down('sm')]: {
                width: 0,
                height: 0
            }
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: theme.palette.background.paper
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main
        }
    }
}))

export default function Wrapper(props) {
    const [jikanStatus] = useGlobal('jikanStatus')
    const classes = useStyles({ jikanStatus: jikanStatus.status })

    return (
        <>
            <div className={classes.OutsideContainer}>
                <Header />
                <div className={classes.ScrollNode} id="scroll-node">
                    <div className={classes.PaddingDiv}>
                        <div className={classes.JikanStatusContainer}>
                            JIKAN API: {jikanStatus.status ? `AKTİF [${jikanStatus.version}]` : "KAPALI"}
                        </div>
                        <section className={classes.MainContainer}>
                            {props.children}
                        </section>
                    </div>
                </div>
                <ToastContainer transition={Slide} />
            </div>

        </>
    )
}