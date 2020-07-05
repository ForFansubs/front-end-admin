import React, { useEffect, useState, forwardRef } from 'react';
import { useGlobal } from 'reactn'
import axios from '../../config/axios/axios'

import { getFullMangaList } from "../../config/api-routes";

import MaterialTable from 'material-table';
import { AddBox, ArrowDownward, FirstPage, LastPage, ChevronRight, ChevronLeft, Clear, Search, FilterList } from "@material-ui/icons";
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { format } from 'date-fns'

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
            const res = await axios.get(getFullMangaList, { headers }).catch(res => res)
            if (res.status === 200) {
                setData(res.data)
                setLoading(false)
            } else {
                setLoading(false)
                setError(true)
            }
        }

        if (!adminPermList["see-manga-list"]) {
            setError(true)
        }

        fetchData()
    }, [adminPermList, token])

    return (
        <>
            <Alert severity="info" style={{ marginBottom: 8 }}>Bu tablo veritabanınızda ekli olan verileri rahatça görüntülemeniz için oluşturulmuştur. Bölüm durumu, yayınlanan bölüm ve gelecek bölüm satırlarında hatalar olabilir.</Alert>
            {!loading ?
                <MaterialTable
                    title="Manga Listesi"
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
                        { field: 'translators', title: 'Çevirmenler', cellStyle },
                        { field: 'editors', title: 'Editörler', cellStyle }
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