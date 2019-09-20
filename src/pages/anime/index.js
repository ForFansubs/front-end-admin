import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AnimeCreate from './olustur'
import AnimeUpdate from './duzenle'
import AnimeDelete from './sil'
import AnimeFeatured from './one-cikarilanlar';

import {a11yProps, TabPanel} from "../../components/pages/default-components";

export default function VerticalTabs() {
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

    function handleChangeIndex(index) {
        setValue(index)
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
                    {adminPermList["add-anime"] ? <Tab label="Oluştur" {...a11yProps(0)} /> : ""}
                    {adminPermList["update-anime"] ? <Tab label="Düzenle" {...a11yProps(1)} /> : ""}
                    {adminPermList["delete-anime"] ? <Tab label="Sil" {...a11yProps(2)} /> : ""}
                    {adminPermList["featured-anime"] ? <Tab label="Öne çıkar" {...a11yProps(3)} /> : ""}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {adminPermList["add-anime"] ?
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {value === 0 ? <AnimeCreate /> : ""}
                    </TabPanel>
                    : ""}
                {adminPermList["update-anime"] ?
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {value === 1 ? <AnimeUpdate /> : 0}
                    </TabPanel>
                    : ""}
                {adminPermList["delete-anime"] ?
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        {value === 2 ? <AnimeDelete theme={theme} /> : 0}
                    </TabPanel>
                    : ""}
                {adminPermList["featured-anime"] ?
                    <TabPanel value={value} index={3} dir={theme.direction}>
                        {value === 3 ? <AnimeFeatured /> : 0}
                    </TabPanel>
                    : ""}
            </SwipeableViews>
        </>
    );
}