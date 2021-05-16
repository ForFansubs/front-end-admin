import React from 'react'
import { useGlobal } from 'reactn'

import CountUp from 'react-countup'
import { Grid, Box, Card, Typography, CardContent } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function IndexPage() {
    const { t } = useTranslation('pages')
    const [statistics] = useGlobal('statistics')

    return (
        <>
            <Typography variant="h3" gutterBottom>
                {t('index.anime.title')}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {t('index.anime.anime_count')}
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
                                    {t('index.anime.episode_count')}
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
                                    {t('index.anime.download_link_count')}
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
                                    {t('index.anime.watch_link_count')}
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
                {t('index.manga.title')}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {t('index.manga.manga_count')}
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
                                    {t('index.manga.episode_count')}
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
                {t('index.site_statistics.title')}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                    <Box mb={2}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {t('index.site_statistics.user_count')}
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