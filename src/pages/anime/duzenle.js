import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormLabel, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { checkMyAnimeListAnimeLink, handleSelectData } from '../../components/pages/functions';
import { defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, updateAnime } from '../../config/api-routes';

export default function AnimeUpdate() {
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])
    const [currentAnimeData, setCurrentAnimeData] = useState({ ...defaultAnimeData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
            if (res.status === 200) {
                setData(res.data)
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    function handleChange(event) {
        const animeData = handleSelectData(event.target.value)
        const newData = Find(data, { name: animeData.name, version: animeData.version })
        setCurrentAnimeData({ ...newData });
    }

    const handleInputChange = name => event => {
        const newDataSet = data
        newDataSet[FindIndex(data, { slug: currentAnimeData.slug })][name] = event.target.value
        setData(newDataSet)
        setCurrentAnimeData({ ...currentAnimeData, [name]: event.target.value })
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const newData = currentAnimeData
        const headers = {
            "Authorization": token
        }

        axios.post(updateAnime, newData, { headers })
            .then(_ => {
                clearData()
                ToastNotification(payload("process-success", "success", "Anime başarıyla güncellendi."))
            })
            .catch(_ => {
                ToastNotification(payload("process-error", "error", "Animeyi güncellerken bir sorunla karşılaştık."))
            })
    }

    function clearData() {
        setCurrentAnimeData({ ...defaultAnimeData })
    }

    if (loading) {
        return (
            <CircularProgress />
        )
    }
    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Düzenleyeceğiniz animeyi seçin</InputLabel>
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
            {currentAnimeData.slug === "" ? "" :
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <TextField
                            autoComplete="off"
                            fullWidth
                            id="mal_link"
                            label="MyAnimeList Linki"
                            value={currentAnimeData.mal_link}
                            onChange={handleInputChange("mal_link")}
                            margin="normal"
                            variant="filled"
                            helperText="https://myanimelist.net/anime/32526/Love_Live_Sunshine ya da https://myanimelist.net/anime/32526"
                            required
                            error={currentAnimeData.mal_link ? checkMyAnimeListAnimeLink(currentAnimeData.mal_link) : false}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label="Anime poster resmi"
                                    value={currentAnimeData.cover_art}
                                    onChange={handleInputChange("cover_art")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label="Anime header resmi"
                                    value={currentAnimeData.header || undefined}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label="Anime ismi"
                                    value={currentAnimeData.name}
                                    onChange={handleInputChange("name")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="synopsis"
                                    multiline
                                    label="Anime konusu"
                                    value={currentAnimeData.synopsis}
                                    onChange={handleInputChange("synopsis")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="translators"
                                    label="Çevirmenler"
                                    value={currentAnimeData.translators}
                                    onChange={handleInputChange("translators")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Çevirmenleri arasında virgülle, boşluksuz yazın. çevirmen1,çevirmen2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="encoders"
                                    label="Encoderlar"
                                    value={currentAnimeData.encoders}
                                    onChange={handleInputChange("encoders")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Encoderları arasında virgülle, boşluksuz yazın. encoder1,encoder2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="studios"
                                    label="Stüdyolar"
                                    value={currentAnimeData.studios}
                                    onChange={handleInputChange("studios")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Stüdyoları arasında virgülle, boşluksuz yazın. stüdyo1,stüdyo2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="genres"
                                    label="Türler"
                                    value={currentAnimeData.genres}
                                    onChange={handleInputChange("genres")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Türleri arasında virgülle, boşluksuz yazın. tür1,tür2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="premiered"
                                    label="Sezon"
                                    value={currentAnimeData.premiered}
                                    onChange={handleInputChange("premiered")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Kış/İlkbahar/Yaz/Sonbahar XXXX"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">Versiyon</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="version selector"
                                        name="gender1"
                                        value={currentAnimeData.version}
                                        onChange={handleInputChange("version")}
                                    >
                                        <FormControlLabel value="tv" control={<Radio />} label="TV" />
                                        <FormControlLabel value="bd" control={<Radio />} label="Blu-ray" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Kaydet
                            </Button>
                    </form>
                </>}
        </>
    )
}