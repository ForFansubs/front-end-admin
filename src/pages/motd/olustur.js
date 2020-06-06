import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import Find from 'lodash-es/find'
import ToastNotification, { payload } from '../../components/toastify/toast'
import { FixedSizeList } from 'react-window';

import { Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, Menu } from '@material-ui/core'
import { defaultMotdData } from '../../components/pages/default-props';
import { addMotd, getFullAnimeList, getFullMangaList, getAnimeData, getMangaData } from '../../config/api-routes';
import { handleEpisodeTitleFormat } from '../../components/pages/functions'

export default function () {
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
                        ToastNotification(payload("error", res.response.data.err || "Animeleri getirirken bir sorunla karşılaştık."))
                    }
                    break
                }
                case "manga": {
                    const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || "Mangaları getirirken bir sorunla karşılaştık."))
                    }
                    break
                }
                case "bolum": {
                    const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || "Animeleri getirirken bir sorunla karşılaştık."))
                    }
                    break
                }
                case "manga-bolum": {
                    const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
                    if (res.status === 200) {
                        setParentData(res.data)
                    }
                    else {
                        ToastNotification(payload("error", res.response.data.err || "Animeleri getirirken bir sorunla karşılaştık."))
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
                case "bolum": {
                    const res = await axios.get(getAnimeData(currentParentData.slug), { headers }).catch(res => res)
                    if (res.status === 200 && res.data.episodes.length !== 0) {
                        setChildData(res.data.episodes)
                    }
                    else {
                        ToastNotification(payload("error", "Bölümleri getirirken bir sorunla karşılaştık."))
                    }
                    break
                }
                case "manga-bolum": {
                    const res = await axios.get(getMangaData(currentParentData.slug), { headers }).catch(res => res)
                    if (res.status === 200 && res.data.episodes.length !== 0) {
                        setChildData(res.data.episodes)
                    }
                    else {
                        ToastNotification(payload("error", "Bölümleri getirirken bir sorunla karşılaştık."))
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
                ToastNotification(payload("success", "MOTD başarıyla eklendi."))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("error", "MOTDyi eklerken bir sorunla karşılaştık."))
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
        setMotdData({ ...defaultMotdData })
    }

    return (
        <>
            <>
                <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="title"
                                label="MOTD Başlığı"
                                value={motdData.title}
                                onChange={handleInputChange("title")}
                                margin="normal"
                                variant="filled"
                            />
                        </Grid>
                        {
                            // TODO: Bu inputu markdown olarak al. Ön tarafta ona göre ayar yap.  
                        }
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="subtitle"
                                label="MOTD İçerik"
                                multiline
                                value={motdData.subtitle}
                                type="text"
                                onChange={handleInputChange("subtitle")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel htmlFor="content-type">Görünmesini istediğiniz sayfayı seçin</InputLabel>
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
                                    <MenuItem value="">Hiçbiri</MenuItem>
                                    <MenuItem value="anime">Anime</MenuItem>
                                    <MenuItem value="manga">Manga</MenuItem>
                                    <MenuItem value="bolum">Anime Bölüm</MenuItem>
                                    <MenuItem value="manga-bolum">Manga Bölüm</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="filled" disabled={parentData.length !== 0 ? false : true}>
                                <InputLabel htmlFor="parent-data">Görünmesini istediğiniz içeriği seçin</InputLabel>
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
                                        : <MenuItem>Boş</MenuItem>}
                                </Select>
                            </FormControl>
                        </Grid>
                        {childData.length !== 0 ?
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="filled" disabled={childData.length !== 0 ? false : true}>
                                    <InputLabel htmlFor="parent-data">Görünmesini istediğiniz bölümü seçin</InputLabel>
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
                                    <FormControlLabel value={1} control={<Radio />} label="Evet" />
                                    <FormControlLabel value={0} control={<Radio />} label="Hayır" />
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
        </>
    )
}