//API uzantısına gerek yok, default axios importunda zaten ekleniyor                -Gereken Yetki-
const indexURL = "/" // GET                                                         (see-admin-page)
const isAdmin = "/kullanici/adminpage?withprops=true" // GET                        (see-admin-page)
const getFullLogs = "/logs" // GET                                                  (see-logs)

const getAnimeData = (slug) => `/anime/${slug}/admin-view` // GET                   (update-anime)
const getFullAnimeList = "/anime/admin-liste" // GET                                (see-admin-page)
const getFullFeaturedAnimeList = "/anime/admin-featured-anime" // GET               (featured-anime)
const getMangaData = (slug) => `/manga/${slug}/admin-view`

//-------------- ANIME
const addAnime = "/anime/anime-ekle" // POST                                        (add-anime)
const updateAnime = "/anime/anime-guncelle" // POST                                 (update-anime)
const deleteAnime = "/anime/anime-sil" // POST                                      (delete-anime)
const featuredAnime = "/anime/update-featured-anime" // POST                        (featured-anime)
//--------------

//-------------- EPISODE
const downloadLinkList = "/bolum/download-link-list" // GET                         (add-download-link)
const watchLinkList = "/bolum/watch-link-list" // GET                               (add-watch-link)

const addEpisode = "/bolum/bolum-ekle" // POST                                      (add-bolum)
const updateEpisode = "/bolum/bolum-duzenle" // POST                                (update-bolum)
const deleteEpisode = "/bolum/bolum-sil" // POST                                    (delete-bolum)

const addWatchlink = "/bolum/izleme-linki-ekle" // POST                             (add-watch-link)
const getWatchlinks = "/bolum/izleme-linkleri/admin-view" // POST                   (add-watch-link)
const deleteWatchlink = "/bolum/izleme-linki-sil" // POST                           (delete-watch-link)

const addDownloadlink = "/bolum/indirme-linki-ekle" // POST                         (add-download-link)
const getDownloadlinks = "/bolum/indirme-linkleri/admin-view" // POST               (add-download-link)
const deleteDownloadlink = "/bolum/indirme-linki-sil" // POST                       (delete-download-link)
//--------------

//-------------- MANGA
const getFullMangaList = "/manga/admin-liste" // GET                                (see-admin-page)
const addManga = "/manga/manga-ekle" // POST                                        (add-manga)
const updateManga = "/manga/manga-guncelle" // POST                                 (update-manga)
const deleteManga = "/manga/manga-sil" // POST                                      (delete-manga)
//--------------

//-------------- MANGA EPISODE
const addMangaEpisode = "/manga-bolum/bolum-ekle" // POST                           (add-manga-episode)
const updateMangaEpisode = "/manga-bolum/bolum-guncelle" // POST                    (update-manga-episode)
const deleteMangaEpisode = "/manga-bolum/bolum-sil" // POST                         (delete-manga-episode)
//--------------

//-------------- MOTD
const getFullMotdList = "/motd/admin-liste" // GET                                  (see-motd)
const addMotd = "/motd/motd-ekle" // POST                                           (add-motd)
const updateMotd = "/motd/motd-guncelle" // POST                                    (update-motd)
const deleteMotd = "/motd/motd-sil" // POST                                         (delete-motd)
//--------------

//-------------- USER
const getFullUserList = "/kullanici/uye-liste" // GET
const addUser = "/kullanici/kayit/admin" // POST                                    (add-user)
const updateUser = "/kullanici/uye-guncelle" // POST                                (update-user)
const deleteUser = "/kullanici/uye-sil" // POST                                     (delete-user)
//--------------

//-------------- PERMISSION
const getFullPermissionList = "/yetki/yetki-liste" // GET
const addPermission = "/yetki/yetki-ekle" // POST                                   (add-permission)
const updatePermission = "/yetki/yetki-guncelle" // POST                            (update-permission)
const deletePermission = "/yetki/yetki-sil" // POST                                 (delete-permission)
//--------------

const loginRoute = "/kullanici/giris"
const jikanIndex = "https://api.jikan.moe/v3"

export {
    indexURL,
    isAdmin,
    getFullLogs,
    getAnimeData,
    getFullAnimeList,
    getFullFeaturedAnimeList,
    getMangaData,
    addAnime,
    updateAnime,
    deleteAnime,
    featuredAnime,
    downloadLinkList,
    watchLinkList,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    addWatchlink,
    getWatchlinks,
    deleteWatchlink,
    addDownloadlink,
    getDownloadlinks,
    deleteDownloadlink,
    getFullMangaList,
    addManga,
    updateManga,
    deleteManga,
    addMangaEpisode,
    updateMangaEpisode,
    deleteMangaEpisode,
    getFullMotdList,
    addMotd,
    updateMotd,
    deleteMotd,
    getFullUserList,
    addUser,
    updateUser,
    deleteUser,
    getFullPermissionList,
    addPermission,
    updatePermission,
    deletePermission,
    loginRoute,
    jikanIndex
}