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
    series_status: "currently_airing",
    trans_status: "currently_airing",
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
    premiered: "",
    episode_count: 0,
    version: "tv",
}

const defaultEpisodeData = {
    id: null,
    episode_number: "",
    credits: "",
    special_type: "",
    can_user_download: 1
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
    series_status: "finished_airing",
    trans_status: "currently_airing",
    synopsis: "",
    translators: "",
    editors: "",
    release_date: new Date(),
    authors: "",
    header: "",
    cover_art: "",
    logo: "",
    mal_link: "",
    genres: "",
    reader_link: "",
    download_link: "",
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

const defaultMotdData = {
    is_active: 1,
    title: "",
    subtitle: "",
    content_type: "",
    content_id: "",
    can_user_dismiss: 1
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
    defaultMotdData,
    defaultPermissionData,
    defaultPermissionUpdateData
}