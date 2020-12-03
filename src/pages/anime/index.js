import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AnimeCreate from './olustur'
import AnimeUpdate from './duzenle'
import AnimeDelete from './sil'
import AnimeFeatured from './one-cikarilanlar';

import { a11yProps, TabPanel } from "../../components/pages/default-components";
import { useTranslation } from 'react-i18next';

export default function VerticalTabs() {
    const { t } = useTranslation("pages")
    const theme = useTheme()
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-anime"] && !adminPermList["update-anime"] && !adminPermList["delete-anime"] && !adminPermList["featured-anime"]) {
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
                    <Tab disabled={!adminPermList["add-anime"]} style={!adminPermList["add-anime"] ? { display: "none" } : null} label={t("common.index.create")} {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["update-anime"]} style={!adminPermList["update-anime"] ? { display: "none" } : null} label={t("common.index.update")} {...a11yProps(1)} />
                    <Tab disabled={!adminPermList["delete-anime"]} style={!adminPermList["delete-anime"] ? { display: "none" } : null} label={t("common.index.delete")} {...a11yProps(2)} />
                    <Tab disabled={!adminPermList["featured-anime"]} style={!adminPermList["featured-anime"] ? { display: "none" } : null} label={t("anime.index.feature")} {...a11yProps(3)} />
                </Tabs>
            </AppBar>

            {adminPermList["add-anime"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <AnimeCreate />
                </TabPanel>
                : <></>}
            {adminPermList["update-anime"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <AnimeUpdate />
                </TabPanel>
                : <></>}
            {adminPermList["delete-anime"] && value === 2 ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <AnimeDelete />
                </TabPanel>
                : <></>}
            {adminPermList["featured-anime"] && value === 3 ?
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <AnimeFeatured />
                </TabPanel>
                : <></>}
        </>
    );
}