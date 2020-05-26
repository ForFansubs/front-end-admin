import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, FormLabel, FormControlLabel, InputLabel, Select, MenuItem, FormGroup, Checkbox, Typography, Modal } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, updateEpisode } from '../../config/api-routes';
import { handleSelectData, handleEpisodeTitleFormat } from '../../components/pages/functions';

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

const ModalContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.theme.breakpoints.values.sm}px;

    @media(max-width:${props => props.theme.breakpoints.values.sm}px) {
        width: 100%;
    }
`

export default function EpisodeUpdate(props) {
    const { theme } = props

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
            ToastNotification(payload("error", "Bölüm bilgilerini getirirken bir sorun oluştu."))
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
            value: Number(!clickedEpisodeData.seen_download_page)
        }

        const res = await axios.post(updateEpisode, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            newEpisodeDataSet[clickedEpisodeDataIndex].seen_download_page = data.value
            setEpisodeData(oldData => ([...newEpisodeDataSet]))
            ToastNotification(payload("success", res.data.message || "Görünürlük başarıyla değiştirildi."))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "Görünürlük değiştirilirken bir sorunla karşılaştık."))
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
        const animeData = handleSelectData(event.target.value)
        const newData = Find(data, { name: animeData.name, version: animeData.version })

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
            ToastNotification(payload("success", res.data.message || "Bölüm bilgileri başarıyla değiştirildi."))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "Bölüm bilgileri değiştirilirken bir sorunla karşılaştık."))
        }
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Bölümünü düzenleyeceğiniz animeyi seçin</InputLabel>
                    <Select
                        fullWidth
                        value={`${currentAnimeData.name} [${currentAnimeData.version}]`}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={`${d.name} [${d.version}]`}>{d.name} [{d.version}]</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {episodeData.length ?
                <>
                    <Grid container spacing={2}>
                        {episodeData.map(e =>
                            <Grid item xs={6} md={3} lg={2} key={e.id}>
                                <Box p={1} boxShadow={2} bgcolor="background.level1" display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6">{handleEpisodeTitleFormat(e)}</Typography>
                                    <div>
                                        <Button size="small" onClick={() => handleUpdateButtonClick(e.id)}>Düzenle</Button>

                                        <Button size="small" onClick={() => handleVisibilityButtonClick(e.id)}>
                                            {
                                                e.seen_download_page === 1
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
            >
                <ModalContainer theme={theme}>
                    <Box p={2} bgcolor="background.level2">
                        <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        id="episode_number"
                                        label="Bölüm Numarası - (Sadece sayı)"
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
                                        label="Emektar"
                                        value={currentEpisodeData.credits}
                                        onChange={handleInputChange("credits")}
                                        margin="normal"
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <FormLabel component="legend">Bölüm Özel Türü</FormLabel>
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
                                            label="Toplu Link"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="submit">
                                Kaydet
                            </Button>
                        </form>
                    </Box>
                </ModalContainer>
            </Modal>
        </>
    )
}