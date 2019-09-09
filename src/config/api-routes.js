//API uzantısına gerek yok, default axios importunda zaten ekleniyor
const indexURL = "/" // GET
const isAdmin = "/user/adminpage?withprops=true" // GET

const getAnimeData = (slug) => `/anime/${slug}/admin-view` // GET
const getFullAnimeList = "/anime/admin-liste" // GET
const getFullFeaturedAnimeList = "/anime/admin-featured-anime" // GET

const addAnime = "/anime/anime-ekle" // POST
const updateAnime = "/anime/anime-guncelle" // POST
const deleteAnime = "/anime/anime-sil" // POST
const featuredAnime = "/anime/update-featured-anime" // POST

const downloadLinkList = "/episode/download-link-list" // GET
const watchLinkList = "/episode/watch-link-list" // GET
const addEpisode = "/episode/bolum-ekle" // POST
const updateEpisode = "/episode/bolum-duzenle" // POST
const deleteEpisode = "/episode/bolum-sil" // POST
const taBatchTVLink = "/episode/ta-bolum-cek" // POST
const taBatchBDLink = "/episode/ta-bolum-cek-bd" // POST
const addWatchlink = "/episode/izleme-linki-ekle" // POST
const getWatchlinks = "/episode/izleme-linkleri/admin-view" // POST
const deleteWatchlink = "/episode/izleme-linki-sil" // POST

const getFullMangaList = "/manga/admin-liste" // GET
const addManga = "/manga/manga-ekle" // POST
const updateManga = "/manga/manga-guncelle" // POST
const deleteManga = "/manga/manga-sil" // POST

const jikanIndex = "https://api.jikan.moe/v3"

export {
    indexURL,
    isAdmin,
    getAnimeData,
    getFullAnimeList,
    getFullFeaturedAnimeList,
    addAnime,
    updateAnime,
    deleteAnime,
    downloadLinkList,
    watchLinkList,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    taBatchTVLink,
    taBatchBDLink,
    addWatchlink,
    getWatchlinks,
    deleteWatchlink,
    getFullMangaList,
    addManga,
    updateManga,
    deleteManga,
    featuredAnime,
    jikanIndex
}