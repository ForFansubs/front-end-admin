//Try reading localStorage before using it
try {
    JSON.parse(localStorage.getItem("app-settings"))
} catch (err) {
    if (err) localStorage.removeItem("app-settings")
}

try {
    const user_data = JSON.parse(localStorage.getItem("user"))
    if (user_data.exp < Date.now()) {
        localStorage.removeItem("user")
    }
} catch (err) {
    if (err) localStorage.removeItem("user")
}

//Get existing localstorage for later use
const settings = localStorage.getItem("app-settings") ? JSON.parse(localStorage.getItem("app-settings")) : {}
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

//Change non-nullable keys with defaults
settings.language = settings.language ? settings.language : (navigator.language || navigator.userLanguage) || process.env.REACT_APP_DEFAULT_LANG
settings.version = settings.version ? settings.version : "null"
settings["release-name"] = settings["release-name"] ? settings["release-name"] : "null"

localStorage.setItem("app-settings", JSON.stringify(settings))

export { settings, user }