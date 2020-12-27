import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, FormControl, FormLabel, FormControlLabel, InputLabel, Select, MenuItem, FormGroup, Checkbox } from '@material-ui/core'
import { defaultEpisodeData, defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, addEpisode } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

export default function EpisodeCreate() {
    const { t } = useTranslation("pages")
    const token = useGlobal("user")[0].token

    const [data, setData] = useState([])
    const [currentAnimeData, setCurrentAnimeData] = useState({ ...defaultAnimeData })
    const [episodeData, setEpisodeData] = useState({ ...defaultEpisodeData })
    const [sendDiscordEmbed, setSendDiscordEmbed] = useState(true)
    const [loading, setLoading] = useState(true)

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

    function handleChange(event) {
        const newData = Find(data, { id: event.target.value })
        setCurrentAnimeData({ ...newData });
    }

    const handleInputChange = name => event => {
        event.persist()
        if (name === "special_type") {
            if (event.target.value === episodeData.special_type) return setEpisodeData(oldData => ({ ...oldData, special_type: "" }))
        }

        setEpisodeData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    function handleDiscordEmbedButton() {
        setSendDiscordEmbed(state => !state)
    }

    function handleCanUserDownloadButton() {
        setEpisodeData(state => ({ ...state, can_user_download: !state.can_user_download }))
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        if (currentAnimeData.slug === "") return

        const data = {
            ...episodeData,
            anime_id: currentAnimeData.id,
            send_discord_embed: sendDiscordEmbed
        }

        const headers = {
            "Authorization": token
        }

        axios.post(addEpisode, data, { headers })
            .then(_ => {
                ToastNotification(payload("success", t('episode.create.warnings.success')))
            })
            .catch(err => {
                ToastNotification(payload("error", err.response.data.err || t('episode.create.errors.error')))
            })
    }

    return (
        <>
            {!loading && data.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">{t('episode.create.anime_selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentAnimeData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.id}>{d.name} [{d.version}]</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {currentAnimeData.slug !== "" ?
                <>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="episode_number"
                                    label={t('common.inputs.episode_number_input')}
                                    value={episodeData.episode_number}
                                    onChange={handleInputChange("episode_number")}
                                    margin="normal"
                                    variant="filled"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="credits"
                                    label={t('common.inputs.credits_input')}
                                    value={episodeData.credits}
                                    onChange={handleInputChange("credits")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item style={{ textAlign: "center" }}>
                                <Button onClick={handleDiscordEmbedButton} variant="contained" color={sendDiscordEmbed ? "primary" : "secondary"}>
                                    {sendDiscordEmbed ? t('common.buttons.send_discord_embed') : t('common.buttons.dont_send_discord_embed')}
                                </Button>
                            </Grid>
                            <Grid item style={{ textAlign: "center" }}>
                                <Button onClick={handleCanUserDownloadButton} variant="contained" color={episodeData.can_user_download ? "primary" : "secondary"}>
                                    {episodeData.can_user_download ? t('common.buttons.can_user_download') : t('common.buttons.cant_user_download')}
                                </Button>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <FormLabel component="legend">{t('common.inputs.special_type_input')}</FormLabel>
                                <FormGroup row style={{ display: "flex", justifyContent: "center" }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={episodeData.special_type === "ova" ? true : false}
                                                onChange={handleInputChange('special_type')}
                                                value="ova"
                                            />
                                        }
                                        label="OVA"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={episodeData.special_type === "film" ? true : false}
                                                onChange={handleInputChange('special_type')}
                                                value="film"
                                            />
                                        }
                                        label="Film"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={episodeData.special_type === "toplu" ? true : false}
                                                onChange={handleInputChange('special_type')}
                                                value="toplu"
                                            />
                                        }
                                        label={t('episode.update.inputs.batch_link')}
                                    />
                                </FormGroup>
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