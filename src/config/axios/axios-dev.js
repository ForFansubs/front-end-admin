import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_DEV_API_URL,
    headers: { "accept-language": process.env.REACT_APP_DEFAULT_LANG },
});

export default instance;
