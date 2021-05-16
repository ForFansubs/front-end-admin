import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import DownloadlinkCreate from './indirmelinki/olustur'
import DownloadLinkDelete from './indirmelinki/sil'

import { a11yProps, TabPanel } from "../../components/pages/default-components";
import { useTranslation } from 'react-i18next';

export default function EpisodeDownloadLinkIndex() {
    const { t } = useTranslation('pages')
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-download-link"] && !adminPermList["delete-download-link"]) {
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
                    <Tab disabled={!adminPermList["add-download-link"]} style={!adminPermList["add-download-link"] ? { display: "none" } : null} label={t('common.index.create')} {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["delete-download-link"]} style={!adminPermList["delete-download-link"] ? { display: "none" } : null} label={t('common.index.delete')} {...a11yProps(1)} />
                </Tabs>
            </AppBar>

            {adminPermList["add-download-link"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <DownloadlinkCreate />
                </TabPanel>
                : <></>}
            {adminPermList["delete-download-link"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <DownloadLinkDelete />
                </TabPanel>
                : <></>}
        </>
    );
}