import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import FindIndex from 'lodash-es/findIndex'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, Box, Typography } from '@material-ui/core'
import { getFullMotdList, deleteMotd } from '../../config/api-routes';
import Markdown from '../../components/markdown/markdown'

export default function EpisodeDelete() {
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

    async function handleDeleteButton(motd_id) {
        const clickedDataIdx = FindIndex(data, { id: motd_id })

        const headers = {
            "Authorization": token
        }

        const request_body = {
            motd_id: motd_id,
        }

        const res = await axios.post(deleteMotd, request_body, { headers }).catch(res => res)

        if (res.status === 200) {
            const newData = data
            newData.splice(clickedDataIdx, 1)

            setData([...newData])
            ToastNotification(payload("success", res.data.message || "MOTD başarıyla silindi."))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || "MOTD silinirken bir sorunla karşılaştık."))
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
                                        <Typography variant="h4" gutterBottom>
                                            {e.title ? e.title : ""}
                                        </Typography>
                                        <Markdown>
                                            {e.subtitle ? e.subtitle : "**Bir sorun var? (Bu bir sistem mesajıdır.)**"}
                                        </Markdown>
                                    </div>
                                    <div>
                                        <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteButton(e.id)}>
                                            Sil
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