import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'
import PullAllBy from 'lodash-es/pullAllBy'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, FormControl, InputLabel, Select, MenuItem, Typography, Modal } from '@material-ui/core'
import { defaultEpisodeData, defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, getMangaData, deleteMangaEpisode } from '../../config/api-routes';
import { handleEpisodeTitleFormat } from '../../components/pages/functions';

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
            if (!getEpisode.data.episodes.length) return ToastNotification(payload("error", "Bu manganın ekli herhangi bir bölümü yok."))
            setEpisodeData(getEpisode.data.episodes)
        }

        else {
            ToastNotification(payload("error", "Bölüm bilgilerini getirirken bir sorun oluştu."))
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
            setCurrentEpisodeData({ ...defaultEpisodeData })
            handleClose()
            ToastNotification(payload("success", res.data.message || "Bölüm başarıyla silindi."))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "Bölümü silerken bir sorunla karşılaştık."))
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

        else ToastNotification(payload("error", "Bölümü listede bulurken bir sorun yaşadık."))
    }

    function handleClose() {
        setCurrentEpisodeData({ ...defaultEpisodeData })
        setOpen(false)
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="manga-selector">Bölümünü sileceğiniz mangayi seçin</InputLabel>
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
                        <Typography variant="h4"><em>{currentMangaData.name}</em> {handleEpisodeTitleFormat(currentEpisodeData)} - bölümünü silmek üzeresiniz.</Typography>
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