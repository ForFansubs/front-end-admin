import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import MotdCreate from './olustur'
import MotdUpdate from './duzenle'
import MotdDelete from './sil'

import { a11yProps, TabPanel } from "../../components/pages/default-components";
import { useTranslation } from 'react-i18next';

export default function TabPanels() {
    const { t } = useTranslation('pages')
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
                    aria-label="Appbars"
                >
                    <Tab disabled={!adminPermList["add-motd"]} style={!adminPermList["add-motd"] ? { display: "none" } : null} label={t("common.index.create")} {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["update-motd"]} style={!adminPermList["update-motd"] ? { display: "none" } : null} label={t("common.index.update")} {...a11yProps(1)} />
                    <Tab disabled={!adminPermList["delete-motd"]} style={!adminPermList["delete-motd"] ? { display: "none" } : null} label={t("common.index.delete")} {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            {adminPermList["add-motd"] ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {value === 0 ? <MotdCreate /> : ""}
                </TabPanel>
                : ""}
            {adminPermList["update-motd"] ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 ? <MotdUpdate /> : 0}
                </TabPanel>
                : ""}
            {adminPermList["delete-motd"] ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {value === 2 ? <MotdDelete /> : 0}
                </TabPanel>
                : ""}
        </>
    );
}