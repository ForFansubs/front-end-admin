import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AnimeList from './anime'
import MangaList from './manga'

import { a11yProps, TabPanel } from "../../components/pages/default-components";

export default function VerticalTabs() {
    const theme = useTheme()
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["see-anime-list"] && !adminPermList["see-manga-list"]) {
            setError(true)
        }
    }, [adminPermList])

    function handleChange(event, newValue) {
        setValue(newValue)
    }

    return (
        <>
            {error ? <Redirect to="/" /> : ""}
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Yatay menüler"
                >
                    <Tab disabled={!adminPermList["see-anime-list"]} style={!adminPermList["see-anime-list"] ? { display: "none" } : null} label="Anime Liste" {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["see-manga-list"]} style={!adminPermList["see-manga-list"] ? { display: "none" } : null} label="Manga Liste" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            {adminPermList["see-anime-list"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AnimeList />
                </TabPanel>
                : <></>}
            {adminPermList["see-manga-list"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <MangaList />
                </TabPanel>
                : <></>}
        </>
    );
}