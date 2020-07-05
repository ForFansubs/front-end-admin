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

const handleSelectData = (value) => {
    const bdregex = /\[bd\]/
    let data = {}

    if (value.match(bdregex)) {
        data = {
            version: "bd",
            name: value.replace(' [bd]', '')
        }
    }
    else {
        data = {
            version: "tv",
            name: value.replace(' [tv]', '')
        }
    }
    return data
}

const handleFeaturedSelectData = (featuredAnimes) => {
    const bdregex = /\[bd\]/
    const animeData = featuredAnimes.map(f => {
        let data = {}

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

const handleEpisodeSelectData = (episode_title) => {
    const ovaregex = /OVA/
    const filmregex = /FILM/
    const topluregex = /TOPLU/

    if (episode_title.match(ovaregex)) {
        return {
            special_type: "ova",
            episode_number: episode_title.replace("OVA ", "")
        }
    }
    else if (episode_title.match(filmregex)) {
        return {
            special_type: "film",
            episode_number: episode_title.replace("FILM ", "")
        }
    }
    else if (episode_title.match(topluregex)) {
        return {
            special_type: "toplu",
            episode_number: episode_title.replace("TOPLU ", "")
        }
    }
    else {
        return {
            special_type: "",
            episode_number: episode_title.replace(". Bölüm", "")
        }
    }
}

const handleEpisodeTitleFormat = (data) => {
    const { special_type, episode_number } = data

    if (special_type) {
        return `${special_type.toUpperCase()} ${episode_number}`
    }
    else return `${episode_number}. Bölüm`
}

export {
    checkMyAnimeListAnimeLink,
    checkMyAnimeListMangaLink,
    checkYoutubeLink,
    checkTurkAnimeLink,
    handleSelectData,
    handleFeaturedSelectData,
    handleEpisodeSelectData,
    handleEpisodeTitleFormat
}