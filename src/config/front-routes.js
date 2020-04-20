const indexPage = "/"
const animePage = "/anime"
const mangaPage = "/manga"
const bildirimPage = "/bildirim"
const episodePage = "/bolum"
const userPage = "/kullanici"
const permissionPage = "/yetki"
const administrativePage = "/sistem"
const logsPage = "/kayitlar"
const homePage = process.env.NODE_ENV === "development" ? `http://192.168.1.100:3000` : `/`

export {
    indexPage,
    animePage,
    mangaPage,
    bildirimPage,
    episodePage,
    userPage,
    permissionPage,
    administrativePage,
    logsPage,
    homePage
}