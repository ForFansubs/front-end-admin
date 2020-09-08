import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import IsEmpty from 'lodash-es/isEmpty'

import axios from '../../../config/axios/axios'
import ToastNotification, { payload } from '../../../components/toastify/toast'

import { Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../../components/pages/default-props';
import { getFullAnimeList, getAnimeData, addDownloadlink } from '../../../config/api-routes';
import { handleSelectData, handleEpisodeTitleFormat, handleEpisodeSelectData } from '../../../components/pages/functions';

export default function DownloadlinkCreate() {
    const token = useGlobal("user")[0].token

    const [data, setData] = useState([])
    const [currentAnimeData, setCurrentAnimeData] = useState({ ...defaultAnimeData })
    const [episodeData, setEpisodeData] = useState([])
    const [currentEpisodeData, setCurrentEpisodeData] = useState({ ...defaultEpisodeData })
    const [loading, setLoading] = useState(true)
    const [linkError, setLinkError] = useState(false)

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

    function handleAnimeChange(event) {
        setCurrentEpisodeData({ ...defaultEpisodeData })
        const newData = Find(data, { id: event.target.value })

        getEpisodeData(newData)

        setCurrentAnimeData({ ...newData });
    }

    function handleEpisodeChange(event) {
        const newData = Find(episodeData, { id: event.target.value })

        setCurrentEpisodeData({ ...newData })
    }

    const handleInputChange = name => event => {
        if (linkError) setLinkError(false)

        if (name === "special_type") {
            if (event.target.value === currentEpisodeData.special_type) return setCurrentEpisodeData(oldData => ({ ...oldData, special_type: "" }))
        }

        setCurrentEpisodeData({ ...currentEpisodeData, [name]: event.target.value })
    }

    async function handleDataSubmit(th) {
        th.preventDefault()
        if (!currentAnimeData.slug) return
        if (!currentEpisodeData.link) return

        let clickedEpisodeDataIndex = null

        for (var i = 0; i < episodeData.length; i++) {
            if (episodeData[i].id === currentEpisodeData.id) {
                clickedEpisodeDataIndex = i
                break;
            }
        }

        const data = {
            episode_id: currentEpisodeData.id,
            anime_id: currentAnimeData.id,
            link: currentEpisodeData.link
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(addDownloadlink, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newEpisodeDataSet = episodeData
            newEpisodeDataSet[clickedEpisodeDataIndex] = currentEpisodeData
            setEpisodeData(oldData => ([...newEpisodeDataSet]))

            ToastNotification(payload("success", res.data.message || "İndirme linki başarıyla eklendi."))
            setCurrentEpisodeData(state => ({ ...state, link: "" }))
            if (!IsEmpty(res.data.errors)) {
                let links = ""
                setLinkError(true)
                for (const [key, value] of Object.entries(res.data.errors)) {
                    links = `${links ? `${links}\n` : links}${key} --- ${value}`
                }

                setCurrentEpisodeData(state => ({ ...state, link: links }))
            }
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "İndirme linkini eklerken bir sorunla karşılaştık."))
        }
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">İndirme linki ekleyeceğiniz animeyi seçin</InputLabel>
                    <Select
                        fullWidth
                        value={currentAnimeData.id || ""}
                        onChange={handleAnimeChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.id}>{d.name} [{d.version}]</MenuItem>)}
                    </Select>
                </FormControl>
                : "Yükleniyor..."}
            <Box mt={2}>
                {episodeData.length ?
                    <FormControl fullWidth>
                        <InputLabel htmlFor="anime-selector">İndirme linki ekleyeceğiniz bölümü seçin</InputLabel>
                        <Select
                            fullWidth
                            value={currentEpisodeData.id || ""}
                            onChange={handleEpisodeChange}
                            inputProps={{
                                name: "episode",
                                id: "episode-selector"
                            }}
                        >
                            {episodeData.map(e => <MenuItem key={e.id} value={e.id}>{handleEpisodeTitleFormat(e)}</MenuItem>)}
                        </Select>
                    </FormControl>
                    : ""}
                {currentEpisodeData.id ?
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <TextField
                            fullWidth
                            id="link"
                            label="Link"
                            error={linkError}
                            value={currentEpisodeData.link}
                            onChange={handleInputChange("link")}
                            margin="normal"
                            variant="filled"
                            helperText={linkError ? "Hatalı linkler var!" : "Buraya birden fazla link koyabilirsiniz. Her link kendine ait satırda olmalıdır."}
                            multiline
                            rows={4}
                            rowsMax={20}
                            required
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Kaydet
                            </Button>
                    </form>
                    : ""
                }
            </Box>
        </>
    )
}