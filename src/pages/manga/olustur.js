import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification from '../../components/toastify/toast'

import { Button, Grid, TextField, Divider, makeStyles, FormLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { checkMyAnimeListMangaLink } from '../../components/pages/functions';
import { defaultMangaData } from '../../components/pages/default-props';
import { jikanIndex, addManga } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    ImageContainer: {
        textAlign: "center",

        '& img': {
            width: "30%"
        }
    }
}))

export default function MangaCreate() {
    const { t } = useTranslation('pages')
    const classes = useStyles()

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
                message: t("manga.create.errors.wrong_mal_link")
            }
            return ToastNotification(payload)
        }
        const link = mangaData.mal_link.split('/')
        const id = link[4]
        const manga = await axios.get(`${jikanIndex}/manga/${id}`).catch(_ => {
            const payload = {
                container: "process-error",
                type: "error",
                message: t("anime.create.errors.cant_find_link")
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
                    message: t("anime.create.errors.cant_find_link")
                }

                ToastNotification(payload)
                return setMangaData({ mal_get: true })
            }
        }

        let turler = [], yazarlar = []
        manga.data.genres.forEach(genre => turler.push(genre.name))
        manga.data.authors.forEach(authors => yazarlar.push(authors.name.replace(',', '')))
        const date = new Date(manga.data.published.from)
        const newMangaData = {
            cover_art: manga.data.image_url,
            name: manga.data.title,
            release_date: date,
            authors: yazarlar.join(','),
            genres: turler.join(','),
            premiered: manga.data.premiered,
            episode_count: manga.data.airing ? 0 : manga.data.episodes
        }

        const header = await axios.get(`/header-getir?type=manga`, { name: manga.data.title }).catch(_ => _)

        if (header.status === 200) {
            newMangaData.header = header.data.header
        }
        else {
            newMangaData.header = ""
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
                    message: t('manga.create.warnings.success'),
                    type: "success"
                }
                ToastNotification(payload)
            })
            .catch(err => {
                console.log(err)
                const payload = {
                    container: "process-error",
                    message: err.response.data.err || t('manga.create.errors.error'),
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
                label={t('common.inputs.mal_link.label')}
                helperText={t('common.inputs.mal_link.helperText')}
                value={mangaData.mal_link}
                onChange={handleInputChange("mal_link")}
                margin="normal"
                variant="filled"
                required
                error={mangaData.mal_link ? checkMyAnimeListMangaLink(mangaData.mal_link) : false}
            />
            <Button
                style={{ marginRight: "5px" }}
                color="primary"
                variant="outlined"
                onClick={handleMALSubmit}
                disabled={mangaData.mal_get ? true : false}
            >
                {t("common.buttons.get_information")}
            </Button>
            <Button
                style={{ marginRight: "5px" }}
                color="secondary"
                variant="outlined"
                onClick={clearData}>{t("common.buttons.clean_information")}</Button>
            <Button
                color="secondary"
                variant="outlined"
                onClick={() => setMangaData({ ...mangaData, mal_get: !mangaData.mal_get })}>
                {t("common.buttons.add_without_api")}
            </Button>
            {mangaData.mal_get ?
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label={t("common.inputs.cover_art.label")}
                                    value={mangaData.cover_art}
                                    onChange={handleInputChange("cover_art")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                                {mangaData.cover_art ?
                                    <img src={mangaData.cover_art} alt={"cover_art"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="logo"
                                    label={t('common.inputs.logo.label')}
                                    helperText={t('common.inputs.logo.helperText')}
                                    value={mangaData.logo}
                                    onChange={handleInputChange("logo")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {mangaData.logo ?
                                    <img src={mangaData.logo} alt={"logo"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label={t("common.inputs.header.label")}
                                    helperText={t("common.inputs.header.helperText")}
                                    value={mangaData.header}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {mangaData.header ?
                                    <img src={mangaData.header} alt={"header"} />
                                    : ""}
                            </Grid>
                            <Divider />
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label={t("common.inputs.name.label")}
                                    helperText={t("common.inputs.name.helperText")}
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
                                    label={t("common.inputs.synopsis.label")}
                                    helperText={t("common.inputs.synopsis.helperText")}
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
                                    label={t("common.inputs.translators.label")}
                                    helperText={t("common.inputs.translators.helperText")}
                                    value={mangaData.translators}
                                    onChange={handleInputChange("translators")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="editors"
                                    label={t("common.inputs.editors.label")}
                                    helperText={t("common.inputs.editors.helperText")}
                                    value={mangaData.editors}
                                    onChange={handleInputChange("editors")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="authors"
                                    label={t("common.inputs.authors.label")}
                                    helperText={t("common.inputs.authors.helperText")}
                                    value={mangaData.authors}
                                    onChange={handleInputChange("authors")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="genres"
                                    label={t("common.inputs.genres.label")}
                                    helperText={t("common.inputs.genres.helperText")}
                                    value={mangaData.genres}
                                    onChange={handleInputChange("genres")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="reader_link"
                                    label={t("common.inputs.reader_link.label")}
                                    helperText={t("common.inputs.reader_link.helperText")}
                                    value={mangaData.reader_link}
                                    onChange={handleInputChange("reader_link")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="download_link"
                                    label={t("common.inputs.download_link.label")}
                                    helperText={t("common.inputs.download_link.helperText")}
                                    value={mangaData.download_link}
                                    onChange={handleInputChange("download_link")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">{t("common.inputs.series_status.label")}</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="series_status"
                                        name="series status"
                                        value={mangaData.series_status}
                                        onChange={handleInputChange("series_status")}
                                    >
                                        <FormControlLabel value="currently_airing" control={<Radio />} label={t("common:ns.currently_airing")} />
                                        <FormControlLabel value="finished_airing" control={<Radio />} label={t("common:ns.finished_airing")} />
                                        <FormControlLabel value="not_aired_yet" control={<Radio />} label={t("common:ns.not_aired_yet")} />
                                        <FormControlLabel value="postponed" control={<Radio />} label={t("common:ns.postponed")} />
                                        <FormControlLabel value="canceled" control={<Radio />} label={t("common:ns.canceled")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">{t("common.inputs.trans_status.label")}</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="trans_status"
                                        name="trans_status"
                                        value={mangaData.trans_status}
                                        onChange={handleInputChange("trans_status")}
                                    >
                                        <FormControlLabel value="currently_airing" control={<Radio />} label={t("common:ns.currently_airing")} />
                                        <FormControlLabel value="finished_airing" control={<Radio />} label={t("common:ns.finished_airing")} />
                                        <FormControlLabel value="not_aired_yet" control={<Radio />} label={t("common:ns.not_aired_yet")} />
                                        <FormControlLabel value="postponed" control={<Radio />} label={t("common:ns.postponed")} />
                                        <FormControlLabel value="canceled" control={<Radio />} label={t("common:ns.canceled")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit">
                            {t("common.buttons.save")}
                        </Button>
                    </form>
                </>
                : ""}
        </>
    )
}