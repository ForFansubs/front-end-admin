import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, Divider, makeStyles } from '@material-ui/core'
import { checkMyAnimeListMangaLink } from '../../components/pages/functions';
import { defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, updateManga } from '../../config/api-routes';

const useStyles = makeStyles(theme => ({
    ImageContainer: {
        textAlign: "center",

        '& img': {
            width: "30%"
        }
    }
}))

export default function MangaUpdate() {
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
        const newData = Find(data, { name: event.target.value })
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
                ToastNotification(payload("success", "Manga başarıyla güncellendi."))
            })
            .catch(_ => {
                ToastNotification(payload("error", "Mangayı güncellerken bir sorunla karşılaştık."))
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
                    <InputLabel htmlFor="manga-selector">Düzenleyeceğiniz mangayı seçin</InputLabel>
                    <Select
                        fullWidth
                        value={currentMangaData.name}
                        onChange={handleChange}
                        inputProps={{
                            name: "manga",
                            id: "manga-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>)}
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
                            label="MyAnimeList Linki"
                            value={currentMangaData.mal_link}
                            onChange={handleInputChange("mal_link")}
                            margin="normal"
                            variant="filled"
                            helperText="https://myanimelist.net/manga/99529/Love_Live_Sunshine ya da https://myanimelist.net/manga/99529 (Yoksa -)"
                            required
                            error={currentMangaData.mal_link ? checkMyAnimeListMangaLink(currentMangaData.mal_link) : false}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="cover_art"
                                    label="Manga poster resmi"
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
                                    label="Manga logo resmi"
                                    value={currentMangaData.logo || undefined}
                                    onChange={handleInputChange("logo")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="- koyarak diskteki resmi silebilirsiniz."
                                />
                                {currentMangaData.logo ?
                                    <img src={currentMangaData.logo} alt={"logo"} />
                                    : ""}
                            </Grid>
                            <Grid item xs={12} className={classes.ImageContainer}>
                                <TextField
                                    fullWidth
                                    id="header"
                                    label="Manga header resmi"
                                    value={currentMangaData.header || undefined}
                                    onChange={handleInputChange("header")}
                                    margin="normal"
                                    variant="filled"
                                    helperText="- koyarak diskteki resmi silebilirsiniz."
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
                                    label="Manga ismi"
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
                                    label="Manga konusu"
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
                                    label="Çevirmenler"
                                    value={currentMangaData.translators}
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
                                    value={currentMangaData.editors}
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
                                    value={currentMangaData.authors}
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
                                    value={currentMangaData.genres}
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
                                    value={currentMangaData.mos_link}
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
                                    value={currentMangaData.download_link}
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
                </>}
        </>
    )
}