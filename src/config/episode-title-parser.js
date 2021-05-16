import i18next from './i18n'

export default function EpisodeTitleParser({ episodeNumber, specialType }) {
    if (specialType && specialType === "toplu") {
        return {
            title: episodeNumber === "0"
                ?
                `${i18next.t('common:episode.episode_title_batch')}`
                :
                `${i18next.t('common:episode.episode_title_batch_episode_number', { episode_number: episodeNumber })}`
        }
    }
    else if (specialType && specialType !== "toplu") {
        return {
            title: `${specialType.toUpperCase()} ${episodeNumber}`, // `${specialType.toUpperCase()} ${episodeNumber}`
            slug: `${specialType}${episodeNumber}`,
            data: `${specialType}-${episodeNumber}`
        }
    }
    else return {
        title: `${i18next.t('common:episode.episode_title', { episode_number: episodeNumber })}`, // `${episodeNumber}. Bölüm`
        slug: `bolum${episodeNumber}`,
        data: `bolum-${episodeNumber}`
    }
}