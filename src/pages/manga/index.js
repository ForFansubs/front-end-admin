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

import MangaCreate from './olustur'
import MangaUpdate from './duzenle'
import MangaDelete from './sil'

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
        if (!adminPermList["add-manga"]) {
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
                    {adminPermList["add-manga"] ? <Tab label="Oluştur" {...a11yProps(0)} /> : ""}
                    {adminPermList["update-manga"] ? <Tab label="Düzenle" {...a11yProps(1)} /> : ""}
                    {adminPermList["delete-manga"] ? <Tab label="Sil" {...a11yProps(2)} /> : ""}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {adminPermList["add-manga"] ?
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {value === 0 ? <MangaCreate /> : ""}
                    </TabPanel>
                    : ""}
                {adminPermList["update-manga"] ?
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {value === 1 ? <MangaUpdate /> : 0}
                    </TabPanel>
                    : ""}
                {adminPermList["delete-manga"] ?
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        {value === 2 ? <MangaDelete theme={theme} /> : 0}
                    </TabPanel>
                    : ""}
            </SwipeableViews>
        </>
    );
}