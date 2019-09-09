const defaultAnimeData = {
    name: "",
    slug: "",
    synopsis: "",
    translators: "",
    encoders: "",
    release_date: new Date(),
    studios: "",
    header: "",
    cover_art: "",
    mal_link: "",
    genres: "",
    ta_link: "",
    premiered: "",
    episode_count: 0,
    getEpisodes: false,
    version: "tv",
    error: false,
    confirm: false,
}

const defaultEpisodeData = {
    id: null,
    episode_number: "",
    credits: "",
    special_type: ""
}

const defaultTaBatchData = {
    taLink: "",
    episodes: ""
}

const defaultWatchLinkData = {
    link: ""
}

const defaultMangaData = {
    name: "",
    slug: "",
    synopsis: "",
    translators: "",
    editors: "",
    release_date: new Date(),
    authors: "",
    header: "",
    cover_art: "",
    mal_link: "",
    genres: "",
    mos_link: "",
    download_link: "",
    error: false,
    confirm: false,
}

export { defaultAnimeData, defaultEpisodeData, defaultTaBatchData, defaultWatchLinkData, defaultMangaData }