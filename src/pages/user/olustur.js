import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField } from '@material-ui/core'
import { defaultUserData } from '../../components/pages/default-props';
import { addUser } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

export default function AnimeCreate() {
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token
    const [userData, setUserData] = useState({ ...defaultUserData })

    const handleInputChange = name => event => {
        event.persist()

        setUserData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    function handleDataSubmit(th) {
        th.preventDefault()
        const data = userData
        const headers = {
            "Authorization": token
        }

        axios.post(addUser, data, { headers })
            .then(_ => {
                ToastNotification(payload("success", t('user.create.warnings.success')))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("error", err.response.data.err || t('user.create.errors.error')))
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
                                label={t('user.common.inputs.username')}
                                value={userData.username}
                                onChange={handleInputChange("username")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="email"
                                label={t('user.common.inputs.email')}
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
                                label={t('user.common.inputs.password')}
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
                                id="repeat_password"
                                label={t('user.common.inputs.repeat_password')}
                                value={userData.repeat_password}
                                onChange={handleInputChange("repeat_password")}
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
                        {t("common.buttons.save")}
                    </Button>
                </form>
            </>
        </>
    )
}