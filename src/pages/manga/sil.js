import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { defaultMangaData } from '../../components/pages/default-props';
import { getFullMangaList, deleteManga } from '../../config/api-routes';

const ModalContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.theme.breakpoints.values.sm}px;

    @media(max-width:${props => props.theme.breakpoints.values.sm}px) {
        width: 100%;
    }
`
export default function MangaDelete(props) {
    const { theme } = props
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
        const newData = Find(data, { name: event.target.value })
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
                ToastNotification(payload("process-success", "success", "Manga başarıyla silindi."))
            })
            .catch(_ => ToastNotification(payload("process-error", "error", "Mangayı silerken bir sorunla karşılaştık.")))
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
                    <InputLabel htmlFor="manga-selector">Sileceğiniz mangayı seçin</InputLabel>
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
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <ModalContainer theme={theme}>
                    <Box p={2} bgcolor="background.level2">
                        <Typography variant="h4"><em>{currentMangaData.name}</em> mangasını silmek üzeresiniz.</Typography>
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteButton(currentMangaData.slug)}>Sil</Button>
                        <Button variant="contained" color="primary" onClick={handleClose}>Kapat</Button>
                    </Box>
                </ModalContainer>
            </Modal>
        </>
    )
}