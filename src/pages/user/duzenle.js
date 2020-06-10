import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, InputLabel, Select, MenuItem, Modal } from '@material-ui/core'
import { defaultUserUpdateData } from '../../components/pages/default-props';
import { getFullUserList, updateUser } from '../../config/api-routes';

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

export default function UserUpdate(props) {
    const { theme } = props

    const token = useGlobal("user")[0].token

    const [open, setOpen] = useState(false)

    const [userData, setUserData] = useState([])
    const [currentUserData, setCurrentUserData] = useState({ ...defaultUserUpdateData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullUserList, { headers }).catch(res => res)
            if (res.status === 200) {
                setUserData(res.data)
                return setLoading(false)
            }

            setLoading(false)
        }

        fetchData()
    }, [token])

    function handleChange(event) {
        const newData = Find(userData, { name: event.target.value })

        setCurrentUserData({ ...newData });
        setOpen(true)
    }

    const handleInputChange = name => event => {
        setCurrentUserData({ ...currentUserData, [name]: event.target.value })
    }

    async function handleDataSubmit(th) {
        th.preventDefault()
        if (currentUserData.slug === "") return

        let clickedUserDataIndex = null

        for (var i = 0; i < userData.length; i++) {
            if (userData[i].id === currentUserData.id) {
                clickedUserDataIndex = i
                break;
            }
        }

        const data = {
            ...currentUserData
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(updateUser, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newUserDataSet = userData
            newUserDataSet[clickedUserDataIndex] = currentUserData
            setUserData([...newUserDataSet])
            setCurrentUserData({ ...defaultUserUpdateData })
            handleClose()
            ToastNotification(payload("success", res.data.message || "Kullanıcı bilgileri başarıyla değiştirildi."))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "Kullanıcı bilgileri değiştirilirken bir sorunla karşılaştık."))
        }
    }

    function handleClose() {
        setCurrentUserData({ ...defaultUserUpdateData })
        setOpen(false)
    }

    return (
        <>
            {!loading && userData.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Düzenleyeceğiniz kullanıcıyı seçin</InputLabel>
                    <Select
                        fullWidth
                        value={`${currentUserData.name}`}
                        onChange={handleChange}
                        inputProps={{
                            name: "user",
                            id: "user-selector"
                        }}
                    >
                        {userData.map(d => <MenuItem key={d.id} value={`${d.name}`}>{d.name}</MenuItem>)}
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
                        <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        label="Kullanıcı ismi"
                                        value={currentUserData.name}
                                        onChange={handleInputChange("name")}
                                        margin="normal"
                                        variant="filled"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        label="Kullanıcı şifresi"
                                        value={currentUserData.password}
                                        onChange={handleInputChange("password")}
                                        margin="normal"
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="permission_level"
                                        label="Kullanıcı yetki grubu"
                                        value={currentUserData.permission_level}
                                        onChange={handleInputChange("permission_level")}
                                        margin="normal"
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="avatar"
                                        label="Kullanıcı avatar linki"
                                        value={currentUserData.avatar}
                                        onChange={handleInputChange("avatar")}
                                        margin="normal"
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        id="permission_level"
                                        label="Kullanıcı email"
                                        value={currentUserData.email}
                                        onChange={handleInputChange("email")}
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
                    </Box>
                </ModalContainer>
            </Modal>
        </>
    )
}