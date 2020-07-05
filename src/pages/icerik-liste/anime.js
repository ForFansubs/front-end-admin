import React, { useEffect, useState, forwardRef } from 'react';
import { useGlobal } from 'reactn'
import axios from '../../config/axios/axios'

import { getFullAnimeList } from "../../config/api-routes";

import MaterialTable from 'material-table';
import { AddBox, ArrowDownward, FirstPage, LastPage, ChevronRight, ChevronLeft, Clear, Search, FilterList } from "@material-ui/icons";
import { green, red } from '@material-ui/core/colors'
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { format, add } from 'date-fns'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

function getLatestEpisode(data) {
    if (!data[0]) return ""
    let max = Number(data[0].episode_number);

    for (let i = 0, len = data.length; i < len; i++) {
        let episode_number = Number(data[i].episode_number)

        if (data[i].special_type === "toplu") continue
        if (data[i].special_type === "film" && episode_number === 0) episode_number = episode_number + 1
        console.log(`İçerdeki bölüm numarası: ${episode_number}`)
        max = (episode_number > max) ? episode_number : max
    }

    return max;
}

function getLatestAiredEpisode(release_date) {
    return Math.round((new Date() - new Date(release_date)) / (7 * 24 * 60 * 60 * 1000))
}

function getNextEpisodeDate(release_date) {
    console.log(add(new Date(release_date), { weeks: getLatestAiredEpisode(release_date) }))
    return add(new Date(release_date), { weeks: getLatestAiredEpisode(release_date) })
}

const cellStyle = {
    padding: "4px 8px"
}

export default function AnimeList() {
    const token = useGlobal("user")[0].token
    const [adminPermList] = useGlobal('adminPermList')
    const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            // eslint-disable-next-line no-undef
            const res = await axios.get(getFullAnimeList, { headers }).catch(res => res)
            if (res.status === 200) {
                res.data.map((data, index) => {
                    console.log(data.name)
                    const latestEpisode = getLatestEpisode(data.episodes)
                    console.log(latestEpisode)
                    const latestAiredEpisode = data.series_status === "Tamamlandı" ? data.episode_count !== 0 ? data.episode_count : 0 : getLatestAiredEpisode(data.release_date)

                    if (latestEpisode >= latestAiredEpisode) {
                        res.data[index].episode_status = 1
                    }

                    if (data.series_status === "Tamamlandı" && (latestEpisode >= latestAiredEpisode)) {
                        res.data[index].episode_status = 2
                    }

                    res.data[index].translated_episode = data.episodes.length ? latestEpisode : "N/A"
                    res.data[index].aired_episode = data.episodes.length ?
                        data.series_status === "Tamamlandı" ?
                            data.episode_count !== 0 ?
                                data.episode_count : "N/A" :
                            getLatestAiredEpisode(data.release_date) >= 0 ? getLatestAiredEpisode(data.release_date)
                                : "N/A"
                        : "N/A"
                    res.data[index].next_episode = data.series_status === "Tamamlandı" ?
                        "N/A" :
                        format(getNextEpisodeDate(data.release_date), 'dd/MM/yyyy HH:mm')
                })

                setData(res.data)
                setLoading(false)
            } else {
                setLoading(false)
                setError(true)
            }
        }

        if (!adminPermList["see-anime-list"]) {
            setError(true)
        }

        fetchData()
    }, [adminPermList, token])

    return (
        <>
            <Alert severity="info" style={{ marginBottom: 8 }}>Bu tablo veritabanınızda ekli olan verileri rahatça görüntülemeniz için oluşturulmuştur. Bölüm durumu, yayınlanan bölüm ve gelecek bölüm satırlarında hatalar olabilir.</Alert>
            <Alert severity="warning" style={{ marginBottom: 8 }}>Yukarda ismi geçen satırların hesaplamaları bilgisayarınızda gerçekleştirilir. Sayfanın yüklemesi, içerik sayınıza bağlı değişebilir.</Alert>
            {!loading ?
                <MaterialTable
                    title="Anime Listesi"
                    totalCount={data.length}
                    icons={tableIcons}
                    columns={[
                        { field: 'series_status', title: 'Seri Durumu', width: 110, cellStyle },
                        { field: 'trans_status', title: 'Çeviri Durumu', width: 110, cellStyle },
                        { field: 'name', title: 'Anime Adı', filtering: false, width: 350, cellStyle },
                        {
                            field: 'release_date',
                            title: 'İlk Yayınlanma Tarihi',
                            align: "center",
                            filtering: false,
                            cellStyle,
                            render: rowData => (
                                format(new Date(rowData.release_date), 'dd/MM/yyyy HH:mm')
                            )
                        },
                        {
                            field: 'episode_status',
                            title: 'Bölüm Durumu',
                            align: "center",
                            cellStyle: { padding: 0, position: "relative" },
                            filtering: false,
                            width: 50,
                            render: rowData =>
                                (
                                    (
                                        rowData.episode_status === 1 ?
                                            <div style={{
                                                backgroundColor: green["400"],
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>✓</div>
                                            : rowData.episode_status === 2 ?
                                                <div style={{
                                                    backgroundColor: green["600"],
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>✓✓</div>
                                                :
                                                <div style={{
                                                    backgroundColor: red["600"],
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>🞪</div>
                                    )
                                )

                        },
                        { field: 'translated_episode', title: 'Çevrilen Bölüm', align: "center", filtering: false, cellStyle },
                        { field: 'aired_episode', title: 'Yayınlanan Bölüm', align: "center", filtering: false, cellStyle },
                        { field: 'next_episode', title: 'Gelecek Bölüm', align: "center", filtering: false, cellStyle },
                        { field: 'premiered', title: 'Sezon', cellStyle, width: 120 },
                        { field: 'translators', title: 'Çevirmenler', cellStyle },
                        { field: 'encoders', title: 'Encoderlar', cellStyle }
                    ]}
                    data={data}
                    options={{
                        rowStyle: { padding: 0 },
                        pageSize: 50,
                        pageSizeOptions: [20, 50, 100, 500],
                        sorting: true,
                        filtering: true
                    }} />
                : error ?
                    <Alert severity="danger">Listeyi getirirken bir sorunla karşılaştık.</Alert>
                    :
                    <CircularProgress />
            }
        </>
    )
}