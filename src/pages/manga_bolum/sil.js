import { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import PullAllBy from 'lodash-es/pullAllBy'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Typography, Modal, makeStyles } from '@material-ui/core'
import { defaultMangaData, defaultMangaEpisodeData } from '../../components/pages/default-props';
import { getFullMangaList, getMangaData, deleteMangaEpisode } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'
import EpisodeTitleParser from '../../config/episode-title-parser'

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    MangaSelector: {
        marginBottom: theme.spacing(2)
    }
}))

export default function EpisodeDelete(props) {
    const { t } = useTranslation('pages')
    const classes = useStyles()
    const token = useGlobal("user")[0].token

    const [open, setOpen] = useState(false)

    const [data, setData] = useState([])
    const [currentMangaData, setCurrentMangaData] = useState({ ...defaultMangaData })
    const [episodeData, setEpisodeData] = useState([])
    const [currentEpisodeData, setCurrentEpisodeData] = useState({ ...defaultMangaEpisodeData })
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

    function handleChange(event) {
        const newData = Find(data, { id: event.target.value })
        getEpisodeData(newData)
        setCurrentMangaData({ ...newData });
    }

    async function handleDeleteButton(episode_id) {
        const data = {
            episode_id
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(deleteMangaEpisode, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            PullAllBy(newEpisodeDataSet, [{ "id": episode_id }], "id")
            setEpisodeData(oldData => ([...newEpisodeDataSet]))
            setCurrentEpisodeData({ ...defaultMangaEpisodeData })
            handleClose()
            ToastNotification(payload("success", res.data.message || t('manga_episode.delete.warnings.success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('manga_episode.delete.errors.error')))
        }
    }

    function handleDeleteModalButton(id) {
        if (currentMangaData.slug === "") return

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
        setCurrentEpisodeData({ ...defaultMangaEpisodeData })
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="manga-selector">{t('episode.delete.anime_selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentMangaData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "manga",
                            id: "manga-selector"
                        }}
                        className={classes.MangaSelector}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {episodeData.length ?
                <>
                    <Grid container spacing={2}>
                        {episodeData.map(e =>
                            <Grid item xs={6} md={3} lg={2} key={e.id}>
                                <Box p={1} boxShadow={2} bgcolor="background.level1" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6">{EpisodeTitleParser({ episodeNumber: e.episode_number, specialType: "" }).title}</Typography>
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
                    <Typography variant="h4">{t('manga_episode.delete.manga_title', { manga_title: `${currentMangaData.name} ${EpisodeTitleParser({ episodeNumber: currentEpisodeData.episode_number, specialType: "" }).title}` })}</Typography>
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