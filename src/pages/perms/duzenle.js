import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import styled from 'styled-components'
import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, InputLabel, Select, MenuItem, Modal } from '@material-ui/core'
import { defaultPermissionUpdateData } from '../../components/pages/default-props';
import { getFullPermissionList, updatePermission } from '../../config/api-routes';
import { handleGeneralSlugify } from '../../components/pages/functions'

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

export default function PermissionUpdate(props) {
    const { theme } = props

    const token = useGlobal("user")[0].token

    const [open, setOpen] = useState(false)

    const [permData, setPermissionData] = useState([])
    const [currentPermissionData, setCurrentPermissionData] = useState({ ...defaultPermissionUpdateData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullPermissionList, { headers }).catch(res => res)
            if (res.status === 200) {
                setPermissionData(res.data)
                return setLoading(false)
            }

            setLoading(false)
        }

        fetchData()
    }, [token])

    function handleChange(event) {
        const newData = Find(permData, { name: event.target.value })
        newData.permission_set = JSON.parse(newData.permission_set)

        setCurrentPermissionData({ ...newData });
        setOpen(true)
    }

    const handleInputChange = name => event => {
        if (name === "special_type") {
            if (event.target.value === currentPermissionData.special_type) return setCurrentPermissionData(oldData => ({ ...oldData, special_type: "" }))
        }

        setCurrentPermissionData({ ...currentPermissionData, [name]: event.target.value })
    }

    async function handleDataSubmit(th) {
        th.preventDefault()
        if (currentPermissionData.slug === "") return

        let clickedPermissionDataIndex = null

        for (var i = 0; i < permData.length; i++) {
            if (permData[i].id === currentPermissionData.id) {
                clickedPermissionDataIndex = i
                break;
            }
        }

        const data = {
            ...currentPermissionData,
        }

        const headers = {
            "Authorization": token
        }

        const res = await axios.post(updatePermission, data, { headers }).catch(res => res)

        if (res.status === 200) {
            const newPermissionDataSet = permData
            newPermissionDataSet[clickedPermissionDataIndex] = currentPermissionData
            setPermissionData([...newPermissionDataSet])
            setCurrentPermissionData({ ...defaultPermissionUpdateData })
            handleClose()
            ToastNotification(payload("process-success", "success", res.data.message || "Yetki bilgileri başarıyla değiştirildi."))
        }

        else {
            ToastNotification(payload("process-error", "error", res.response.data.err || "Yetki bilgileri değiştirilirken bir sorunla karşılaştık."))
        }
    }

    function handleClose() {
        setCurrentPermissionData({ ...defaultPermissionUpdateData })
        setOpen(false)
    }

    return (
        <>
            {!loading && permData.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Düzenleyeceğiniz kullanıcıyı seçin</InputLabel>
                    <Select
                        fullWidth
                        value={`${currentPermissionData.name}`}
                        onChange={handleChange}
                        inputProps={{
                            name: "user",
                            id: "user-selector"
                        }}
                    >
                        {permData.map(d => <MenuItem key={d.id} value={`${d.name}`}>{d.name}</MenuItem>)}
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
                                        label="Yetki ismi"
                                        value={currentPermissionData.name}
                                        onChange={handleInputChange("name")}
                                        margin="normal"
                                        variant="filled"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        id="slug"
                                        label="Yetki slug"
                                        value={handleGeneralSlugify(currentPermissionData.name)}
                                        onChange={handleInputChange("slug")}
                                        margin="normal"
                                        variant="filled"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth
                                        id="color"
                                        label="Yetki rengi"
                                        value={currentPermissionData.color}
                                        onChange={handleInputChange("color")}
                                        margin="normal"
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth
                                        id="permission_set"
                                        label="Yetki listesi"
                                        value={currentPermissionData.permission_set}
                                        onChange={handleInputChange("permission_set")}
                                        margin="normal"
                                        variant="filled"
                                        multiline
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