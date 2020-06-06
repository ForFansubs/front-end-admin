import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PermissionCreate from './olustur'
import PermissionUpdate from './duzenle'
import PermissionDelete from './sil'

import { a11yProps, TabPanel } from "../../components/pages/default-components";

export default function () {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')

    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-motd"] && !adminPermList["update-motd"] && !adminPermList["delete-motd"]) {
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
                    {adminPermList["add-motd"] ? <Tab label="Oluştur" {...a11yProps(0)} /> : ""}
                    {adminPermList["update-motd"] ? <Tab label="Düzenle" {...a11yProps(1)} /> : ""}
                    {adminPermList["delete-motd"] ? <Tab label="Sil" {...a11yProps(2)} /> : ""}
                </Tabs>
            </AppBar>
            {adminPermList["add-motd"] ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {value === 0 ? <PermissionCreate /> : ""}
                </TabPanel>
                : ""}
            {adminPermList["update-motd"] ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 ? <PermissionUpdate theme={theme} /> : 0}
                </TabPanel>
                : ""}
            {adminPermList["delete-motd"] ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {value === 2 ? <PermissionDelete theme={theme} /> : 0}
                </TabPanel>
                : ""}
        </>
    );
}