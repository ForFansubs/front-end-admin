// Değişken görselleri tanımla.
var logo = null
var fullLogo = null

// Tam logonun dosyasını dene. Varsa içeri al.
try {
    logo = require('../../static/logo.png').default;
} catch (err) {
    console.error('Tam logo bulunamadı.')
}

// GIF logosunun dosyalarını dene. Varsa içeri al, birisi yoksa hata ver ve header'da statik logoyu göster. (/components/header/header.js)
if (process.env.REACT_APP_HEADER_LOGO_TYPE === "gif") {
    try {
        fullLogo = require('../../static/fullLogo.gif').default;
    } catch (err) {
        console.warn('GIF logo bulunamadı.')
    }
}
else {
    // Header logosunun dosyalarını dene. Varsa içeri al, birisi yoksa hata ver.
    try {
        fullLogo = require('../../static/fullLogo.png').default;
    } catch (err) {
        console.error('Header logosu bulunamadı.')
    }
}

export { logo, fullLogo }