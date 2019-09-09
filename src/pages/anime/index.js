import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import AnimeCreate from './olustur'
import AnimeUpdate from './duzenle'
import AnimeDelete from './sil'
import AnimeFeatured from './one-cikarilanlar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={2} bgcolor="background.level2" boxShadow={2}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const theme = useTheme()
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-anime"]) {
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