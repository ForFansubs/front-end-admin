const checkMyAnimeListAnimeLink = function (link) {
    const regex = /(http|https):\/\/+myanimelist.net\/anime\/\d+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ // eslint-disable-line

    if (link.match(regex)) return false
    else return true
}

const checkYoutubeLink = function (link) {
    const regex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/

    if (link.match(regex)) return false
    else return true
}

const checkMyAnimeListMangaLink = function (link) {
    const regex = /(http|https):\/\/+myanimelist.net\/manga\/\d+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ // eslint-disable-line
    if (link === "-") return false
    if (link.match(regex)) return false
    else return true
}

const checkTurkAnimeLink = function (link) {
    const regex = /(http|https):\/\/www.turkanime.tv\/anime\/+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ // eslint-disable-line
    if (link === "-") return false
    if (link.match(regex)) return false
    else return true
}

const handleFeaturedSelectData = (featuredAnimes) => {
    const bdregex = /\[bd\]/
    const animeData = featuredAnimes.map(f => {
        let data = {
            version: "",
            name: ""
        }
        if (f.match(bdregex)) {
            data = {
                version: "bd",
                name: f.replace(' [bd]', '')
            }
        }
        else {
            data = {
                version: "tv",
                name: f.replace(' [tv]', '')
            }
        }
        return data
    })
    return animeData
}

export {
    checkMyAnimeListAnimeLink,
    checkMyAnimeListMangaLink,
    checkYoutubeLink,
    checkTurkAnimeLink,
    handleFeaturedSelectData
}