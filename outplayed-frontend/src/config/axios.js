import axios from "axios";
import {
    API_URL,
    ADMIN_API_URL,
    NEWS_API_URL,
    HUBS_API_URL,
    MATCHMAKING_API_URL,
    TOURNAMENT_API_URL,
    LADDER_API_URL,
} from "../config/keys";
export const userInstance = () => {
    return axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};

export const adminInstance = () => {
    return axios.create({
        baseURL: ADMIN_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webadmintoken")
                ? "Bearer" + " " + localStorage.getItem("webadmintoken")
                : "",
        },
    });
};

export const NEWS_INSTANCE = () => {
    return axios.create({
        baseURL: NEWS_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};

export const hubsInstance = () => {
    return axios.create({
        baseURL: HUBS_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};
export const matchmakingInstance = () => {
    return axios.create({
        baseURL: MATCHMAKING_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};
export const tournamentInstance = () => {
    return axios.create({
        baseURL: TOURNAMENT_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};

export const ladderInstance = () => {
    return axios.create({
        baseURL: LADDER_API_URL,
        withCredentials: true,
        headers: {
            Authorization: localStorage.getItem("webtoken")
                ? "Bearer" + " " + localStorage.getItem("webtoken")
                : "",
        },
    });
};
