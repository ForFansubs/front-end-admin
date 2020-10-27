import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormLabel, Radio, RadioGroup, FormControlLabel, makeStyles, Divider } from '@material-ui/core'
import { checkMyAnimeListAnimeLink, handleSelectData, checkYoutubeLink } from '../../components/pages/functions';
import { defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, updateAnime } from '../../config/api-routes';
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

export default function AnimeUpdate() {
    const { t } = useTranslation("pages")
    const classes = useStyles()

    const token = useGlobal("user")[0].token
    const [mobile] = useGlobal("mobile")
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
        const newData = Find(data, { id: event.target.value })
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
                ToastNotification(payload("success", t("anime.update.warnings.success")))
            })
            .catch(_ => {
                ToastNotification(payload("error", t("anime.create.errors.error")))
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
                    <InputLabel htmlFor="anime-selector">{t("anime.update.selector")}</InputLabel>
                    <Select
                        fullWidth
                        native={mobile ? true : false}
                        value={currentAnimeData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {mobile ?
                            data.map(d => <option key={d.id} value={d.id}>{d.name} [{d.version}]</option>)
                            : data.map(d => <MenuItem key={d.id} value={d.id}>{d.name} [{d.version}]</MenuItem>)
                        }
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
                            label={t("anime.common.inputs.mal_link.label")}
                            helperText={t("anime.common.inputs.mal_link.helperText")}
                            value={currentAnimeData.mal_link}
                            onChange={handleInputChange("mal_link")}
                            margin="normal"
                            variant="filled"
                            required
                            error={currentAnimeData.mal_link ? checkMyAnimeListAnimeLink(currentAnimeData.mal_link) : false}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label={t("anime.common.inputs.cover_art.label")}
                                    helperText={t("anime.common.inputs.cover_art.helperText")}
                                    value={currentAnimeData.cover_art}
                                    onChange={handleInputChange("cover_art")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                                {currentAnimeData.cover_art ?
                                    <img src={currentAnimeData.cover_art} alt={"cover_art"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="logo"
                                    label={t("anime.common.inputs.logo.label")}
                                    helperText={t("anime.update.inputs.logo.helperText")}
                                    value={currentAnimeData.logo || undefined}
                                    onChange={handleInputChange("logo")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {currentAnimeData.logo ?
                                    <img src={currentAnimeData.logo} alt={"logo"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label={t("anime.common.inputs.header.label")}
                                    helperText={t("anime.update.inputs.header.helperText")}
                                    value={currentAnimeData.header || undefined}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {currentAnimeData.header ?
                                    <img src={currentAnimeData.header} alt={"header"} />
                                    : ""}
                            </Grid>
                            <Divider />
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label={t("anime.common.inputs.name.label")}
                                    helperText={t("anime.common.inputs.name.helperText")}
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
                                    rows={3}
                                    rowsMax={3}
                                    label={t("anime.common.inputs.synopsis.label")}
                                    helperText={t("anime.common.inputs.synopsis.helperText")}
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
                                    label={t("anime.common.inputs.translators.label")}
                                    helperText={t("anime.common.inputs.translators.helperText")}
                                    value={currentAnimeData.translators}
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
                                    value={currentAnimeData.encoders}
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
                                    value={currentAnimeData.studios}
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
                                    value={currentAnimeData.genres}
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
                                    value={currentAnimeData.premiered}
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
                                    value={currentAnimeData.pv}
                                    onChange={handleInputChange("pv")}
                                    margin="normal"
                                    variant="filled"
                                    error={currentAnimeData.pv ? checkYoutubeLink(currentAnimeData.pv) : false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    slug={currentAnimeData.slug}
                                    setData={setData}
                                    setAnimeData={setCurrentAnimeData}
                                    release_date={new Date(currentAnimeData.release_date)} />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    slug={currentAnimeData.slug}
                                    setData={setData}
                                    setAnimeData={setCurrentAnimeData}
                                    release_date={new Date(currentAnimeData.release_date)} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="episode_count"
                                    label={t("anime.common.inputs.episode_count.label")}
                                    helperText={t("anime.common.inputs.episode_count.helperText")}
                                    value={currentAnimeData.episode_count}
                                    onChange={handleInputChange("episode_count")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                    <FormLabel component="legend">{t("anime.common.inputs.version.label")}</FormLabel>
                                    <RadioGroup
                                        style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                        aria-label="version selector"
                                        name="version"
                                        value={currentAnimeData.version}
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
                                        value={currentAnimeData.series_status}
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
                                        value={currentAnimeData.trans_status}
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
                            {t("common.buttons.save")}
                        </Button>
                    </form>
                </>}
        </>
    )
}