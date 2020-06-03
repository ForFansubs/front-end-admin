import PermissionList from '../../config/permission-list'

const getPermList = () => {
    const list = []
    const flist = {}
    PermissionList.map(p => {
        if (p.main) list.push(p.main)
        list.push(Object.values(p.perms))
        if (p.subperms) {
            p.subperms.map(s => {
                if (s.main) list.push(s.main)
                list.push(Object.values(s.perms))
                return null
            })
        }
        return null
    })
    list.flat().map(l => {
        flist[l] = false
        return null
    })
    return flist
}

const defaultAnimeData = {
    name: "",
    slug: "",
    series_status: "Tamamlandı",
    trans_status: "Devam Ediyor",
    airing: 1,
    synopsis: "",
    translators: "",
    encoders: "",
    release_date: new Date(),
    studios: "",
    header: "",
    cover_art: "",
    logo: "",
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

const defaultMangaEpisodeData = {
    id: null,
    manga_id: null,
    episode_number: "",
    episode_name: "",
    credits: ""
}

const defaultTaBatchData = {
    taLink: "",
    episodes: ""
}

const defaultWatchLinkData = {
    link: ""
}

const defaultMangaData = {
    id: '',
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

const defaultUserData = {
    name: "",
    email: "",
    password: "",
    password2: ""
}

const defaultUserUpdateData = {
    id: null,
    slug: "",
    name: "",
    password: "",
    permission_level: "",
    avatar: "",
    email: ""
}

const defaultPermissionData = {
    name: "",
    color: "",
    permission_set: getPermList()
}

const defaultPermissionUpdateData = {
    id: null,
    name: "",
    color: "",
    permission_set: getPermList()
}

export {
    defaultAnimeData,
    defaultEpisodeData,
    defaultMangaEpisodeData,
    defaultTaBatchData,
    defaultWatchLinkData,
    defaultMangaData,
    defaultUserData,
    defaultUserUpdateData,
    defaultPermissionData,
    defaultPermissionUpdateData
}