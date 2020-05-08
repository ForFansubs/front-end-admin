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

const generalSlugify = function (text) {
    return text.toString().toLowerCase().replace(/\s+/g, '-')
        // eslint-disable-next-line
        .replace(/[^\w\-]+/g, '')
        // eslint-disable-next-line
        .replace(/\-\-+/g, '-')
        // eslint-disable-next-line
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

const handleSelectData = (value) => {
    const bdregex = /\[bd\]/
    let data = {
        version: "",
        name: ""
    }
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

const handleGeneralSlugify = text => {
    const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ♭·/_,:;'
    const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzhf------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c =>
            b.charAt(a.indexOf(c))) // Replace special chars
        .replace(/&/g, '') // Replace & with 'and'
        // eslint-disable-next-line
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        // eslint-disable-next-line
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export {
    checkMyAnimeListAnimeLink,
    checkMyAnimeListMangaLink,
    checkYoutubeLink,
    checkTurkAnimeLink,
    generalSlugify,
    handleSelectData,
    handleFeaturedSelectData,
    handleEpisodeSelectData,
    handleEpisodeTitleFormat,
    handleGeneralSlugify
}