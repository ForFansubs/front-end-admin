import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'
import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'
import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { defaultAnimeData } from '../../components/pages/default-props';
import { getFullAnimeList, deleteAnime } from '../../config/api-routes';
import { handleSelectData } from '../../components/pages/functions';

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

export default function AnimeDelete(props) {
    const { theme } = props
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
        const animeData = handleSelectData(event.target.value)
        const newData = Find(data, { name: animeData.name, version: animeData.version })
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
                ToastNotification(payload("success", "Anime başarıyla silindi."))
            })
            .catch(_ => ToastNotification(payload("error", "Animeyi silerken bir sorunla karşılaştık.")))
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
                    <InputLabel htmlFor="anime-selector">Sileceğiniz animeyi seçin</InputLabel>
                    <Select
                        fullWidth
                        value={currentAnimeData.name}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {data.map(d => <MenuItem key={d.id} value={`${d.name} [${d.version}]`}>{d.name} [{d.version}]</MenuItem>)}
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
                        <Typography variant="h4"><em>{currentAnimeData.name}</em> animesini silmek üzeresiniz.</Typography>
                        <Typography variant="body1">Bu yıkıcı bir komuttur. Bu animeyle ilişkili bütün <b>bölümler</b>, <b>indirme</b> ve <b>izleme</b> linkleri silinecektir.</Typography>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteButton(currentAnimeData.slug)}>
                            Sil
                            </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClose}>
                            Kapat
                        </Button>
                    </Box>
                </ModalContainer>
            </Modal>
        </>
    )
}