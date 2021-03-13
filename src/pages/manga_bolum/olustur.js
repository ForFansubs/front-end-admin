import React, { useState, useEffect } from "react";
import { useGlobal } from "reactn";
import Find from "lodash-es/find";

import axios from "../../config/axios/axios";
import ToastNotification, { payload } from "../../components/toastify/toast";

import {
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    LinearProgress,
} from "@material-ui/core";
import {
    defaultMangaEpisodeData,
    defaultMangaData,
} from "../../components/pages/default-props";
import { addMangaEpisode, getFullMangaList } from "../../config/api-routes";
import { useTranslation } from "react-i18next";

export default function EpisodeCreate() {
    const { t } = useTranslation("pages");
    const token = useGlobal("user")[0].token;

    const [data, setData] = useState([]);
    const [currentMangaData, setCurrentMangaData] = useState({
        ...defaultMangaData,
    });
    const [episodeData, setEpisodeData] = useState({
        ...defaultMangaEpisodeData,
    });
    const [fileList, setFileList] = useState(null);
    const [nameList, setNameList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                Authorization: token,
            };

            let res;

            try {
                res = await axios.get(getFullMangaList, { headers });
            } catch (err) {
                ToastNotification(
                    payload(
                        "error",
                        err.response.data.err ||
                            t("common.errors.database_error")
                    )
                );
            }

            if (res.status === 200) {
                setData(res.data);
                return setLoading(false);
            }

            setLoading(false);
        };

        fetchData();
    }, [token]);

    function handleChange(event) {
        const newData = Find(data, { id: event.target.value });
        setCurrentMangaData({ ...newData });
    }

    const handleInputChange = (name) => (event) => {
        event.persist();
        if (name === "special_type") {
            if (event.target.value === episodeData.special_type)
                return setEpisodeData((oldData) => ({
                    ...oldData,
                    special_type: "",
                }));
        }

        setEpisodeData((oldData) => ({
            ...oldData,
            [name]: event.target.value,
        }));
    };

    const handleImageInput = () => (event) => {
        const fileList = document.getElementById("upload_manga_pages").files;

        setNameList([...fileList]);
        setFileList(fileList);
    };

    function handleDataSubmit(th) {
        th.preventDefault();
        if (currentMangaData.slug === "") return;

        const formData = new FormData();
        Object.keys(episodeData).forEach((k) => {
            if (!episodeData[k]) return;
            formData.append(k, episodeData[k]);
        });
        formData.append("manga_id", currentMangaData.id);
        formData.append("manga_slug", currentMangaData.slug);
        for (const file of fileList) {
            formData.append("manga_pages", file);
        }

        const config = {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setProgress(percentCompleted);
            },
            headers: {
                Authorization: token,
                "Content-Type": "multipart/form-data",
            },
        };

        axios
            .post(addMangaEpisode, formData, config)
            .then((res) => {
                ToastNotification(
                    payload("success", t("episode.create.warnings.success"))
                );
                setTimeout(() => setProgress(0), 1000);
            })
            .catch((err) => {
                ToastNotification(
                    payload(
                        "error",
                        err.response.data.err ||
                            t("episode.create.errors.error")
                    )
                );
            });
    }

    return (
        <>
            {!loading && data.length ? (
                <FormControl fullWidth>
                    <InputLabel htmlFor='manga-selector'>
                        {t("manga_episode.create.manga_selector")}
                    </InputLabel>
                    <Select
                        fullWidth
                        value={currentMangaData.id || ""}
                        onChange={handleChange}
                        inputProps={{
                            name: "manga",
                            id: "manga-selector",
                        }}
                    >
                        {data.map((d) => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                ""
            )}
            {currentMangaData.id ? (
                <>
                    <form
                        onSubmit={(th) => handleDataSubmit(th)}
                        autoComplete='off'
                        encType='multipart/form-data'
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='episode_number'
                                    label={t(
                                        "common.inputs.episode_number_input"
                                    )}
                                    value={episodeData.episode_number}
                                    onChange={handleInputChange(
                                        "episode_number"
                                    )}
                                    margin='normal'
                                    variant='filled'
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id='episode_name'
                                    label={t(
                                        "common.inputs.episode_number_input"
                                    )}
                                    value={episodeData.episode_name}
                                    onChange={handleInputChange("episode_name")}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    id='credits'
                                    label={t("common.inputs.credits_input")}
                                    value={episodeData.credits}
                                    onChange={handleInputChange("credits")}
                                    margin='normal'
                                    variant='filled'
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Box
                                    display='flex'
                                    justifyContent='center'
                                    flexDirection='column'
                                    alignItems='center'
                                >
                                    <input
                                        accept='image/*'
                                        style={{ display: "none" }}
                                        id='upload_manga_pages'
                                        name='manga_pages'
                                        multiple
                                        type='file'
                                        onChange={handleImageInput()}
                                        required
                                    />
                                    <label htmlFor='upload_manga_pages'>
                                        <Button
                                            variant='outlined'
                                            component='span'
                                        >
                                            {t("common.buttons.upload_pages")}
                                        </Button>
                                    </label>
                                    {nameList ? (
                                        <Typography
                                            variant='body1'
                                            component='p'
                                        >
                                            {nameList.map(
                                                (f, i) =>
                                                    `${f.name} ${
                                                        i ===
                                                        nameList.length - 1
                                                            ? ""
                                                            : " / "
                                                    }`
                                            )}
                                        </Typography>
                                    ) : (
                                        ""
                                    )}
                                </Box>
                                <Box textAlign='center' py={2}>
                                    {nameList !== 0 ? (
                                        <LinearProgress
                                            variant='determinate'
                                            value={progress}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </Box>
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
                </>
            ) : (
                ""
            )}
        </>
    );
}
