import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography, makeStyles, FormControlLabel, Switch, Divider, FormGroup } from '@material-ui/core'
import { defaultPermissionUpdateData } from '../../components/pages/default-props';
import { getFullPermissionList, updatePermission } from '../../config/api-routes';
import { handleGeneralSlugify } from '../../components/pages/functions'

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

export default function PermissionUpdate(props) {
    const classes = useStyles()
    const token = useGlobal("user")[0].token
    const [permData, setPermissionData] = useState([])
    const [currentPermissionData, setCurrentPermissionData] = useState({ ...defaultPermissionUpdateData })
    const [loading, setLoading] = useState(true)

    console.log(currentPermissionData)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            const res = await axios.get(getFullPermissionList, { headers }).catch(res => res)
            if (res.status === 200) {
                res.data.map((r, i) => {
                    let { permission_set } = r
                    let list = {}
                    JSON.parse(permission_set).map(n => {
                        list[n] = true
                    })
                    res.data[i].permission_set = { ...defaultPermissionUpdateData.permission_set, ...list }
                    return null
                })
                setPermissionData(res.data)
                return setLoading(false)
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    function handleChange(event) {
        let newData = Find(permData, { name: event.target.value })
        setCurrentPermissionData({ ...newData });
    }

    const handleSwitchChange = (event) => {
        setCurrentPermissionData((state) => ({
            ...state, permission_set: {
                ...state.permission_set,
                [event.target.name]: event.target.checked
            }
        }));
    };

    const handleInputChange = name => event => {
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

        const permission_set = currentPermissionData.permission_set

        const data = {
            ...currentPermissionData,
            permission_set: Object.keys(permission_set).filter(k => permission_set[k])
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
    }

    return (
        <>
            {!loading && permData.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="anime-selector">Düzenleyeceğiniz rolü seçin</InputLabel>
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
            {currentPermissionData.id ?
                <Box>
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
                                                            checked={currentPermissionData.permission_set[main]}
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
                                                <FormGroup>
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
                                                                        disabled={main ? !currentPermissionData.permission_set[main] : false}
                                                                        control={
                                                                            <Switch
                                                                                checked={currentPermissionData.permission_set[permvalue]}
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
                                                </FormGroup>
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
                                                                            checked={currentPermissionData.permission_set[main]}
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
                                                                                    disabled={main ? !currentPermissionData.permission_set[main] : false}
                                                                                    control={
                                                                                        <Switch
                                                                                            checked={currentPermissionData.permission_set[permvalue]}
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
                            color="primary"
                            type="submit">
                            Kaydet
                        </Button>
                    </form>
                </Box>
                :
                ""}
        </>
    )
}