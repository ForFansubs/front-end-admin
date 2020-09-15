import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { defaultPermissionData } from '../../components/pages/default-props';
import { getFullPermissionList, deletePermission } from '../../config/api-routes';

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

export default function PermissionDelete(props) {
    const { theme } = props
    const token = useGlobal("user")[0].token
    const [permissionData, setPermissionData] = useState([])

    const [open, setOpen] = useState(false)

    const [currentPermissionData, setCurrentPermissionData] = useState({ ...defaultPermissionData })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullPermissionList, { headers }).catch(res => res)
            if (res.status === 200) {
                setPermissionData(res.data)
                setLoading(false)
            }
            else {
                setLoading(false)
            }
        }

        fetchData()
    }, [token])

    function handleChange(event) {
        const newData = Find(permissionData, { id: event.target.value })

        setCurrentPermissionData({ ...newData })
        setOpen(true)
    }

    function handleDeleteButton() {
        const headers = {
            "Authorization": token
        }

        const permissionPostData = {
            permission_id: currentPermissionData.id
        }


        axios.post(deletePermission, permissionPostData, { headers })
            .then(_ => {
                const newData = permissionData
                PullAt(newData, FindIndex(newData, { id: currentPermissionData.id }))
                handleClose()
                setCurrentPermissionData({ ...defaultPermissionData })
                setPermissionData(newData)
                ToastNotification(payload("success", "Rol başarıyla silindi."))
            })
            .catch(_ => ToastNotification(payload("error", "Rolü silerken bir sorunla karşılaştık.")))
    }

    function handleClose() {
        setCurrentPermissionData({ ...defaultPermissionData })
        setOpen(false)
    }

    if (loading) {
        return (
            <CircularProgress />
        )
    }
    return (
        <>
            {!loading && permissionData.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Sileceğiniz rolü seçin</InputLabel>
                    <Select
                        fullWidth
                        value={currentPermissionData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "anime",
                            id: "anime-selector"
                        }}
                    >
                        {permissionData.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
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
                        <Typography variant="h4"><em>{currentPermissionData.name}</em> kullanıcısını silmek üzeresiniz.</Typography>
                        <Typography variant="body1">Bu yıkıcı bir komuttur. Yetkinın açtığı tüm konularda "Silinmiş Üye" yazacaktır.</Typography>
                        <Button
                            style={{ marginRight: "5px" }}
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteButton(currentPermissionData.slug)}>
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