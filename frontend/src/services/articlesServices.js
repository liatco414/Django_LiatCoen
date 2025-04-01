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

export const GetAllArticles = () => {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${API}/articles`,
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

export const GetArticleById = (articleId) => {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${API}/articles/${articleId}`,
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

export const PostNewArticle = (user) => {
    let data = JSON.stringify({
        title: user.title,
        subtitle: user.subtitle,
        image: user.image || null,
        image_url: user.image_url || null,
        text: user.text,
        status: user.status,
    });

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API}/articles/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            Authorization: `Bearer ${userToken()}`,
            "Content-Type": "application/json",
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
        });
};

export const DeleteArticle = (articleId) => {
    let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${API}/articles/${articleId}/`,
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

export const EditArticle = (articleData, articleId) => {
    let data = {
        time_since_created: articleData.time_since_created,
        title: articleData.title,
        subtitle: articleData.subtitle,
        image: articleData.image,
        image_url: articleData.image_url,
        text: articleData.text,
        status: articleData.status,
    };

    let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API}/articles/${articleId}/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken()}`,
        },
        withCredentials: true,
        data: data,
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
