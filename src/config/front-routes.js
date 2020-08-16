const indexPage = "/"
const animePage = "/anime"
const mangaPage = "/manga"
const mangaBolumPage = "/manga-bolum"
const motdPage = "/motd"
const episodePage = "/bolum"
const userPage = "/kullanici"
const permissionPage = "/yetki"
const administrativePage = "/sistem"
const logsPage = "/kayitlar"
const homePage = process.env.NODE_ENV === "development" ? process.env.REACT_APP_SITEURL : `/`

export {
    indexPage,
    animePage,
    mangaPage,
    mangaBolumPage,
    motdPage,
    episodePage,
    userPage,
    permissionPage,
    administrativePage,
    logsPage,
    homePage
}