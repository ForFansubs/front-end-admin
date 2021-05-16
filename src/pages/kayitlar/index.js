import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'
import axios from '../../config/axios/axios'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { getFullLogs } from "../../config/api-routes";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';

export default function VerticalTabs() {
    const { t } = useTranslation('pages')
    const token = useGlobal("user")[0].token
    const [adminPermList] = useGlobal('adminPermList')
    const [data, setData] = useState([])
    // const [loading, setLoading] = useState(true)

    const columns = [
        { id: 'user', label: t('logs.keys.user_name'), minWidth: 170 },
        { id: 'text', label: t('logs.keys.text'), minWidth: 200 },
        {
            id: 'created_time',
            label: t('logs.keys.created_time'),
            minWidth: 170,
            align: 'right'
        }
    ]

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const headers = {
                "Authorization": token
            }

            // eslint-disable-next-line no-undef
            const res = await axios.get(getFullLogs, { headers }).catch(res => res)
            if (res.status === 200) {
                setData(res.data)
                // setLoading(false)
            } else {
                // setLoading(false)
            }
        }

        if (!adminPermList["see-logs"]) {
            setError(true)
        }

        fetchData()
    }, [adminPermList, token])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    return (
        <>
            {error ? <Redirect to="/" /> : ""}
            <Grid container>
                <Grid item xs={12}>
                    <Box p={2} bgcolor="background.level2">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map(column => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'previous page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'next page',
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}