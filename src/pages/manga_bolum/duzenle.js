import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography, Modal, makeStyles } from '@material-ui/core'
import { defaultEpisodeData, defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, getMangaData, updateMangaEpisode } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'
import EpisodeTitleParser from '../../config/episode-title-parser'

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    EpisodeContainer: {
        marginTop: theme.spacing(2)
    }
}))

export default function EpisodeUpdate(props) {
    const { t } = useTranslation('pages')
    const classes = useStyles()

    const token = useGlobal("user")[0].token

    const [open, setOpen] = useState(false)

    const [data, setData] = useState([])
    const [currentMangaData, setCurrentMangaData] = useState({ ...defaultMangaData })
    const [episodeData, setEpisodeData] = useState([])
    const [currentEpisodeData, setCurrentEpisodeData] = useState({ ...defaultEpisodeData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
            if (res.status === 200) {
                setData(res.data)
                return setLoading(false)
            }

            setLoading(false)
        }

        fetchData()
    }, [token])

    async function getEpisodeData(data) {
        const headers = {
            "Authorization": token
        }

        const getEpisode = await axios.get(getMangaData(data.slug), { headers }).catch(res => res)

        if (getEpisode.status === 200) {
            if (!getEpisode.data.episodes.length)
                return ToastNotification(payload("error", t('manga_episode.update.errors.episodes_not_found')))
            setEpisodeData(getEpisode.data.episodes)
        }

        else {
            ToastNotification(payload("error", t("common.errors.database_error")))
        }
    }

    function handleUpdateButtonClick(episode_id) {
        let clickedEpisodeDataIndex = null

        for (var i = 0; i < episodeData.length; i++) {
            if (episodeData[i].id === episode_id) {
                clickedEpisodeDataIndex = i
                break;
            }
        }

        const clickedEpisodeData = episodeData[clickedEpisodeDataIndex]

        setCurrentEpisodeData({ ...clickedEpisodeData })
        setOpen(true)
    }

    function handleChange(event) {
        const newData = Find(data, { id: event.target.value })
        getEpisodeData(newData)
        setCurrentMangaData({ ...newData });
    }

    const handleInputChange = name => event => {
        if (name === "special_type") {
            if (event.target.value === currentEpisodeData.special_type) return setCurrentEpisodeData(oldData => ({ ...oldData, special_type: "" }))
        }

        setCurrentEpisodeData({ ...currentEpisodeData, [name]: event.target.value })
    }

    async function handleDataSubmit(th) {
        th.preventDefault()
        if (currentMangaData.slug === "") return

        let clickedEpisodeDataIndex = null

        for (var i = 0; i < episodeData.length; i++) {
            if (episodeData[i].id === currentEpisodeData.id) {
                clickedEpisodeDataIndex = i
                break;
            }
        }

        const data = {
            ...currentEpisodeData,
            request: "update-data",
            manga_id: currentMangaData.id
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(updateMangaEpisode, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            newEpisodeDataSet[clickedEpisodeDataIndex] = currentEpisodeData
            setEpisodeData(oldData => ([...newEpisodeDataSet]))
            setCurrentEpisodeData({ ...defaultEpisodeData })
            handleClose()
            ToastNotification(payload("success", res.data.message || t('episode.update.warnings.success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('episode.update.errors.error')))
        }
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="manga-selector">{t('manga_episode.update.manga_selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentMangaData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "manga",
                            id: "manga-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {episodeData.length ?
                <>
                    <Grid container spacing={2} className={classes.EpisodeContainer}>
                        {episodeData.map(e =>
                            <Grid item xs={6} md={3} lg={2} key={e.id}>
                                <Box p={1} boxShadow={2} bgcolor="background.level1" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6">{EpisodeTitleParser({ episodeNumber: e.episode_number, specialType: "" }).title}</Typography>
                                    <div>
                                        <Button size="small" onClick={() => handleUpdateButtonClick(e.id)}>{t('common.index.update')}</Button>
                                    </div>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </>
                : ""}
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
                className={classes.ModalContainer}
            >
                <Box p={2} bgcolor="background.level2">
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    disabled
                                    id="episode_number"
                                    label={t('common.inputs.episode_number_input')}
                                    value={currentEpisodeData.episode_number}
                                    onChange={handleInputChange("episode_number")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="credits"
                                    label={t('common.inputs.credits_input')}
                                    value={currentEpisodeData.credits}
                                    onChange={handleInputChange("credits")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="episode_name"
                                    label={t('common.inputs.episode_name_input')}
                                    value={currentEpisodeData.episode_name}
                                    onChange={handleInputChange("episode_name")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="submit">
                                    {t("common.buttons.save")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </>
    )
}