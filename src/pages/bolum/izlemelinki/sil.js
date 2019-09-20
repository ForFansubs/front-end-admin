import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import PullAllBy from 'lodash-es/pullAllBy'

import axios from '../../../config/axios/axios'
import ToastNotification, { payload } from '../../../components/toastify/toast'

import { Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, getWatchlinks, deleteWatchlink } from '../../../config/api-routes';
import { handleSelectData, handleEpisodeTitleFormat, handleEpisodeSelectData } from '../../../components/pages/functions';

export default function WatchlinkCreate() {
    const token = useGlobal("user")[0].token

    const [data, setData] = useState([])
    const [currentAnimeData, setCurrentAnimeData] = useState({ ...defaultAnimeData })
    const [episodeData, setEpisodeData] = useState([])
    const [currentEpisodeData, setCurrentEpisodeData] = useState({ ...defaultEpisodeData })
    const [currentEpisodeWatchlinkData, setCurrentEpisodeWatchlinkData] = useState([])
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

    function handleAnimeChange(event) {
        const animeData = handleSelectData(event.target.value)
        const newData = Find(data, { name: animeData.name, version: animeData.version })

        getEpisodeData(newData)

        setCurrentAnimeData({ ...newData });
    }

    function handleEpisodeChange(event) {
        const selectedEpisodeData = handleEpisodeSelectData(event.target.value)
        const newData = Find(episodeData, { episode_number: selectedEpisodeData.episode_number, special_type: selectedEpisodeData.special_type })

        const headers = {
            "Authorization": token
        }

        const data = {
            episode_id: newData.id,
        }

        axios.post(getWatchlinks, data, { headers })
            .then(res => {
                if (!res.data.length) return ToastNotification(payload("process-error", "error", "Bölüme kayıtlı izleme linki bulunamadı."))
                setCurrentEpisodeWatchlinkData(res.data)
            }).catch(err => console.log(err))

        setCurrentEpisodeData({ ...newData })
    }

    async function handleDeleteButton(watchlink_id) {
        const data = {
            episode_id: currentEpisodeData.id,
            watchlink_id
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(deleteWatchlink, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = currentEpisodeWatchlinkData
            PullAllBy(newEpisodeDataSet, [{ "id": watchlink_id }], "id")
            setCurrentEpisodeWatchlinkData(oldData => ([...newEpisodeDataSet]))
            ToastNotification(payload("process-success", "success", res.data.message || "Link başarıyla silindi."))
        }

        else {
            ToastNotification(payload("process-error", "error", res.response.data.err || "Linki silerken bir sorunla karşılaştık."))
        }
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">İzleme linkini sileceğiniz animeyi seçin</InputLabel>
                    <Select
                        fullWidth
                        value={`${currentAnimeData.name} [${currentAnimeData.version}]`}
                        onChange={handleAnimeChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={`${d.name} [${d.version}]`}>{d.name} [{d.version}]</MenuItem>)}
                    </Select>
                </FormControl>
                : "Yükleniyor..."}
            <Box mt={2}>
                {episodeData.length ?
                    <FormControl fullWidth>
                        <InputLabel htmlFor="anime-selector">İzleme linkini sileceğiniz bölümü seçin</InputLabel>
                        <Select
                            fullWidth
                            value={`${handleEpisodeTitleFormat(currentEpisodeData)}`}
                            onChange={handleEpisodeChange}
                            inputProps={{
                                name: "episode",
                                id: "episode-selector"
                            }}
                        >
                            {episodeData.map(e => <MenuItem key={e.id} value={handleEpisodeTitleFormat(e)}>{handleEpisodeTitleFormat(e)}</MenuItem>)}
                        </Select>
                    </FormControl>
                    : ""}
                <Grid container>
                    {currentEpisodeWatchlinkData.length ?
                        currentEpisodeWatchlinkData.map(w => (
                            <>
                                <Grid item xs={12} md={6} lg={3} key={w.id}>
                                    <Box padding={1}>
                                        <div style={{ width: "100%", position: "relative", paddingTop: "56.25%", height: "0px", overflow: "hidden" }}>
                                            <iframe title={`watch-${w.id}`} src={w.link} style={{ position: "absolute", width: "100%", height: "100%", top: "0", left: "0" }} />
                                        </div>
                                        <Box bgcolor="background.level1" display="flex" justifyContent="space-between" alignItems="center" padding={1}>
                                            <Typography variant="h6">{w.type.toUpperCase()}</Typography>
                                            <Button color="secondary" onClick={() => handleDeleteButton(w.id)}>SİL</Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </>
                        ))
                        : ""
                    }
                </Grid>

            </Box>
        </>
    )
}