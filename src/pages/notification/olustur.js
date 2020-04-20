import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField } from '@material-ui/core'
import { defaultPermissionData } from '../../components/pages/default-props';
import { addPermission } from '../../config/api-routes';

export default function () {
    const token = useGlobal("user")[0].token
    const [permissionData, setPermissionData] = useState({ ...defaultPermissionData })

    const handleInputChange = name => event => {
        event.persist()

        setPermissionData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const data = permissionData
        const headers = {
            "Authorization": token
        }

        axios.post(addPermission, data, { headers })
            .then(_ => {
                ToastNotification(payload("process-success", "success", "Yetki başarıyla eklendi."))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("process-error", "error", err.response.data.err || "Yetkiyi eklerken bir sorunla karşılaştık."))
            })
    }

    function clearData() {
        setPermissionData({ ...defaultPermissionData })
    }

    return (
        <>
            <>
                <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="name"
                                label="Yetki adı"
                                value={permissionData.name}
                                onChange={handleInputChange("name")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="color"
                                label="Yetki renk kodu"
                                value={permissionData.email}
                                type="text"
                                onChange={handleInputChange("color")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="permission_set"
                                label="Yetki listesi"
                                value={permissionData.permission_set}
                                onChange={handleInputChange("permission_set")}
                                type="text"
                                margin="normal"
                                variant="filled"
                                required
                                multiline
                                helperText={"see-admin-page,see-logs,add-anime,update-anime,delete-anime,add-manga,update-manga,delete-manga,add-permission,update-permission,delete-permission,add-user,update-user,delete-user,add-episode,update-episode,delete-episode,add-watch-link,delete-watch-link,featured-anime,add-download-link,delete-download-link,see-administrative-stuff,take-backup"}
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
            </>
        </>
    )
}