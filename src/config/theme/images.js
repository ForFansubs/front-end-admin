import logo from '../../static/logo.png'
import fullLogo from '../../static/fullLogo.png'

var fullLogoGif = null
// GIF logosunun dosyalarını dene. Varsa içeri al, birisi yoksa hata ver ve header'da statik logoyu göster. (/components/header/header.js)
try {
    fullLogoGif = require('../../static/fullLogo.gif');
} catch (err) {
    console.warn('GIF logo bulunamadı.')
}

export { logo, fullLogo, fullLogoGif }