import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'
import FindIndex from 'lodash-es/findIndex'
import PullAt from 'lodash-es/pullAt'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Box, Modal, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography, makeStyles } from '@material-ui/core'
import { defaultUserData } from '../../components/pages/default-props';
import { getFullUserList, deleteUser } from '../../config/api-routes';
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
    ModalContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))


export default function UserDelete() {
    const { t } = useTranslation('pages')
    const classes = useStyles()
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
                ToastNotification(payload("success", t('user.delete.warnings.warning')))
            })
            .catch(_ => ToastNotification(payload("error", t('user.delete.errors.error'))))
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
                    <InputLabel htmlFor="anime-selector">{t('user.delete.user_selector')}</InputLabel>
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
                className={classes.ModalContainer}
            >
                <Box p={2} bgcolor="background.level2">
                    <Typography variant="h4">{t('user.delete.user_title', { user_title: currentUserData.name })}</Typography>
                    <Typography variant="body1"></Typography>
                    <Button
                        style={{ marginRight: "5px" }}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteButton(currentUserData.slug)}>
                        {t('common.index.delete')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}>
                        {t('common.buttons.close')}
                    </Button>
                </Box>
            </Modal>
        </>
    )
}