import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { getFullMangaList, featuredManga, getFullFeaturedMangaList } from '../../config/api-routes';
import { handleMangaFeaturedSelectData } from '../../components/pages/functions';
import { useTranslation } from 'react-i18next'

export default function MangaFeatured() {
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])
    const [featuredMangas, setFeaturedMangas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
            const featured = await axios.get(getFullFeaturedMangaList, { headers }).catch(res => res)
            if (res.status === 200 && featured.status === 200) {
                setData(res.data)
                setFeaturedMangas(featured.data.map(({ name }) => name))
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    function handleChange(event) {
        const newData = []
        newData.push(...event.target.value)
        setFeaturedMangas(newData)
    }

    function handleFeaturedMangasUpdateButton() {
        const headers = {
            "Authorization": token
        }

        axios.post(featuredManga, { data: featuredMangas }, { headers })
            .then(_ => {

                ToastNotification(payload("success", t('manga.featured.warnings.success')))
            })
            .catch(_ => ToastNotification(payload("error", t('manga.featured.errors.error'))))
    }

    if (loading) {
        return (
            <CircularProgress />
        )
    }

    return (
        <>
            {!loading && data.length ?
                <>
                    <FormControl fullWidth margin="normal">
                        <InputLabel htmlFor="Manga-selector">{t('manga.featured.selector')}</InputLabel>
                        <Select
                            fullWidth
                            multiple
                            value={featuredMangas}
                            onChange={handleChange}
                            inputProps={{
                                name: "Manga",
                                id: "manga-selector"
                            }}
                        >
                            {data.map(d => <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="outlined" color="primary" onClick={handleFeaturedMangasUpdateButton}>{t('common.buttons.save')}</Button>
                </>
                : ""}
        </>
    )
}