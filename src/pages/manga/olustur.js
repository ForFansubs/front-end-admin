import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification from '../../components/toastify/toast'

import { Button, Grid, TextField } from '@material-ui/core'
import { checkMyAnimeListMangaLink, generalSlugify } from '../../components/pages/functions';
import { defaultMangaData } from '../../components/pages/default-props';
import { jikanIndex, addManga } from '../../config/api-routes';

export default function MangaCreate() {
    const token = useGlobal("user")[0].token
    const [jikanStatus] = useGlobal('jikanStatus')
    const [mangaData, setMangaData] = useState({ ...defaultMangaData, mal_get: jikanStatus.status ? false : true })

    const handleInputChange = name => event => {
        event.persist()
        setMangaData({ ...mangaData, [name]: event.target.value })
    }

    async function handleMALSubmit(th) {
        th.preventDefault()
        if (mangaData.mal_link === "-") return setMangaData(data => ({ ...data, mal_get: true }))
        if (!mangaData.mal_link || checkMyAnimeListMangaLink(mangaData.mal_link)) {
            const payload = {
                container: "process-error",
                type: "error",
                message: "Girdiğiniz link MyMangaList Manga linki değil."
            }
            return ToastNotification(payload)
        }
        const link = mangaData.mal_link.split('/')
        const id = link[4]
        const manga = await axios.get(`${jikanIndex}/manga/${id}`).catch(_ => {
            const payload = {
                container: "process-error",
                type: "error",
                message: "Girdiğiniz linkin bilgisi bulunamadı."
            }

            ToastNotification(payload)
            setMangaData({ mal_get: true })
            return { status: 408, data: { NOTICE: "err" } }
        })

        if (manga.data) {
            const mangaNotice = manga.data.NOTICE || false

            if (mangaNotice) {
                const payload = {
                    container: "process-error",
                    type: "error",
                    message: "Girdiğiniz linkin bilgisi bulunamadı."
                }

                ToastNotification(payload)
                return setMangaData({ mal_get: true })
            }
        }

        let turler = [], studyolar = []
        manga.data.genres.forEach(genre => turler.push(genre.name))
        manga.data.studios.forEach(studio => studyolar.push(studio.name))
        const date = new Date(manga.data.aired.from)
        const newMangaData = {
            cover_art: manga.data.image_url,
            name: manga.data.title,
            release_date: date,
            studios: studyolar.join(','),
            genres: turler.join(','),
            premiered: manga.data.premiered,
            episode_count: manga.data.airing ? 0 : manga.data.episodes
        }
        const header = await axios.get(`/header-getir/${generalSlugify(manga.data.title)}`).catch(_ => _)
        const synopsis = await axios.post('/ta-konu-getir/', { name: manga.data.title }).catch(_ => _)

        if (header.status === 200) {
            newMangaData.header = header.data.header
        }
        else {
            newMangaData.header = ""
        }
        if (synopsis.status === 200) {
            newMangaData.synopsis = synopsis.data.konu
            newMangaData.ta_link = synopsis.data.ta_link
        }
        else {
            newMangaData.synopsis = "Eklenecek..."
        }

        setMangaData({ ...mangaData, ...newMangaData, mal_get: true })
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const data = mangaData
        const headers = {
            "Authorization": token
        }

        axios.post(addManga, data, { headers })
            .then(res => {
                const payload = {
                    container: "process-success",
                    message: "Manga başarıyla eklendi.",
                    type: "success"
                }
                ToastNotification(payload)
            })
            .catch(err => {
                console.log(err)
                const payload = {
                    container: "process-error",
                    message: err.response.data.err || "Mangayı eklerken bir sorunla karşılaştık.",
                    type: "error"
                }
                ToastNotification(payload)
            })
    }

    function clearData() {
        setMangaData({ ...defaultMangaData, mal_get: jikanStatus.status ? false : true })
    }

    return (
        <>
            <TextField
                autoComplete="off"
                fullWidth
                id="mal_link"
                label="MyAnimeList Linki"
                value={mangaData.mal_link}
                onChange={handleInputChange("mal_link")}
                margin="normal"
                variant="filled"
                helperText="https://myanimelist.net/manga/99529/Love_Live_Sunshine ya da https://myanimelist.net/manga/99529 (Yoksa -)"
                required
                error={mangaData.mal_link ? checkMyAnimeListMangaLink(mangaData.mal_link) : false}
            />
            <Button
                color="primary"
                variant="outlined"
                onClick={handleMALSubmit}
                disabled={mangaData.mal_get ? true : false}
            >
                Bilgileri getir
            </Button>
            <Button
                color="secondary"
                variant="outlined"
                onClick={clearData}>Bilgileri temizle</Button>
            <Button
                color="secondary"
                variant="outlined"
                onClick={() => setMangaData({ ...mangaData, mal_get: !mangaData.mal_get })}>API Kullanmadan Ekle</Button>
            {mangaData.mal_get ?
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label="Manga poster resmi"
                                    value={mangaData.cover_art}
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
                                    label="Manga header resmi"
                                    value={mangaData.header}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label="Manga ismi"
                                    value={mangaData.name}
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
                                    label="Manga konusu"
                                    value={mangaData.synopsis}
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
                                    value={mangaData.translators}
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
                                    id="editors"
                                    label="Editörler"
                                    value={mangaData.editors}
                                    onChange={handleInputChange("editors")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Editörleri arasında virgülle, boşluksuz yazın. editör1,editör2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="authors"
                                    label="Yazarlar"
                                    value={mangaData.authors}
                                    onChange={handleInputChange("authors")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="Yazarları arasında virgülle, boşluksuz yazın. yazar1,yazar2 gibi"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="genres"
                                    label="Türler"
                                    value={mangaData.genres}
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
                                    id="mos_link"
                                    label="Okuma Linki"
                                    value={mangaData.mos_link}
                                    onChange={handleInputChange("mos_link")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="download_link"
                                    label="İndirme Linki"
                                    value={mangaData.download_link}
                                    onChange={handleInputChange("download_link")}
                                    margin="normal"
                                    variant="filled"
                                />
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