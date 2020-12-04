import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import Find from 'lodash-es/find'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, makeStyles } from '@material-ui/core'
import { defaultMotdData } from '../../components/pages/default-props';
import { addMotd, getFullAnimeList, getFullMangaList, getAnimeData, getMangaData } from '../../config/api-routes';
import { handleEpisodeTitleFormat } from '../../components/pages/functions'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    Container: {
        padding: `0 ${theme.spacing(24)}px`,
        [theme.breakpoints.down('lg')]: {
            padding: 0
        }
    }
}))

export default function MotdCreate() {
    const { t } = useTranslation(['pages', 'components'])
    const classes = useStyles()

    const token = useGlobal("user")[0].token
    const [motdData, setMotdData] = useState({ ...defaultMotdData })
    const [contentType, setContentType] = useState("")

    // Anime veya manga listesi
    const [parentData, setParentData] = useState([])
    // Anime veya manga listesi
    const [childData, setChildData] = useState([])
    // Seçilen animeyi ya da mangayı tutacak obje
    const [currentParentData, setCurrentParentData] = useState({})
    // Seçilen bölüm ya da animenin idsi
    const [motdContentId, setMotdContentId] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            switch (contentType) {
                case "anime": {
                    const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || t('motd.create.errors.anime_database_error')))
                    }
                    break
                }
                case "manga": {
                    const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || t('motd.create.errors.manga_database_error')))
                    }
                    break
                }
                case "episode": {
                    const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || t('motd.create.errors.episode_database_error')))
                    }
                    break
                }
                case "manga-episode": {
                    const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || t('motd.create.errors.manga_episode_database_error')))
                    }
                    break
                }
                default: {
                    return
                }
            }
        }

        fetchData()
    }, [contentType])

    useEffect(() => {
        if (contentType === "anime" || contentType === "manga" || !contentType || currentParentData === {}) return setChildData([])

        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            switch (contentType) {
                case "episode": {
                    const res = await axios.get(getAnimeData(currentParentData.slug), { headers }).catch(res => res)
                    if (res.status === 200 && res.data.episodes.length !== 0) {
                        setChildData(res.data.episodes)
                    }
                    else {
                        ToastNotification(payload("error", t('common.errors.database_error')))
                    }
                    break
                }
                case "manga-episode": {
                    const res = await axios.get(getMangaData(currentParentData.slug), { headers }).catch(res => res)
                    if (res.status === 200 && res.data.episodes.length !== 0) {
                        setChildData(res.data.episodes)
                    }
                    else {
                        ToastNotification(payload("error", t('common.errors.database_error')))
                    }
                    break
                }
                default: {
                    return
                }
            }
        }

        fetchData()
    }, [currentParentData])

    function handleDataSubmit(th) {
        th.preventDefault()

        const headers = {
            "Authorization": token
        }

        const data = {
            ...motdData,
            content_type: contentType,
            content_id: motdContentId
        }

        axios.post(addMotd, data, { headers })
            .then(_ => {
                ToastNotification(payload("success", t('motd.create.warnings.success')))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("error", t('motd.create.errors.error')))
            })
    }

    const handleInputChange = name => event => {
        event.persist()

        setMotdData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    function handleTypeChange(event) {
        setContentType(event.target.value);
    }

    function handleParentChange(event) {
        const newData = Find(parentData, { slug: event.target.value })

        if (contentType === "anime" || contentType === "manga")
            setMotdContentId(newData.id)

        setCurrentParentData({ ...newData });
    }

    function handleChildChange(event) {
        setMotdContentId(event.target.value);
    }

    function clearData() {
        setChildData([])
        setMotdContentId("")
        setCurrentParentData({})
        setParentData([])
        setContentType("")
        setMotdData({ ...defaultMotdData })
    }

    return (
        <>
            <>
                <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                    <Grid container spacing={2} className={classes.Container}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="title"
                                label={t('motd.create.inputs.title')}
                                value={motdData.title}
                                onChange={handleInputChange("title")}
                                margin="normal"
                                variant="filled"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                // TODO: Markdown editor
                            }
                            <TextField
                                fullWidth
                                rows={5}
                                rowsMax={10}
                                id="subtitle"
                                label={t('motd.create.inputs.subtitle')}
                                multiline
                                value={motdData.subtitle}
                                type="text"
                                onChange={handleInputChange("subtitle")}
                                margin="normal"
                                variant="filled"
                                required
                                helperText="Markdown ve basit HTML destekler. https://probablyup.com/markdown-to-jsx/"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="content-type">{t('motd.create.page_selector')}</InputLabel>
                                <Select
                                    fullWidth
                                    value={contentType}
                                    onChange={handleTypeChange}
                                    id="content-type"
                                    inputProps={{
                                        name: "Content type selector",
                                        id: "content-type"
                                    }}
                                >
                                    <MenuItem value="">{t('motd.create.inputs.homepage')}</MenuItem>
                                    <MenuItem value="anime">{t('components:header.anime.default')}</MenuItem>
                                    <MenuItem value="manga">{t('components:header.manga.default')}</MenuItem>
                                    <MenuItem value="episode">{t('components:header.episode.default')}</MenuItem>
                                    <MenuItem value="manga-episode">{t('components:header.manga_episode.default')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled" disabled={parentData.length !== 0 ? false : true}>
                                <InputLabel htmlFor="parent-data">{t('motd.create.content_selector')}</InputLabel>
                                <Select
                                    fullWidth
                                    id="parent-data"
                                    value={currentParentData.slug ? currentParentData.slug : ""}
                                    onChange={handleParentChange}
                                    inputProps={{
                                        name: "Parent data selector",
                                        id: "parent-data"
                                    }}
                                >
                                    {parentData.length !== 0 ?
                                        parentData.map(d => <MenuItem key={d.id} value={d.slug}>{d.name} {d.version ? `- ${d.version}` : ""}</MenuItem>)
                                        : <MenuItem>---</MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>
                        {childData.length !== 0 ?
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="filled" disabled={childData.length !== 0 ? false : true}>
                                    <InputLabel htmlFor="parent-data">{t('motd.create.episode_selector')}</InputLabel>
                                    <Select
                                        fullWidth
                                        value={motdContentId ? motdContentId : ""}
                                        onChange={handleChildChange}
                                        inputProps={{
                                            name: "Child data selector",
                                            id: "childData"
                                        }}
                                    >
                                        {childData.map(d => <MenuItem key={d.id} value={d.id}>{handleEpisodeTitleFormat(d)}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            : ""
                        }
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                <FormLabel component="legend">Kullanıcı kapatabilsin mi?</FormLabel>
                                <RadioGroup
                                    style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    aria-label="can_user_dismiss selector"
                                    name="can_user_dismiss"
                                    value={Number(motdData.can_user_dismiss)}
                                    onChange={handleInputChange("can_user_dismiss")}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Evet" />
                                    <FormControlLabel value={0} control={<Radio />} label="Hayır" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" style={{ width: "100%", textAlign: "center" }}>
                                <FormLabel component="legend">Aktif mi?</FormLabel>
                                <RadioGroup
                                    style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    aria-label="is_active selector"
                                    name="is_active"
                                    value={Number(motdData.is_active)}
                                    onChange={handleInputChange("is_active")}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label={t('common.buttons.yes')} />
                                    <FormControlLabel value={0} control={<Radio />} label={t('common.buttons.no')} />
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
        </>
    )
}