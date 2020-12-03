import { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, FormLabel, FormControlLabel, InputLabel, Select, MenuItem, FormGroup, Checkbox, Typography, Modal, makeStyles } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, updateEpisode } from '../../config/api-routes';
import { handleEpisodeTitleFormat } from '../../components/pages/functions';

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { useTranslation } from 'react-i18next'

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
            if (!getEpisode.data.episodes.length)
                return ToastNotification(payload("error", t('episode.update.errors.episodes_not_found')))
            ToastNotification(payload("error", t("common.errors.database_error")))
        }
    }

    async function handleVisibilityButtonClick(episode_id) {
        let clickedEpisodeDataIndex = null

        for (var i = 0; i < episodeData.length; i++) {
            if (episodeData[i].id === episode_id) {
                clickedEpisodeDataIndex = i
                break;
            }
        }

        const clickedEpisodeData = episodeData[clickedEpisodeDataIndex]

        const headers = {
            "Authorization": token
        }

        const data = {
            request: "update-visibility",
            id: clickedEpisodeData.id,
            value: Number(!clickedEpisodeData.can_user_download)
        }

        const res = await axios.post(updateEpisode, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            newEpisodeDataSet[clickedEpisodeDataIndex].can_user_download = data.value
            setEpisodeData(oldData => ([...newEpisodeDataSet]))
            ToastNotification(payload("success", res.data.message || t('episode.update.warnings.can_user_download_success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('episode.update.errors.can_user_download_error')))
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
        setCurrentAnimeData({ ...newData });
    }

    const handleInputChange = name => event => {
        if (name === "special_type") {
            if (event.target.value === currentEpisodeData.special_type) return setCurrentEpisodeData(oldData => ({ ...oldData, special_type: "" }))
        }

        setCurrentEpisodeData({ ...currentEpisodeData, [name]: event.target.value })
    }

    async function handleDataSubmit(th) {
        th.preventDefault()
        if (currentAnimeData.slug === "") return

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
            anime_id: currentAnimeData.id
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(updateEpisode, data, { headers }).catch(res => res)

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
                    <InputLabel htmlFor="anime-selector">{t('episode.update.anime_selector')}</InputLabel>
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
                                    <Typography variant="h6">{handleEpisodeTitleFormat(e)}</Typography>
                                    <div>
                                        <Button size="small" onClick={() => handleUpdateButtonClick(e.id)}>{t('common.index.update')}</Button>

                                        <Button size="small" onClick={() => handleVisibilityButtonClick(e.id)}>
                                            {
                                                e.can_user_download === 1
                                                    ?
                                                    <VisibilityIcon />
                                                    :
                                                    <VisibilityOffIcon />
                                            }
                                        </Button>
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
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <FormLabel component="legend">{t('common.inputs.special_type_input')}</FormLabel>
                                <FormGroup row style={{ display: "flex", justifyContent: "center" }}>
                                    <FormControlLabel
                                        disabled
                                        control={
                                            <Checkbox
                                                checked={currentEpisodeData.special_type === "ova" ? true : false}
                                                value="ova"
                                            />
                                        }
                                        label="OVA"
                                    />
                                    <FormControlLabel
                                        disabled
                                        control={
                                            <Checkbox
                                                checked={currentEpisodeData.special_type === "film" ? true : false}
                                                value="film"
                                            />
                                        }
                                        label="Film"
                                    />
                                    <FormControlLabel
                                        disabled
                                        control={
                                            <Checkbox
                                                checked={currentEpisodeData.special_type === "toplu" ? true : false}
                                                value="toplu"
                                            />
                                        }
                                        label={t('episode.update.inputs.batch_link')}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                            fullWidth>
                            {t("common.buttons.save")}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>
    )
}