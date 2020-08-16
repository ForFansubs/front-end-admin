import React from 'react'
import { useGlobal } from 'reactn'

import CountUp from 'react-countup'
import { Grid, Box, Card, Typography, CardContent } from '@material-ui/core';

export default function IndexPage() {
    const [statistics] = useGlobal('statistics')

    return (
        <>
            <Typography variant="h3" gutterBottom>
                Anime İstatistikleri
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Anime Sayısı
                                </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.ANIME_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.ANIME_COUNT > 100 ? statistics.ANIME_COUNT - 100 : 0}
                                                end={statistics.ANIME_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Bölüm Sayısı
                        </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.EPISODE_COUNT ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.EPISODE_COUNT > 100 ? statistics.EPISODE_COUNT - 100 : 0}
                                                end={statistics.EPISODE_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    İndirme Linki Sayısı
                        </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.DOWNLOADLINK_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.DOWNLOADLINK_COUNT > 100 ? statistics.DOWNLOADLINK_COUNT - 100 : 0}
                                                end={statistics.DOWNLOADLINK_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    İzleme Linki Sayısı
                                </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.WATCHLINK_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.WATCHLINK_COUNT > 100 ? statistics.WATCHLINK_COUNT - 100 : 0}
                                                end={statistics.WATCHLINK_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            <Typography variant="h3" gutterBottom>
                Manga İstatistikleri
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Manga Sayısı
                                </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.MANGA_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.MANGA_COUNT > 100 ? statistics.MANGA_COUNT - 100 : 0}
                                                end={statistics.MANGA_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Bölüm Sayısı
                                </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.MANGA_EPISODE_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.MANGA_EPISODE_COUNT > 100 ? statistics.MANGA_EPISODE_COUNT - 100 : 0}
                                                end={statistics.MANGA_EPISODE_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            <Typography variant="h3" gutterBottom>
                Site İstatistikleri
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Kullanıcı Sayısı
                                </Typography>
                                <Typography variant="h2">
                                    {
                                        statistics.USER_COUNT
                                            ?
                                            <CountUp
                                                duration={3}
                                                start={statistics.USER_COUNT > 100 ? statistics.USER_COUNT - 100 : 0}
                                                end={statistics.USER_COUNT} />
                                            :
                                            "---"
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}