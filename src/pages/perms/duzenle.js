import React, { useState, useEffect } from 'react'
import { useGlobal } from 'reactn'

import Find from 'lodash-es/find'

import axios from '../../config/axios/axios'
import ToastNotification, { payload } from '../../components/toastify/toast'

import { Button, Grid, TextField, Box, FormControl, InputLabel, Select, MenuItem, Typography, makeStyles, FormControlLabel, Switch, Divider, FormGroup } from '@material-ui/core'
import { defaultPermissionUpdateData } from '../../components/pages/default-props';
import { getFullPermissionList, updatePermission } from '../../config/api-routes';

import PermissionList from '../../config/permission-list'
import PermissionListHelperText from '../../config/permission-list-helper-text'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation('pages')
    const classes = useStyles()
    const token = useGlobal("user")[0].token
    const [permData, setPermissionData] = useState([])
    const [currentPermissionData, setCurrentPermissionData] = useState({ ...defaultPermissionUpdateData })
    const [loading, setLoading] = useState(true)

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
                    permission_set.map(n => {
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
        let newData = Find(permData, { id: event.target.value })
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
            ToastNotification(payload("success", res.data.message || t('perms.update.warnings.success')))
        }

        else {
            ToastNotification(payload("error", res.response.data.err || t('perms.update.errors.error')))
        }
    }

    function handleClose() {
        setCurrentPermissionData({ ...defaultPermissionUpdateData })
    }

    return (
        <>
            {!loading && permData.length ?
                <FormControl fullWidth>
                    <InputLabel htmlFor="perm-selector">{t('perms.update.perm_selector')}</InputLabel>
                    <Select
                        fullWidth
                        value={currentPermissionData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "perm",
                            id: "perm-selector"
                        }}
                    >
                        {permData.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                    </Select>
                </FormControl>
                : ""}
            {currentPermissionData.id ?
                <Box>
                    <form onSubmit={th => handleDataSubmit(th)} autoComplete="off">
                        <Grid container spacing={2} justify="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    label={t('perms.common.inputs.name')}
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
                                    id="color"
                                    label={t('perms.common.inputs.color')}
                                    value={currentPermissionData.color}
                                    onChange={handleInputChange("color")}
                                    margin="normal"
                                    variant="filled"
                                />
                            </Grid>
                            <Grid item xs={8}>
                                {PermissionList.map(p => {
                                    const title = p.title || null
                                    const main = p.main || null
                                    const perms = p.perms || null
                                    const subperms = p.subperms || null
                                    return (
                                        <Box key={title} mb={4}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <div>
                                                    <Typography className={classes.HeaderText} variant="h5" component="h2">{title}</Typography>
                                                    {PermissionListHelperText[main] ?
                                                        <Typography variant="subtitle2" className={classes.HelperText}>
                                                            {PermissionListHelperText[main]}
                                                        </Typography> :
                                                        ""}
                                                </div>
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
                                                                <div>
                                                                    <Typography className={classes.HeaderText} variant="h5" component="h2">{title}</Typography>
                                                                    {PermissionListHelperText[main] ?
                                                                        <Typography variant="subtitle2" className={classes.HelperText}>
                                                                            {PermissionListHelperText[main]}
                                                                        </Typography> :
                                                                        ""}
                                                                </div>
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
                            {t("common.buttons.save")}
                        </Button>
                    </form>
                </Box>
                :
                ""}
        </>
    )
}