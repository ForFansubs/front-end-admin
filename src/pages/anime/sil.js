import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography, makeStyles } from '@material-ui/core'
import { defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, deleteAnime } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))

export default function AnimeDelete(props) {
    const { t } = useTranslation("pages")
    const classes = useStyles()
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])

    const [open, setOpen] = useState(false)

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
        setCurrentAnimeData({ ...newData })
        setOpen(true)
    }

    function handleDeleteButton(slug) {
        const animeData = {
            id: currentAnimeData.id
        }

        const headers = {
            "Authorization": token
        }

        axios.post(deleteAnime, animeData, { headers })
            .then(_ => {
                const newData = data
                PullAt(newData, FindIndex(newData, { "slug": slug }))
                handleClose()
                setCurrentAnimeData({ ...defaultAnimeData })
                setData(newData)
                ToastNotification(payload("success", t('anime.delete.warnings.success')))
            })
            .catch(_ => ToastNotification(payload("error", t('anime.delete.errors.error'))))
    }

    function handleClose() {
        setOpen(false)
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
                    <InputLabel htmlFor="anime-selector">{t('anime.delete.selector')}</InputLabel>
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
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
                className={classes.ModalContainer}
            >
                <Box p={2} bgcolor="background.level2">
                    <Typography variant="h4">{t('anime.delete.warnings.title', { title: currentAnimeData.name })}</Typography>
                    <Typography variant="body1" gutterBottom>{t('anime.delete.warnings.subtitle')}</Typography>
                    <Button
                        style={{ marginRight: 8 }}
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteButton(currentAnimeData.slug)}>
                        {t('anime.index.delete')}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClose}>
                        {t('common.buttons.close')}
                    </Button>
                </Box>
            </Modal>
        </>
    )
}