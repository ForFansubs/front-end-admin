import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'
import PullAllBy from 'lodash-es/pullAllBy'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Typography, Modal } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, deleteEpisode } from '../../config/api-routes';
import { handleSelectData, handleEpisodeTitleFormat } from '../../components/pages/functions';

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

export default function EpisodeDelete(props) {
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
            ToastNotification(payload("process-error", "error", "Bölüm bilgilerini getirirken bir sorun oluştu."))
        }
    }

    function handleChange(event) {
        const animeData = handleSelectData(event.target.value)
        const newData = Find(data, { name: animeData.name, version: animeData.version })

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
            ToastNotification(payload("process-success", "success", res.data.message || "Bölüm başarıyla silindi."))
        }

        else {
            ToastNotification(payload("process-error", "error", res.response.data.err || "Bölümü silerken bir sorunla karşılaştık."))
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

        else ToastNotification(payload("process-error", "error", "Bölümü listede bulurken bir sorun yaşadık."))
    }

    function handleClose() {
        setCurrentEpisodeData({ ...defaultEpisodeData })
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Bölümünü sileceğiniz animeyi seçin</InputLabel>
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
                                        <Button size="small" variant="outlined" color="secondary" onClick={() => handleDeleteModalButton(e.id)}>SİL</Button>
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
                        <Typography variant="h4"><em>{currentAnimeData.name}</em> {handleEpisodeTitleFormat(currentEpisodeData)} - bölümünü silmek üzeresiniz.</Typography>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteButton(currentEpisodeData.id)}>
                            Sil
                            </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClose}>
                            Kapat
                        </Button>
                    </Box>
                </ModalContainer>
            </Modal>
        </>
    )
}