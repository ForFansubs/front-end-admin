import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useGlobal } from 'reactn'

import clsx from 'clsx'
import useTheme from '@material-ui/styles/useTheme'
import makeStyles from '@material-ui/styles/makeStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import HomeIcon from '@material-ui/icons/Home'
import PublicIcon from '@material-ui/icons/Public'
import AccountCircle from '@material-ui/icons/AccountCircle'

import {
    indexPage,
    animePage,
    homePage,
    episodePage,
    mangaPage,
    userPage,
    permissionPage,
    administrativePage,
    logsPage
} from '../../config/front-routes'
import { fullLogo, fullLogoGif } from '../../config/theme/images'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.level2,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `100%`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        color: theme.palette.text.primary,
        [theme.breakpoints.down('sm')]: {
            marginRight: 10,
        },
        marginRight: 36,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    logoContainer: {
        display: "flex",
        flexGrow: 1,
    },
    logo: {
        height: "40px"
    },
    ListItemText: {
        fontSize: ".8rem!important"
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    }
}));

export default function MiniDrawer() {
    const classes = useStyles();
    const theme = useTheme();
    // eslint-disable-next-line
    const [userInfo] = useGlobal('user')
    const [adminPermList] = useGlobal('adminPermList')
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

    const [open, setOpen] = React.useState(false);
    const [menuItems] = React.useState([
        {
            text: "Ana sayfa",
            link: indexPage,
            perm: false,
            icon: <HomeIcon />
        },
        {
            text: "Anime",
            link: animePage,
            perm: "add-anime",
            icon: <h2>An</h2>
        },
        {
            text: "Bölüm",
            link: episodePage,
            perm: "add-episode",
            icon: <h2>Bö</h2>
        },
        {
            text: "Manga",
            link: mangaPage,
            perm: "add-manga",
            icon: <h2>Ma</h2>
        },
        {
            text: "Kullanıcı",
            link: userPage,
            perm: "add-user",
            icon: <h2>Ku</h2>
        },
        {
            text: "Yetki",
            link: permissionPage,
            perm: "add-permission",
            icon: <h2>Ye</h2>
        },
        {
            text: "Sistem",
            link: administrativePage,
            perm: "see-administrative-stuff",
            icon: <h2>Si</h2>
        },
        {
            text: "Kayıtlar",
            link: logsPage,
            perm: "see-logs",
            icon: <h2>Ka</h2>
        }
    ])
    const [menuItems2] = React.useState([
        {
            text: "Siteye dön",
            link: homePage,
            icon: <PublicIcon />
        }
    ])

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    const toggleDrawer = (open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(open);
    };

    function SidePanel() {
        return (
            <div
                className={classes.list}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    {menuItems.map((item, index) => adminPermList[item.perm] || item.perm === false ?
                        (
                            <NavLink to={item.link} exact onClick={handleDrawerClose} activeStyle={{ backgroundColor: theme.palette.background.level2 }} key={item.text}>
                                <ListItem button style={{ backgroundColor: "inherit" }}>
                                    <ListItemIcon style={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon>
                                    <ListItemText className={classes.ListItemText}><Typography variant="body2">{item.text}</Typography></ListItemText>
                                </ListItem>
                            </NavLink>
                        )
                        :
                        "")}
                </List>
                <Divider />
                <List>
                    {menuItems2.map((item, index) => (
                        <a href={item.link} key={item.text}>
                            <ListItem button>
                                <ListItemIcon style={{ color: theme.palette.text.primary }}>{item.icon}</ListItemIcon>
                                <ListItemText className={classes.ListItemText}><Typography variant="body2">{item.text}</Typography></ListItemText>
                            </ListItem>
                        </a>
                    ))}
                </List>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color="primary"
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link to={indexPage} className={classes.logoContainer}>
                        {
                            process.env.REACT_APP_HEADER_LOGO_TYPE === "gif" && fullLogoGif !== null ?
                                <img title="Site logo" loading="lazy" className={classes.logo} src={fullLogoGif} alt="Site Logo" />
                                :
                                <img title="Site logo" loading="lazy" className={classes.logo} src={fullLogo} alt="Site Logo" />
                        }
                    </Link>
                    <div style={{ padding: "12px", display: "flex", alignItems: "center" }}>
                        {userInfo.success ?
                            userInfo.avatar ?
                                <img src={userInfo.avatar} style={{ height: "25px" }} alt={`${userInfo.username} avatar`} aria-labelledby={`${userInfo.username} avatar`} />
                                :
                                <AccountCircle alt={`${userInfo.username} avatar`} aria-labelledby={`${userInfo.username} avatar`} />
                            :
                            <AccountCircle />
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                hysteresis={0.01}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            ><SidePanel /></SwipeableDrawer>

        </div >
    )
}