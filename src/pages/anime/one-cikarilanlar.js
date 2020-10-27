import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { getFullAnimeList, featuredAnime, getFullFeaturedAnimeList } from '../../config/api-routes';
import { handleFeaturedSelectData } from '../../components/pages/functions';
import { useTranslation } from 'react-i18next'

export default function AnimeFeatured() {
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])
    const [featuredAnimes, setFeaturedAnimes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
            const featured = await axios.get(getFullFeaturedAnimeList, { headers }).catch(res => res)
            if (res.status === 200 && featured.status === 200) {
                setData(res.data)
                setFeaturedAnimes(featured.data.map(({ name, version }) => `${name} [${version}]`))
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
        console.log(newData)
        setFeaturedAnimes(newData)
    }

    function handleFeaturedAnimesUpdateButton() {
        const animeData = handleFeaturedSelectData(featuredAnimes)

        const headers = {
            "Authorization": token
        }

        axios.post(featuredAnime, { data: animeData }, { headers })
            .then(_ => {

                ToastNotification(payload("success", t('anime.featured.warnings.success')))
            })
            .catch(_ => ToastNotification(payload("error", t('anime.featured.errors.error'))))
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
                        <InputLabel htmlFor="anime-selector">{t('anime.featured.selector')}</InputLabel>
                        <Select
                            fullWidth
                            multiple
                            value={featuredAnimes}
                            onChange={handleChange}
                            inputProps={{
                                name: "anime",
                                id: "anime-selector"
                            }}
                            renderValue={selected => selected.join(', ')}
                        >
                            {data.map(d => <MenuItem key={d.id} value={`${d.name} [${d.version}]`}>{d.name} [{d.version}]</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="outlined" color="primary" onClick={handleFeaturedAnimesUpdateButton}>{t('common.buttons.save')}</Button>
                </>
                : ""}
        </>
    )
}