import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useGlobal, } from 'reactn'
import { useTranslation } from "react-i18next";
import Footer from '../footer/footer'

import { useStyles } from './styles'
import clsx from 'clsx'
import useTheme from '@material-ui/styles/useTheme'
import { Drawer, AppBar, Toolbar, List, Divider, ListItem, ListItemIcon, ListItemText, Typography, MenuItem, Menu, Box, IconButton } from '@material-ui/core'

import MenuIcon from '@material-ui/icons/Menu'
import HomeIcon from '@material-ui/icons/Home';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PublicIcon from '@material-ui/icons/Public'

import {
    indexPage,
    animePage,
    homePage,
    episodePage,
    mangaPage,
    motdPage,
    userPage,
    permissionPage,
    logsPage,
    mangaBolumPage
} from '../../config/front-routes'
import { fullLogo } from '../../config/theme/images'
import { AccountCircle } from '@material-ui/icons';

export default function MiniDrawer() {
    const { t } = useTranslation('components')
    const classes = useStyles();
    const theme = useTheme();
    // eslint-disable-next-line
    const [userInfo] = useGlobal('user')
    const [settings] = useGlobal('settings')
    const [adminPermList] = useGlobal('adminPermList')
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

    const [open, setOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([])
    const [menuItems2] = useState([
        {
            text: t('header.go_back_to_site.default'),
            shortText: t('header.go_back_to_site.short'),
            link: homePage,
            icon: <PublicIcon />
        }
    ])

    useEffect(() => {
        setMenuItems([
            {
                text: t('header.homepage.default'),
                shortText: t('header.homepage.short'),
                link: indexPage,
                perm: false,
                icon: <HomeIcon />
            },
            {
                text: t('header.anime.default'),
                shortText: t('header.anime.short'),
                link: animePage,
                perm: "see-anime",
                icon: <h2>{t('header.anime.logo')}</h2>
            },
            {
                text: t('header.episode.default'),
                shortText: t('header.episode.short'),
                link: episodePage,
                perm: "see-episode",
                icon: <h2>{t('header.episode.logo')}</h2>
            },
            {
                text: t('header.manga.default'),
                shortText: t('header.manga.short'),
                link: mangaPage,
                perm: "see-manga",
                icon: <h2>{t('header.manga.logo')}</h2>
            },
            {
                text: t('header.manga_episode.default'),
                shortText: t('header.manga_episode.short'),
                link: mangaBolumPage,
                perm: "see-manga-episode",
                icon: <h2>{t('header.manga_episode.logo')}</h2>
            },
            {
                text: t('header.motd.default'),
                shortText: t('header.motd.short'),
                link: motdPage,
                perm: "see-motd",
                icon: <h2>{t('header.motd.logo')}</h2>
            },
            {
                text: t('header.user.default'),
                shortText: t('header.user.short'),
                link: userPage,
                perm: "see-user",
                icon: <h2>{t('header.user.logo')}</h2>
            },
            {
                text: t('header.role.default'),
                shortText: t('header.role.short'),
                link: permissionPage,
                perm: "see-permission",
                icon: <h2>{t('header.role.logo')}</h2>
            },
            {
                text: t('header.logs.default'),
                shortText: t('header.logs.short'),
                link: logsPage,
                perm: "see-logs",
                icon: <h2>{t('header.logs.logo')}</h2>
            }
        ])
    }, [settings.language])

    const handleDrawerState = () => {
        setOpen(state => !state);
    };

    function handleDrawerClose() {
        setOpen(false);
    }

    function SidePanel() {
        return (
            <>
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {menuItems.map(item =>
                        (
                            <NavLink exact to={item.link} onClick={handleDrawerClose} activeClassName={classes.Active} key={item.text}>
                                <ListItem className={classes.ListItem} button>
                                    <Box className={classes.iconContainer}>
                                        <ListItemIcon className={classes.ListItemIcon}>{item.icon}</ListItemIcon>
                                        <Typography variant="subtitle2" className={classes.shortText}>{item.shortText || item.text}</Typography>
                                    </Box>
                                    <ListItemText className={classes.ListItemText}><Typography variant="body2">{item.text}</Typography></ListItemText>
                                </ListItem>
                            </NavLink>
                        ))}
                </List>
                <Divider />
                {
                    menuItems2.length ?
                        <>
                            <List>
                                {menuItems2.map(item => (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={classes.secondary} key={item.title}>
                                        <ListItem className={classes.ListItem} button style={{ backgroundColor: "inherit" }}>
                                            <Box className={classes.iconContainer}>
                                                <ListItemIcon className={classes.ListItemIcon}>{item.icon}</ListItemIcon>
                                                <Typography variant="subtitle2" className={classes.shortText}>{item.shortText}</Typography>
                                            </Box>
                                            <ListItemText className={classes.ListItemText}><Typography variant="body2">{item.text}</Typography></ListItemText>
                                        </ListItem>
                                    </a>
                                ))}
                            </List>
                            <Divider />
                        </>
                        :
                        ""
                }
                <div className={clsx(classes.hide, {
                    [classes.footerDisplay]: open,
                })}>
                    <Footer />
                </div>
            </>
        )
    }

    return (
        <div className={classes.root}>
            <AppBar
                color="default"
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerState}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.logoContainer}>
                        <Link to={indexPage} style={{ display: "flex" }}>
                            <img title="Site logo" loading="lazy" className={classes.logo} src={fullLogo} alt="Site Logo" />
                        </Link>
                    </div>
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
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx(classes.SidePanel, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <SidePanel />
            </Drawer>
        </div >
    );
}