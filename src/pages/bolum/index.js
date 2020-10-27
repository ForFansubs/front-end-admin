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
import EpisodeWatchLinkIndex from './izlemelinkiindex'
import EpisodeDownloadLinkIndex from './indirmelinkiindex'

import { a11yProps, TabPanel } from "../../components/pages/default-components";
import { useTranslation } from 'react-i18next';

export default function VerticalTabs() {
    const { t } = useTranslation('pages')
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')

    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-episode"] && !adminPermList["update-episode"] && !adminPermList["delete-episode"]) {
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
                    <Tab disabled={!adminPermList["add-episode"]} style={!adminPermList["add-episode"] ? { display: "none" } : null} label={t("common.index.create")} {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["update-episode"]} style={!adminPermList["update-episode"] ? { display: "none" } : null} label={t("common.index.update")} {...a11yProps(1)} />
                    <Tab disabled={!adminPermList["delete-episode"]} style={!adminPermList["delete-episode"] ? { display: "none" } : null} label={t("common.index.delete")} {...a11yProps(2)} />
                    <Tab disabled={!adminPermList["see-watch-link"]} style={!adminPermList["see-watch-link"] ? { display: "none" } : null} label={t("episode.index.watch_link")} {...a11yProps(3)} />
                    <Tab disabled={!adminPermList["see-download-link"]} style={!adminPermList["see-download-link"] ? { display: "none" } : null} label={t("episode.index.download_link")} {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            {adminPermList["add-episode"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <EpisodeCreate />
                </TabPanel>
                : <></>}
            {adminPermList["update-episode"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <EpisodeUpdate theme={theme} />
                </TabPanel>
                : <></>}
            {adminPermList["delete-episode"] && value === 2 ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <EpisodeDelete theme={theme} />
                </TabPanel>
                : <></>}
            {adminPermList["add-watch-link"] && value === 3 ?
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <EpisodeWatchLinkIndex />
                </TabPanel>
                : <></>}
            {adminPermList["add-download-link"] && value === 4 ?
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <EpisodeDownloadLinkIndex />
                </TabPanel>
                : <></>}
        </>
    );
}