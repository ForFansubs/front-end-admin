const indexPage = "/"
const animePage = "/anime"
const mangaPage = "/manga"
const episodePage = "/bolum"
const userPage = "/kullanici"
const permissionPage = "/yetki"
const administrativePage = "/sistem"
const homePage = process.env.NODE_ENV === "development" ? `http://192.168.1.100:3000` : `/`

export {
    indexPage,
    animePage,
    mangaPage,
    episodePage,
    userPage,
    permissionPage,
    administrativePage,
    homePage
}