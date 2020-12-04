import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import FindIndex from 'lodash-es/findIndex'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, Typography } from '@material-ui/core'
import { getFullMotdList, updateMotd } from '../../config/api-routes';
import Markdown from '../../components/markdown/markdown'

import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { useTranslation } from 'react-i18next'

export default function MotdUpdate() {
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullMotdList, { headers }).catch(res => res)
            if (res.status === 200) {
                setData(res.data)
                return setLoading(false)
            }

            setLoading(false)
        }

        fetchData()
    }, [token])

    async function handleVisibilityButtonClick(motd_id) {
        const clickedDataIdx = FindIndex(data, { id: motd_id })

        const headers = {
            "Authorization": token
        }

        const request_body = {
            motd_id: motd_id,
            is_active: Number(!data[clickedDataIdx].is_active)
        }

        const res = await axios.post(updateMotd, request_body, { headers }).catch(res => res)

        if (res.status === 200) {
            const newData = data
            newData[clickedDataIdx].is_active = Number(!data[clickedDataIdx].is_active)

            setData([...newData])
            ToastNotification(payload("success", res.data.message || t('motd.update.warnings.is_active_success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('motd.update.errors.is_active_error')))
        }
    }

    return (
        <>
            {!loading && data.length ?
                <>
                    <Grid container spacing={2}>
                        {data.map(e =>
                            <Grid item xs={12} key={e.id}>
                                <Box p={1} boxShadow={2} bgcolor="background.level1" display="flex" alignItems="center" justifyContent="space-between">
                                    <div>
                                        <Typography variant="body1" gutterBottom>
                                            {!e.content_id ? "Ana sayfa - " : ""}{t('motd.update.content_info', { content_id: e.content_id || "-", content_type: e.content_type || "-" })}
                                        </Typography>
                                        <Typography variant="h4" gutterBottom>
                                            {e.title ? e.title : ""}
                                        </Typography>
                                        <Markdown>
                                            {e.subtitle ? e.subtitle : "---"}
                                        </Markdown>
                                    </div>
                                    <div>
                                        <Button size="small" onClick={() => handleVisibilityButtonClick(e.id)}>
                                            {
                                                e.is_active === 1
                                                    ?
                                                    <VisibilityIcon />
                                                    :
                                                    <VisibilityOffIcon />
                                            }
                                        </Button>
                                    </div>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </>
                : ""}
        </>
    )
}