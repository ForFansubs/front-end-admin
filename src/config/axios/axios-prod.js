import axios from "axios";

const instance = axios.create({
    baseURL: "/api",
    headers: { "accept-language": process.env.REACT_APP_DEFAULT_LANG },
});

export default instance;
