import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { checkMyAnimeListAnimeLink, generalSlugify } from '../../components/pages/functions';
import { defaultAnimeData } from '../../components/pages/default-props';
import { jikanIndex, addAnime } from '../../config/api-routes';

export default function AnimeCreate() {
    const token = useGlobal("user")[0].token
    const [jikanStatus] = useGlobal('jikanStatus')
    const [animeData, setAnimeData] = useState({ ...defaultAnimeData, mal_get: jikanStatus.status ? false : true })

    const handleInputChange = name => event => {
        event.persist()

        setAnimeData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    async function handleMALSubmit(th) {
        th.preventDefault()
        if (!animeData.mal_link || checkMyAnimeListAnimeLink(animeData.mal_link)) {
            const payload = {
                container: "process-error",
                type: "error",
                message: "Girdiğiniz link MyAnimeList Anime linki değil."
            }
            return ToastNotification(payload)
        }
        const link = animeData.mal_link.split('/')
        const id = link[4]
        const anime = await axios.get(`${jikanIndex}/anime/${id}`).catch(_ => {
            const payload = {
                container: "process-error",
                type: "error",
                message: "Girdiğiniz linkin bilgisi bulunamadı."
            }

            ToastNotification(payload)
            setAnimeData({ mal_get: true })
            return { status: 408, data: { NOTICE: "err" } }
        })

        if (anime.data) {
            const animeNotice = anime.data.NOTICE || false

            if (animeNotice) {
                const payload = {
                    container: "process-error",
                    type: "error",
                    message: "Girdiğiniz linkin bilgisi bulunamadı."
                }

                ToastNotification(payload)
                return setAnimeData({ mal_get: true })
            }
        }

        let turler = [], studyolar = []
        anime.data.genres.forEach(genre => turler.push(genre.name))
        anime.data.studios.forEach(studio => studyolar.push(studio.name))
        const date = new Date(anime.data.aired.from)
        const newAnimeData = {
            cover_art: anime.data.image_url,
            name: anime.data.title,
            release_date: date,
            studios: studyolar.join(','),
            genres: turler.join(','),
            premiered: anime.data.premiered,
            episode_count: anime.data.airing ? 0 : anime.data.episodes
        }
        const header = await axios.get(`/header-getir/${generalSlugify(anime.data.title)}`).catch(_ => _)

        if (header.status === 200) {
            newAnimeData.header = header.data.header
        }
        else {
            newAnimeData.header = ""
        }

        setAnimeData({ ...animeData, ...newAnimeData, mal_get: true })
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const data = animeData
        const headers = {
            "Authorization": token
        }

        axios.post(addAnime, data, { headers })
            .then(res => {
                const payload = {
                    container: "process-success",
                    message: "Anime başarıyla eklendi.",
                    type: "success"
                }
                ToastNotification(payload)
            })
            .catch(err => {
                ToastNotification(payload("process-error", "error", err.response.data.err || "Animeyi eklerken bir sorunla karşılaştık."))
            })
    }

    function clearData() {
        setAnimeData({ ...defaultAnimeData, mal_get: jikanStatus.status ? false : true })
    }

    return (
        <>
            <TextField
                autoComplete="off"
                fullWidth
                id="mal_link"
                label="MyAnimeList Linki"
                value={animeData.mal_link}
                onChange={handleInputChange("mal_link")}
                margin="normal"
                variant="filled"
                helperText="https://myanimelist.net/anime/32526/Love_Live_Sunshine ya da https://myanimelist.net/anime/32526"
                required
                error={animeData.mal_link ? checkMyAnimeListAnimeLink(animeData.mal_link) : false}
            />
            <Button
                style={{ marginRight: "5px" }}
                color="primary"
                variant="outlined"
                onClick={handleMALSubmit}
                disabled={animeData.mal_get ? true : false}
            >
                Bilgileri getir
            </Button>
            <Button
                style={{ marginRight: "5px" }}
                color="secondary"
                variant="outlined"
                onClick={clearData}>Bilgileri temizle</Button>
            <Button
                color="secondary"
                variant="outlined"
                onClick={() => setAnimeData({ ...animeData, mal_get: !animeData.mal_get })}>API Kullanmadan Ekle</Button>
            {animeData.mal_get ?
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label="Anime poster resmi"
                                    value={animeData.cover_art}
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
                                    value={animeData.header}
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
                                    value={animeData.name}
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
                                    value={animeData.synopsis}
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
                                    value={animeData.translators}
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
                                    value={animeData.encoders}
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
                                    value={animeData.studios}
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
                                    value={animeData.genres}
                                    onChange={handleInputChange("genres")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Türleri arasında virgülle, boşluksuz yazın. tür1,tür2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">Versiyon</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="version selector"
                                        name="gender1"
                                        value={animeData.version}
                                        onChange={handleInputChange("version")}
                                    >
                                        <FormControlLabel value="tv" control={<Radio />} label="TV" />
                                        <FormControlLabel value="bd" control={<Radio />} label="Blu-ray" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box textAlign="center">
                            <Button
                                variant="contained"
                                onClick={() => setAnimeData({ ...animeData, getEpisodes: !animeData.getEpisodes })}
                                color={
                                    animeData.getEpisodes
                                        ?
                                        "primary"
                                        :
                                        "secondary"
                                }
                            >
                                {
                                    animeData.getEpisodes
                                        ?
                                        "Bölümleri aç"
                                        :
                                        "Bölümleri açma"
                                }
                            </Button>
                        </Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Kaydet
                    </Button>
                    </form>
                </>
                : ""}
        </>
    )
}