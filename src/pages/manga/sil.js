import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography, makeStyles } from '@material-ui/core'
import { defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, deleteManga } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))

export default function MangaDelete(props) {
    const { t } = useTranslation('pages')
    const classes = useStyles()
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
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
        setCurrentMangaData({ ...newData })
        setOpen(true)
    }

    function handleDeleteButton(slug) {
        const mangaData = {
            id: currentMangaData.id
        }

        const headers = {
            "Authorization": token
        }

        axios.post(deleteManga, mangaData, { headers })
            .then(_ => {
                const newData = data
                PullAt(newData, FindIndex(newData, { "slug": slug }))
                handleClose()
                setCurrentMangaData({ ...defaultMangaData })
                setData(newData)
                ToastNotification(payload("success", t('manga.delete.warnings.success')))
            })
            .catch(_ => ToastNotification(payload("error", t('manga.delete.errors.error'))))
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
                    <InputLabel htmlFor="manga-selector">{t('manga.delete.selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentMangaData || ""}
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
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
                className={classes.ModalContainer}
            >
                <Box p={2} bgcolor="background.level2">
                    <Typography variant="h4">{t('manga.delete.warnings.title', { title: currentMangaData.name })}</Typography>
                    <Typography variant="body1" gutterBottom>{t('manga.delete.warnings.subtitle')}</Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteButton(currentMangaData.slug)} style={{ marginRight: 8 }}>
                        {t('common.index.delete')}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        {t('common.buttons.close')}
                    </Button>
                </Box>
            </Modal>
        </>
    )
}