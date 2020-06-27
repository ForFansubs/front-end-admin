import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Divider, makeStyles } from '@material-ui/core'
import { checkMyAnimeListAnimeLink, checkYoutubeLink } from '../../components/pages/functions';
import { defaultAnimeData } from '../../components/pages/default-props';
import { jikanIndex, addAnime } from '../../config/api-routes';

const useStyles = makeStyles(theme => ({
    ImageContainer: {
        textAlign: "center",

        '& img': {
            width: "30%"
        }
    }
}))

export default function AnimeCreate() {
    const token = useGlobal("user")[0].token
    const [jikanStatus] = useGlobal('jikanStatus')
    const [animeData, setAnimeData] = useState({ ...defaultAnimeData, mal_get: jikanStatus.status ? false : true })
    const classes = useStyles()

    const handleInputChange = name => event => {
        event.persist()

        setAnimeData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    async function handleMALSubmit(th) {
        th.preventDefault()
        if (!animeData.mal_link || checkMyAnimeListAnimeLink(animeData.mal_link)) {
            const payload = {
                type: "error",
                message: "Girdiğiniz link MyAnimeList Anime linki değil."
            }
            return ToastNotification(payload)
        }
        const link = animeData.mal_link.split('/')
        const id = link[4]
        const anime = await axios.get(`${jikanIndex}/anime/${id}`).catch(_ => {
            const payload = {
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
            cover_art: anime.data.image_url ? anime.data.image_url : "",
            name: anime.data.title ? anime.data.title : "",
            series_status: anime.data.status ? anime.data.status : false,
            release_date: date ? date : Date.now(),
            studios: studyolar ? studyolar.join(',') : [],
            genres: turler ? turler.join(',') : [],
            airing: anime.data.airing ? anime.data.airing : false,
            premiered: anime.data.premiered ? anime.data.premiered : "",
            episode_count: anime.data.episodes ? anime.data.episodes : 0,
            pv: anime.data.trailer_url ? anime.data.trailer_url : ""
        }
<<<<<<< HEAD
        const header = await axios.get(`/header-getir/${generalSlugify(anime.data.title)}`).catch(_ => _)
=======
        const header = await axios.post(`/header-getir`, { name: anime.data.title }).catch(_ => _)
>>>>>>> beta

        if (header.status === 200) {
            newAnimeData.header = header.data.header
            newAnimeData.cover_art = header.data.cover_art ? header.data.cover_art : newAnimeData.cover_art
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
                    message: "Anime başarıyla eklendi.",
                    type: "success"
                }
                ToastNotification(payload)
            })
            .catch(err => {
                ToastNotification(payload("error", err.response.data.err || "Animeyi eklerken bir sorunla karşılaştık."))
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
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
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
                                {animeData.cover_art ?
                                    <img src={animeData.cover_art} alt={"cover_art"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="logo"
                                    label="Anime logo resmi"
                                    value={animeData.logo}
                                    onChange={handleInputChange("logo")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {animeData.logo ?
                                    <img src={animeData.logo} alt={"logo"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label="Anime header resmi"
                                    value={animeData.header}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {animeData.header ?
                                    <img src={animeData.header} alt={"header"} />
                                    : ""}
                            </Grid>
                            <Divider />
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="premiered"
                                    label="Sezon"
                                    value={animeData.premiered}
                                    onChange={handleInputChange("premiered")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Kış/İlkbahar/Yaz/Sonbahar XXXX"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="pv"
                                    label="Anime Trailerı"
                                    value={animeData.pv}
                                    onChange={handleInputChange("pv")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Sadece Youtube linki"
                                    error={animeData.pv ? checkYoutubeLink(animeData.pv) : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="episode_count"
                                    label="Bölüm sayısı (Yoksa 0 yazın)"
                                    value={animeData.episode_count}
                                    onChange={handleInputChange("episode_count")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">Versiyon</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="version selector"
                                        name="version"
                                        value={animeData.version}
                                        onChange={handleInputChange("version")}
                                    >
                                        <FormControlLabel value="tv" control={<Radio />} label="TV" />
                                        <FormControlLabel value="bd" control={<Radio />} label="Blu-ray" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">Seri Durumu [{animeData.airing ? "Seri şu anda yayınlanıyor" : "Seri şu anda yayınlanmıyor"}]</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="series_status"
                                        name="series status"
                                        value={animeData.series_status}
                                        onChange={handleInputChange("series_status")}
                                    >
                                        <FormControlLabel value="Currently Airing" control={<Radio />} label="Devam Ediyor" />
                                        <FormControlLabel value="Finished Airing" control={<Radio />} label="Tamamlandı" />
                                        <FormControlLabel value="Not yet aired" control={<Radio />} label="Daha yayınlanmadı" />
                                        <FormControlLabel value="Ertelendi" control={<Radio />} label="Ertelendi" />
                                        <FormControlLabel value="İptal Edildi" control={<Radio />} label="İptal Edildi" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">Çeviri Durumu</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="trans_status"
                                        name="trans_status"
                                        value={animeData.trans_status}
                                        onChange={handleInputChange("trans_status")}
                                    >
                                        <FormControlLabel value="Devam Ediyor" control={<Radio />} label="Devam Ediyor" />
                                        <FormControlLabel value="Tamamlandı" control={<Radio />} label="Tamamlandı" />
                                        <FormControlLabel value="Ertelendi" control={<Radio />} label="Ertelendi" />
                                        <FormControlLabel value="İptal Edildi" control={<Radio />} label="İptal Edildi" />
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
                </>
                : ""}
        </>
    )
}