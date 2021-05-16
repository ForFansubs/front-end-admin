import React, { useState, useEffect } from "react";
import { useGlobal } from "reactn";

import Find from "lodash-es/find";

import axios from "../../config/axios/axios";
import ToastNotification, { payload } from "../../components/toastify/toast";

import {
    Button,
    Grid,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Modal,
    makeStyles,
} from "@material-ui/core";
import { defaultUserUpdateData } from "../../components/pages/default-props";
import { getFullUserList, updateUser } from "../../config/api-routes";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    HeaderText: {
        color: theme.palette.grey[500],
        fontWeight: "bold",
    },
    HelperText: {
        color: theme.palette.grey[500],
    },
}));

export default function UserUpdate(props) {
    const { t } = useTranslation(["pages", "common"]);
    const classes = useStyles();
    const token = useGlobal("user")[0].token;

    const [open, setOpen] = useState(false);

    const [userData, setUserData] = useState([]);
    const [currentUserData, setCurrentUserData] = useState({
        ...defaultUserUpdateData,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                Authorization: token,
            };

            const res = await axios
                .get(getFullUserList, { headers })
                .catch((res) => res);
            if (res.status === 200) {
                setUserData(res.data);
                return setLoading(false);
            }

            setLoading(false);
        };

        fetchData();
    }, [token]);

    function handleChange(event) {
        const newData = Find(userData, { id: event.target.value });
        setCurrentUserData({ ...newData });
        setOpen(true);
    }

    const handleInputChange = (name) => (event) => {
        setCurrentUserData({ ...currentUserData, [name]: event.target.value });
    };

    async function handleDataSubmit(th) {
        th.preventDefault();
        if (currentUserData.slug === "") return;

        let clickedUserDataIndex = null;

        for (var i = 0; i < userData.length; i++) {
            if (userData[i].id === currentUserData.id) {
                clickedUserDataIndex = i;
                break;
            }
        }

        const data = {
            ...currentUserData,
        };

        const headers = {
            Authorization: token,
        };

        const res = await axios
            .post(updateUser, data, { headers })
            .catch((res) => res);

        if (res.status === 200) {
            const newUserDataSet = userData;
            newUserDataSet[clickedUserDataIndex] = currentUserData;
            setUserData([...newUserDataSet]);
            setCurrentUserData({ ...defaultUserUpdateData });
            handleClose();
            ToastNotification(
                payload(
                    "success",
                    res.data.message || t("user.update.warnings.success")
                )
            );
        } else {
            ToastNotification(
                payload(
                    "error",
                    res.response.data.err || t("user.update.errors.error")
                )
            );
        }
    }

    function handleClose() {
        setCurrentUserData({ ...defaultUserUpdateData });
        setOpen(false);
    }

    return (
        <>
            {!loading && userData.length ? (
                <FormControl fullWidth>
                    <InputLabel htmlFor='anime-selector'>
                        {t("user.update.user_selector")}
                    </InputLabel>
                    <Select
                        fullWidth
                        value={currentUserData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "user",
                            id: "user-selector",
                        }}
                    >
                        {userData.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                ""
            )}
            <Modal
                aria-labelledby='simple-modal-title'
                aria-describedby='simple-modal-description'
                open={open}
                onClose={handleClose}
                className={classes.ModalContainer}
            >
                <Box p={2} bgcolor='background.level2'>
                    <form
                        onSubmit={(th) => handleDataSubmit(th)}
                        autoComplete='off'
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='name'
                                    label={t("common:ns.username")}
                                    value={currentUserData.name}
                                    onChange={handleInputChange("name")}
                                    margin='normal'
                                    variant='filled'
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='password'
                                    label={t("common:ns.password")}
                                    value={currentUserData.password}
                                    onChange={handleInputChange("password")}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='permission_level'
                                    label={t(
                                        "user.common.inputs.permission_level"
                                    )}
                                    value={currentUserData.permission_level}
                                    onChange={handleInputChange(
                                        "permission_level"
                                    )}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='avatar'
                                    label={t("user.common.inputs.avatar")}
                                    value={currentUserData.avatar}
                                    onChange={handleInputChange("avatar")}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    disabled
                                    id='email'
                                    label={t("common:ns.email")}
                                    value={currentUserData.email}
                                    onChange={handleInputChange("email")}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                        </Grid>
                        <Button
                            variant='outlined'
                            color='primary'
                            type='submit'
                        >
                            {t("common.buttons.save")}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </>
    );
}
