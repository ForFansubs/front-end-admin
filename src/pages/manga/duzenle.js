import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, Divider, makeStyles, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { checkMyAnimeListMangaLink } from '../../components/pages/functions';
import { defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, updateManga } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    ImageContainer: {
        textAlign: "center",

        '& img': {
            width: "30%"
        }
    }
}))

export default function MangaUpdate() {
    const { t } = useTranslation('pages')
    const classes = useStyles()

    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])
    const [currentMangaData, setCurrentMangaData] = useState({ ...defaultMangaData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
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
        setCurrentMangaData({ ...newData });
    }

    const handleInputChange = name => event => {
        const newDataSet = data
        newDataSet[FindIndex(data, { slug: currentMangaData.slug })][name] = event.target.value
        setData(newDataSet)
        setCurrentMangaData({ ...currentMangaData, [name]: event.target.value })
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const newData = currentMangaData
        const headers = {
            "Authorization": token
        }

        axios.post(updateManga, newData, { headers })
            .then(_ => {
                clearData()
                ToastNotification(payload("success", t('manga.update.warnings.success')))
            })
            .catch(_ => {
                ToastNotification(payload("error", t('manga.update.errors.error')))
            })
    }

    function clearData() {
        setCurrentMangaData({ ...defaultMangaData })
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
                    <InputLabel htmlFor="manga-selector">{t('manga.update.manga_selector')}</InputLabel>
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
            {currentMangaData.slug === "" ? "" :
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <TextField
                            autoComplete="off"
                            fullWidth
                            id="mal_link"
                            label={t('common.inputs.mal_link.label')}
                            helperText={t('common.inputs.mal_link.helperText')}
                            value={currentMangaData.mal_link}
                            onChange={handleInputChange("mal_link")}
                            margin="normal"
                            variant="filled"
                            required
                            error={currentMangaData.mal_link ? checkMyAnimeListMangaLink(currentMangaData.mal_link) : false}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label={t('common.inputs.cover_art.label')}
                                    value={currentMangaData.cover_art}
                                    onChange={handleInputChange("cover_art")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                                {currentMangaData.cover_art ?
                                    <img src={currentMangaData.cover_art} alt={"cover_art"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="logo"
                                    label={t('common.inputs.logo.label')}
                                    helperText={t('common.inputs.logo.helperText')}
                                    value={currentMangaData.logo || undefined}
                                    onChange={handleInputChange("logo")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {currentMangaData.logo ?
                                    <img src={currentMangaData.logo} alt={"logo"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label={t("common.inputs.header.label")}
                                    helperText={t("common.inputs.header.helperText")}
                                    value={currentMangaData.header || undefined}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                />
                                {currentMangaData.header ?
                                    <img src={currentMangaData.header} alt={"header"} />
                                    : ""}
                            </Grid>
                            <Divider />
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label={t("common.inputs.name.label")}
                                    helperText={t("common.inputs.name.helperText")}
                                    value={currentMangaData.name}
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
                                    value={currentMangaData.synopsis}
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
                                    value={currentMangaData.translators}
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
                                    value={currentMangaData.editors}
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
                                    value={currentMangaData.authors}
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
                                    value={currentMangaData.genres}
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
                                    value={currentMangaData.reader_link}
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
                                    value={currentMangaData.download_link}
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
                                        value={currentMangaData.series_status}
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
                                        value={currentMangaData.trans_status}
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
                </>}
        </>
    )
}