import React, { useState } from 'react'

import { Box, Button, Typography, TextField, makeStyles } from '@material-ui/core';
import { useTheme } from '@material-ui/styles'
import { useDispatch } from 'reactn'

import axios from '../../config/axios/axios'
import { loginRoute } from '../../config/api-routes';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))

const UserModel = {
    username: "",
    password: ""
}

const errContainerModel = {
    err: "",
    username: "",
    password: ""
}

export default function LoginModal() {
    const { t } = useTranslation('components')
    const classes = useStyles()

    const setUser = useDispatch('loginHandler')
    const [userInfo, setUserInfo] = useState(UserModel)
    const [errContainer, setErrContainer] = useState(errContainerModel)

    const handleChange = type => event => {
        setUserInfo({ ...userInfo, [type]: event.target.value })
        setErrContainer(errContainerModel)
    }

    const handleSubmitForm = (event) => {
        event.preventDefault()

        const userData = {
            name: userInfo.username,
            password: userInfo.password
        }

        axios.post(loginRoute, userData)
            .then(res => {
                setUser(res.data)
                setUserInfo(UserModel)
                setErrContainer(errContainerModel)
            })
            .catch(err => {
                const errors = err.response.data.username ? err.response.data : { username: t('login.errors.error') }
                setErrContainer({ ...errContainer, ...errors })
            })
    }

    return (
        <>
            <div className={classes.ModalContainer}>
                <Box
                    p={2}
                    bgcolor="background.level1"
                    boxShadow={2}>
                    <Typography variant="h4">{t('login.site_title', { site_name: process.env.REACT_APP_SITENAME })}</Typography>
                    <form autoComplete="off" onSubmit={event => handleSubmitForm(event)}>
                        <TextField
                            id="username"
                            error={errContainer.username ? true : false}
                            helperText={errContainer.username ? errContainer.username : ""}
                            label={t('login.username')}
                            value={userInfo.username}
                            onChange={handleChange('username')}
                            margin="normal"
                            variant="outlined"
                            required
                            autoFocus
                            fullWidth />
                        <TextField
                            id="password"
                            label="Şifre"
                            value={t('login.password')}
                            helperText={errContainer.password ? errContainer.password : ""}
                            onChange={handleChange('password')}
                            margin="normal"
                            variant="outlined"
                            type="password"
                            required
                            autoFocus
                            fullWidth />
                        <Box mt={2}>
                            <Button variant="outlined" type="submit">{t('login.login_button')}</Button>
                        </Box>
                    </form>
                </Box>
            </div>
        </>
    )
}