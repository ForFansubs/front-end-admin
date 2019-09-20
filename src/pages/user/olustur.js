import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField } from '@material-ui/core'
import { defaultUserData } from '../../components/pages/default-props';
import { addUser } from '../../config/api-routes';

export default function AnimeCreate() {
    const token = useGlobal("user")[0].token
    const [userData, setUserData] = useState({ ...defaultUserData })

    const handleInputChange = name => event => {
        const data = event.target.value

        setUserData(oldData => ({ ...oldData, [name]: data }))
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const data = userData
        const headers = {
            "Authorization": token
        }

        axios.post(addUser, data, { headers })
            .then(_ => {
                ToastNotification(payload("process-success", "success", "Kullanıcı başarıyla eklendi."))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("process-error", "error", err.response.data.err || "Kullanıcıyı eklerken bir sorunla karşılaştık."))
            })
    }

    function clearData() {
        setUserData({ ...defaultUserData })
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
                                label="Kullanıcı adı"
                                value={userData.name}
                                onChange={handleInputChange("name")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="email"
                                label="Kullanıcı emaili"
                                value={userData.email}
                                type="email"
                                onChange={handleInputChange("email")}
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
                                value={userData.password}
                                onChange={handleInputChange("password")}
                                type="password"
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="password2"
                                label="Kullanıcı şifresi tekrar"
                                value={userData.password2}
                                onChange={handleInputChange("password2")}
                                type="password"
                                margin="normal"
                                variant="filled"
                                required
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