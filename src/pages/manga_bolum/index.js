import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EpisodeCreate from './olustur'
import EpisodeUpdate from './duzenle'
import EpisodeDelete from './sil'

import { a11yProps, TabPanel } from "../../components/pages/default-components";

export default function VerticalTabs() {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')

    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-manga-episode"] && !adminPermList["update-manga-episode"] && !adminPermList["delete-manga-episode"]) {
            setError(true)
        }
    }, [adminPermList, token])

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
                    <Tab disabled={!adminPermList["add-manga-episode"]} style={!adminPermList["add-manga-episode"] ? { display: "none" } : null} label="Oluştur" {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["update-manga-episode"]} style={!adminPermList["update-manga-episode"] ? { display: "none" } : null} label="Düzenle" {...a11yProps(1)} />
                    <Tab disabled={!adminPermList["delete-manga-episode"]} style={!adminPermList["delete-manga-episode"] ? { display: "none" } : null} label="Sil" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            {adminPermList["add-manga-episode"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <EpisodeCreate />
                </TabPanel>
                : <></>}
            {adminPermList["update-manga-episode"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <EpisodeUpdate theme={theme} />
                </TabPanel>
                : <></>}
            {adminPermList["delete-manga-episode"] && value === 2 ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <EpisodeDelete theme={theme} />
                </TabPanel>
                : <></>}
        </>
    );
}