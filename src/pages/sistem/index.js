import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'
import axios from '../../config/axios/axios'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {
    forceAnimeCoverArtUpdate,forceMangaCoverArtUpdate,
    forceAnimeHeaderUpdate, forceCFCachePurge, forceCoverArtUpdate,
    forceHeaderOptimize,
    forceHeaderUpdate,
    forceMangaHeaderUpdate
} from "../../config/api-routes";
import ToastNotification, {payload} from "../../components/toastify/toast";
import {Typography} from "@material-ui/core";

export default function VerticalTabs() {
    const token = useGlobal("user")[0].token
    const [adminPermList] = useGlobal('adminPermList')

    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["see-administrative-stuff"]) {
            setError(true)
        }
    }, [adminPermList, token])

    const handleForceHeaderOptimize = () => {
        axios.get(forceHeaderOptimize, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleHeaderUpdate = () => {
        axios.get(forceHeaderUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleAnimeHeaderUpdate = () => {
        axios.get(forceAnimeHeaderUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleMangaHeaderUpdate = () => {
        axios.get(forceMangaHeaderUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleCoverArtUpdate = () => {
        axios.get(forceCoverArtUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleAnimeCoverArtUpdate = () => {
        axios.get(forceAnimeCoverArtUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleMangaCoverArtUpdate = () => {
        axios.get(forceMangaCoverArtUpdate, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }
    const handleForceCFCachePurge = () => {
        axios.get(forceCFCachePurge, {headers: {"Authorization": token}})
            .then(_ => ToastNotification(payload("process-success", "success", "İşlem başarıyla alındı.")))
            .catch(_ => ToastNotification(payload("process-error", "error", "İşlem alınırken bir sorunla karşılaştık.")))
    }

    return (
        <>
            {error ? <Redirect to="/" /> : ""}
            <Grid container>
                <Grid item xs={12}>
                    <Box p={2} bgcolor="background.level2">
                        <Box mb={2}>
                            <Typography variant="h4" gutterBottom>Header işlemleri</Typography>
                            <Button color="secondary" variant="outlined" onClick={handleHeaderUpdate}> Bütün konuların headerlarını güncelle</Button >
                            <Button color="secondary" variant="outlined" onClick={handleAnimeHeaderUpdate}> Animelerin headerlarını güncelle</Button >
                            <Button color="secondary" variant="outlined" onClick={handleMangaHeaderUpdate}> Mangaların headerlarını güncelle</Button >
                            <Button color="secondary" variant="outlined" onClick={handleForceHeaderOptimize}>Headerların boyutunu küçült</Button>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="h4" gutterBottom>Cover art işlemleri</Typography>
                            <Button color="secondary" variant="outlined" onClick={handleCoverArtUpdate}> Bütün konuların cover artlarını güncelle</Button >
                            <Button color="secondary" variant="outlined" onClick={handleAnimeCoverArtUpdate}> Animelerin cover artlarını güncelle</Button >
                            <Button color="secondary" variant="outlined" onClick={handleMangaCoverArtUpdate}> Mangaların cover artlarını güncelle</Button >
                        </Box>
                        {/*<Box mb={2}>
                            <Typography variant="h4" gutterBottom>Servis İşlemleri</Typography>
                        </Box>*/}
                        <Box mb={2}>
                            <Typography variant="h4" gutterBottom>Cache İşlemleri</Typography>
                            <Button color="secondary" variant="outlined" onClick={handleForceCFCachePurge}> Cloudflare cache'ini zorla temizle</Button >
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}