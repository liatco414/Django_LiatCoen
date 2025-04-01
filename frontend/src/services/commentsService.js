import axios from "axios";

const API = import.meta.env.VITE_API;

const getCSRFToken = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "csrftoken") {
            return value;
        }
    }
    return null;
};

const userToken = () => localStorage.getItem("token");

export const GetAllCommentsForArticle = (articleId) => {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${API}/articles/${articleId}/comments/`,
        withCredentials: true,
    };

    return axios
        .request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

export const PostNewComment = (user, articleId) => {
    let data = JSON.stringify({
        text: user.text,
        reply_to: user.reply_to || null,
    });

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API}/articles/${articleId}/comments/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            Authorization: `Bearer ${userToken()}`,
            "Content-Type": "application/json",
            Cookie: document.cookie,
        },
        data: data,
    };

    return axios
        .request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
};

export const DeleteComment = (commentId) => {
    let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${API}/comments/${commentId}/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            Authorization: `Bearer ${userToken()}`,
        },
    };

    return axios
        .request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};
