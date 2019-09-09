import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_DEV_API_URL
})

instance.defaults.timeout = 5000

export default instance
