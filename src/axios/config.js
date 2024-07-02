import axios from "axios";

const blogFetch = axios.create({
    baseURL: "https://api-biblioteca.tcc.uniuv.edu.br",
    headers: {
        "Content-Type": "application/json",
    },
});

export default blogFetch;