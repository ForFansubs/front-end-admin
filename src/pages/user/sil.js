import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { defaultUserData } from '../../components/pages/default-props';
import { getFullUserList, deleteUser } from '../../config/api-routes';

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

export default function UserDelete(props) {
    const { theme } = props
    const token = useGlobal("user")[0].token
    const [data, setData] = useState([])

    const [open, setOpen] = useState(false)

    const [currentUserData, setCurrentUserData] = useState({ ...defaultUserData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullUserList, { headers }).catch(res => res)
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

        setCurrentUserData({ ...newData })
        setOpen(true)
    }

    function handleDeleteButton(slug) {
        const headers = {
            "Authorization": token
        }

        const userData = {
            user_id: currentUserData.id
        }


        axios.post(deleteUser, userData, { headers })
            .then(_ => {
                const newData = data
                PullAt(newData, FindIndex(newData, { id: currentUserData.id }))
                handleClose()
                setCurrentUserData({ ...defaultUserData })
                setData(newData)
                ToastNotification(payload("success", "Kullanıcı başarıyla silindi."))
            })
            .catch(_ => ToastNotification(payload("error", "Kullanıcıyı silerken bir sorunla karşılaştık.")))
    }

    function handleClose() {
        setCurrentUserData({ ...defaultUserData })
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
                    <InputLabel htmlFor="anime-selector">Sileceğiniz kullanıcıyı seçin</InputLabel>
                    <Select
                        fullWidth
                        value={currentUserData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
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
            >
                <ModalContainer theme={theme}>
                    <Box p={2} bgcolor="background.level2">
                        <Typography variant="h4"><em>{currentUserData.name}</em> kullanıcısını silmek üzeresiniz.</Typography>
                        <Typography variant="body1">Bu yıkıcı bir komuttur. Kullanıcının açtığı tüm konularda "Silinmiş Üye" yazacaktır.</Typography>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteButton(currentUserData.slug)}>
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