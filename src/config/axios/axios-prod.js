import axios from 'axios'

const instance = axios.create({
    baseURL: '/api/'
})

instance.defaults.timeout = 5000

export default instance
