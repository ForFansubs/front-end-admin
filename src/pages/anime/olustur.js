import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, makeStyles } from '@material-ui/core'
import { checkMyAnimeListAnimeLink, checkYoutubeLink } from '../../components/pages/functions';
import { defaultAnimeData } from '../../components/pages/default-props';
import { jikanIndex, addAnime } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'
import { DatePicker, TimePicker } from '../../components/datetime-picker'

const useStyles = makeStyles(theme => ({
    ImageContainer: {
        textAlign: "center",

        '& img': {
            width: "30%"
        }
    }
}))

export default function AnimeCreate() {
    const { t } = useTranslation("pages")
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
                message: t("anime.create.errors.wrong_mal_link")
            }
            return ToastNotification(payload)
        }
        const link = animeData.mal_link.split('/')
        const id = link[4]
        const anime = await axios.get(`${jikanIndex}/anime/${id}`).catch(_ => {
            const payload = {
                type: "error",
                message: t("anime.create.errors.cant_find_link")
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
                    message: t("anime.create.errors.cant_find_link")
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
            release_date: date ? new Date(date) : new Date(),
            studios: studyolar ? studyolar.join(',') : [],
            genres: turler ? turler.join(',') : [],
            airing: anime.data.airing ? anime.data.airing : false,
            premiered: anime.data.premiered ? anime.data.premiered : "",
            episode_count: anime.data.episodes ? anime.data.episodes : 0,
            pv: anime.data.trailer_url ? anime.data.trailer_url : ""
        }

        const header = await axios.post(`/header-getir`, { name: anime.data.title }).catch(_ => _)

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
            .then(_ => {
                const payload = {
                    message: t("anime.create.warnings.success"),
                    type: "success"
                }
                ToastNotification(payload)
            })
            .catch(err => {
                ToastNotification(payload("error", err.response.data.err || t("anime.create.errors.cant_add_anime")))
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
                label={t("anime.common.inputs.mal_link.label")}
                helperText={t("anime.common.inputs.mal_link.helperText")}
                value={animeData.mal_link}
                onChange={handleInputChange("mal_link")}
                margin="normal"
                variant="filled"
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
                {t("anime.create.buttons.get_information")}
            </Button>
            <Button
                style={{ marginRight: "5px" }}
                color="secondary"
                variant="outlined"
                onClick={clearData}>{t("anime.create.buttons.clean_information")}</Button>
            <Button
                color="secondary"
                variant="outlined"
                onClick={() => setAnimeData({ ...animeData, mal_get: !animeData.mal_get })}>{t("anime.create.buttons.add_without_api")}</Button>
            {animeData.mal_get ?
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label={t("anime.common.inputs.cover_art.label")}
                                    helperText={t("anime.common.inputs.cover_art.helperText")}
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
                                    label={t("anime.common.inputs.logo.label")}
                                    helperText={t("anime.common.inputs.logo.helperText")}
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
                                    label={t("anime.common.inputs.header.label")}
                                    helperText={t("anime.common.inputs.header.helperText")}
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
                                    label={t("anime.common.inputs.name.label")}
                                    helperText={t("anime.common.inputs.name.helperText")}
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
                                    rows={3}
                                    rowsMax={3}
                                    label={t("anime.common.inputs.synopsis.label")}
                                    helperText={t("anime.common.inputs.synopsis.helperText")}
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
                                    label={t("anime.common.inputs.translators.label")}
                                    helperText={t("anime.common.inputs.translators.helperText")}
                                    value={animeData.translators}
                                    onChange={handleInputChange("translators")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="encoders"
                                    label={t("anime.common.inputs.encoders.label")}
                                    helperText={t("anime.common.inputs.encoders.helperText")}
                                    value={animeData.encoders}
                                    onChange={handleInputChange("encoders")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="studios"
                                    label={t("anime.common.inputs.studios.label")}
                                    helperText={t("anime.common.inputs.studios.helperText")}
                                    value={animeData.studios}
                                    onChange={handleInputChange("studios")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="genres"
                                    label={t("anime.common.inputs.genres.label")}
                                    helperText={t("anime.common.inputs.genres.helperText")}
                                    value={animeData.genres}
                                    onChange={handleInputChange("genres")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="premiered"
                                    label={t("anime.common.inputs.premiered.label")}
                                    helperText={t("anime.common.inputs.premiered.helperText")}
                                    value={animeData.premiered}
                                    onChange={handleInputChange("premiered")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="pv"
                                    label={t("anime.common.inputs.pv.label")}
                                    helperText={t("anime.common.inputs.pv.helperText")}
                                    value={animeData.pv}
                                    onChange={handleInputChange("pv")}
                                    margin="normal"
                                    variant="filled"
                                    error={animeData.pv ? checkYoutubeLink(animeData.pv) : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker setAnimeData={setAnimeData} release_date={animeData.release_date} />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker setAnimeData={setAnimeData} release_date={animeData.release_date} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="episode_count"
                                    label={t("anime.common.inputs.episode_count.label")}
                                    helperText={t("anime.common.inputs.episode_count.helperText")}
                                    value={animeData.episode_count}
                                    onChange={handleInputChange("episode_count")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">{t("anime.common.inputs.version.label")}</FormLabel>
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
                                    <FormLabel component="legend">{t("anime.common.inputs.series_status.label")}</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="series_status"
                                        name="series status"
                                        value={animeData.series_status}
                                        onChange={handleInputChange("series_status")}
                                    >
                                        <FormControlLabel value="currently_airing" control={<Radio />} label={t("anime.common.radios.currently_airing")} />
                                        <FormControlLabel value="finished_airing" control={<Radio />} label={t("anime.common.radios.finished_airing")} />
                                        <FormControlLabel value="not_aired_yet" control={<Radio />} label={t("anime.common.radios.not_aired_yet")} />
                                        <FormControlLabel value="postponed" control={<Radio />} label={t("anime.common.radios.postponed")} />
                                        <FormControlLabel value="canceled" control={<Radio />} label={t("anime.common.radios.canceled")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">{t("anime.common.inputs.trans_status.label")}</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="trans_status"
                                        name="trans_status"
                                        value={animeData.trans_status}
                                        onChange={handleInputChange("trans_status")}
                                    >
                                        <FormControlLabel value="currently_airing" control={<Radio />} label={t("anime.common.radios.currently_airing")} />
                                        <FormControlLabel value="finished_airing" control={<Radio />} label={t("anime.common.radios.finished_airing")} />
                                        <FormControlLabel value="not_aired_yet" control={<Radio />} label={t("anime.common.radios.not_aired_yet")} />
                                        <FormControlLabel value="postponed" control={<Radio />} label={t("anime.common.radios.postponed")} />
                                        <FormControlLabel value="canceled" control={<Radio />} label={t("anime.common.radios.canceled")} />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit">
                            {t("anime.common.buttons.save")}
                        </Button>
                    </form>
                </>
                : ""}
        </>
    )
}