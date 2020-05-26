import React, { useState } from 'react'
import { useGlobal } from 'reactn'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControlLabel, Switch, Typography, makeStyles, Divider } from '@material-ui/core'
import { defaultPermissionData } from '../../components/pages/default-props';
import { addPermission } from '../../config/api-routes';

import PermissionList from '../../config/permission-list'
import PermissionListHelperText from '../../config/permission-list-helper-text'

const useStyles = makeStyles(theme => ({
    HeaderText: {
        color: theme.palette.grey[500],
        fontWeight: "bold"
    },
    HelperText: {
        color: theme.palette.grey[500]
    }
}))

export default function () {
    const classes = useStyles()
    const token = useGlobal("user")[0].token
    const [permissionData, setPermissionData] = useState({ ...defaultPermissionData })
    console.log(permissionData)
    const handleInputChange = name => event => {
        event.persist()

        setPermissionData(oldData => ({ ...oldData, [name]: event.target.value }))
    }

    const handleSwitchChange = (event) => {
        console.log(event.target.name)
        console.log(event.target.checked)
        setPermissionData((state) => ({
            ...state, permission_set: {
                ...state.permission_set,
                [event.target.name]: event.target.checked
            }
        }));
    };

    function handleDataSubmit(th) {
        th.preventDefault()
        const headers = {
            "Authorization": token
        }

        const permission_set = permissionData.permission_set

        const data = {
            ...permissionData,
            permission_set: Object.keys(permission_set).filter(k => permission_set[k])
        }

        axios.post(addPermission, data, { headers })
            .then(_ => {
                ToastNotification(payload("success", "Rol başarıyla eklendi."))
                clearData()
            })
            .catch(err => {
                ToastNotification(payload("error", err.response.data.err || "Rolü eklerken bir sorunla karşılaştık."))
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
                                label="Rol adı"
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
                                label="Rol renk kodu"
                                value={permissionData.email}
                                type="text"
                                onChange={handleInputChange("color")}
                                margin="normal"
                                variant="filled"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {PermissionList.map(p => {
                                const title = p.title || null
                                const main = p.main || null
                                const perms = p.perms || null
                                const subperms = p.subperms || null
                                return (
                                    <Box key={title} mb={4}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography className={classes.HeaderText} variant="subtitle1" component="h2">{title}</Typography>
                                            {main ? <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={permissionData.permission_set[main]}
                                                        onChange={handleSwitchChange}
                                                        name={main}
                                                        color="primary"
                                                    />
                                                }
                                                label=""
                                            />
                                                :
                                                ""}
                                        </Box>
                                        <Box>
                                            {Object.keys(perms).map(p => {
                                                const permtext = p
                                                const permvalue = perms[p]
                                                return (
                                                    <div key={permtext}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                                                            <div>
                                                                <Typography variant="subtitle1">{permtext}</Typography>
                                                                {PermissionListHelperText[permvalue] ?
                                                                    <Typography variant="subtitle2" className={classes.HelperText}>
                                                                        {PermissionListHelperText[permvalue]}
                                                                    </Typography> :
                                                                    ""}
                                                            </div>
                                                            <FormControlLabel
                                                                disabled={main ? !permissionData.permission_set[main] : false}
                                                                control={
                                                                    <Switch
                                                                        checked={permissionData.permission_set[permvalue]}
                                                                        onChange={handleSwitchChange}
                                                                        name={permvalue}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label=""
                                                            />
                                                        </Box>
                                                        <Divider />
                                                    </div>
                                                )
                                            })}
                                        </Box>
                                        {/*Subperms kısmı*/}
                                        <Box pl={2} mt={3}>
                                            {subperms ? subperms.map(s => {
                                                const title = s.title || null
                                                const main = s.main || null
                                                const perms = s.perms || null
                                                return (
                                                    <Box key={title} mb={4}>
                                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                                            <Typography className={classes.HeaderText} variant="subtitle1" component="h2">{title}</Typography>
                                                            {main ? <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={permissionData.permission_set[main]}
                                                                        onChange={handleSwitchChange}
                                                                        name={main}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label=""
                                                            />
                                                                :
                                                                ""}
                                                        </Box>
                                                        <Box>
                                                            {Object.keys(perms).map(p => {
                                                                const permtext = p
                                                                const permvalue = perms[p]
                                                                return (
                                                                    <div key={permtext}>
                                                                        <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                                                                            <div>
                                                                                <Typography variant="subtitle1">{permtext}</Typography>
                                                                                {PermissionListHelperText[permvalue] ?
                                                                                    <Typography variant="subtitle2" className={classes.HelperText}>
                                                                                        {PermissionListHelperText[permvalue]}
                                                                                    </Typography> :
                                                                                    ""}
                                                                            </div>
                                                                            <FormControlLabel
                                                                                disabled={main ? !permissionData.permission_set[main] : false}
                                                                                control={
                                                                                    <Switch
                                                                                        checked={permissionData.permission_set[permvalue]}
                                                                                        onChange={handleSwitchChange}
                                                                                        name={permvalue}
                                                                                        color="primary"
                                                                                    />
                                                                                }
                                                                                label=""
                                                                            />
                                                                        </Box>
                                                                        <Divider />
                                                                    </div>
                                                                )
                                                            })}
                                                        </Box>
                                                    </Box>
                                                )
                                            })
                                                :
                                                ""}
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Grid>
                    </Grid>
                    <Button
                        variant="outlined"
                        type="submit">
                        Kaydet
                    </Button>
                </form>
            </>
        </>
    )
}