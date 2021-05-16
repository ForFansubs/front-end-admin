import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'
import PullAllBy from 'lodash-es/pullAllBy'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Typography, Modal, makeStyles } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, deleteEpisode } from '../../config/api-routes';
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

export default function EpisodeDelete(props) {
    const classes = useStyles()
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token

    const [open, setOpen] = useState(false)

    const [data, setData] = useState([])
    const [currentAnimeData, setCurrentAnimeData] = useState({ ...defaultAnimeData })
    const [episodeData, setEpisodeData] = useState([])
    const [currentEpisodeData, setCurrentEpisodeData] = useState({ ...defaultEpisodeData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
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

        const getEpisode = await axios.get(getAnimeData(data.slug), { headers }).catch(res => res)

        if (getEpisode.status === 200 && getEpisode.data.episodes.length) {
            setEpisodeData(getEpisode.data.episodes)
        }

        else {
            ToastNotification(payload("error", t("common.errors.database_error")))
        }
    }

    function handleChange(event) {
        const newData = Find(data, { id: event.target.value })
        getEpisodeData(newData)
        setCurrentAnimeData({ ...newData });
    }

    async function handleDeleteButton(episode_id) {
        const data = {
            episode_id
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(deleteEpisode, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            PullAllBy(newEpisodeDataSet, [{ "id": episode_id }], "id")
            setEpisodeData(oldData => ([...newEpisodeDataSet]))
            setCurrentEpisodeData({ ...defaultEpisodeData })
            handleClose()
            ToastNotification(payload("success", res.data.message || t('episode.delete.warnings.success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('episode.delete.errors.error')))
        }
    }

    function handleDeleteModalButton(id) {
        if (currentAnimeData.slug === "") return

        let clickedEpisodeDataIndex = null

        for (var i = 0; i < episodeData.length; i++) {
            if (episodeData[i].id === id) {
                clickedEpisodeDataIndex = i
                break;
            }
        }

        if (clickedEpisodeDataIndex !== null) {
            setCurrentEpisodeData(episodeData[clickedEpisodeDataIndex])
            setOpen(true)
        }
    }

    function handleClose() {
        setCurrentEpisodeData({ ...defaultEpisodeData })
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">{t('episode.delete.anime_selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentAnimeData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.id}>{d.name} [{d.version}]</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {episodeData.length ?
                <>
                    <Grid container spacing={2} className={classes.EpisodeContainer}>
                        {episodeData.map(e =>
                            <Grid item xs={6} md={3} lg={2} key={e.id}>
                                <Box p={1} boxShadow={2} bgcolor="background.level1" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6">{EpisodeTitleParser({ episodeNumber: e.episode_number, specialType: e.special_type }).title}</Typography>
                                    <div>
                                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleDeleteModalButton(e.id)}>{t('common.index.delete')}</Button>
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
                    <Typography variant="h4">{t('episode.delete.anime_title', { anime_title: `${currentAnimeData.name} ${EpisodeTitleParser({ episodeNumber: currentEpisodeData.episode_number, specialType: currentEpisodeData.special_type })}` })}</Typography>
                    <Button
                        style={{ marginRight: "5px" }}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteButton(currentEpisodeData.id)}>
                        {t('common.index.delete')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}>
                        {t('common.buttons.close')}
                    </Button>
                </Box>
            </Modal>
        </>
    )
}