import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'
import axios from '../../config/axios/axios'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import DownloadlinkCreate from './indirmelinki/olustur'
import DownloadLinkDelete from './indirmelinki/sil'
import WarningBox from '../../components/warningerrorbox/warning';
import { downloadLinkList } from '../../config/api-routes';

import { a11yProps, TabPanel } from "../../components/pages/default-components";

export default function EpisodeDownloadLinkIndex() {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [downloadLinks, setDownloadLinks] = useState([])
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-download-link"] && !adminPermList["delete-download-link"]) {
            setError(true)
        }

        async function fetchData() {
            const headers = {
                "Authorization": token
            }

            const downloadLink = await axios.get(downloadLinkList, { headers }).catch(res => res)

            if (downloadLink.status === 200) setDownloadLinks(downloadLink.data.list)
        }

        fetchData()
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
                    <Tab disabled={!adminPermList["add-download-link"]} style={!adminPermList["add-download-link"] ? { display: "none" } : null} label="Ekle" {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["delete-download-link"]} style={!adminPermList["delete-download-link"] ? { display: "none" } : null} label="Sil" {...a11yProps(1)} />
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
            {downloadLinkList.length ?
                <WarningBox bgcolor="background.level1" mb={2} variant="h6">
                    {downloadLinks.map((w, i) => i === downloadLinks.length - 1 ? w.toUpperCase() : `${w.toUpperCase()} - `)}
                </WarningBox>
                : ""}
        </>
    );
}