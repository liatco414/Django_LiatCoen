import axios from "axios";

const API = import.meta.env.VITE_API;

const getCSRFToken = () => {
    const match = document.cookie.match(new RegExp("(^| )csrftoken=([^;]+)"));
    return match ? match[2] : null;
};

const userToken = () => localStorage.getItem("token");

export const UserLogin = (user) => {
    let data = {
        username: user.username,
        password: user.password,
    };

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API}/login/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
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
        });
};

export const RegisterUser = (user) => {
    let data = {
        username: user.username,
        email: user.email,
        password: user.password,
    };

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API}/register/`,
        headers: {
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "application/json",
        },
        withCredentials: true,
        data: data,
    };

    return axios
        .request(config)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
};

export const UpdateUserProfile = (user, userId, profileId) => {
    let data = {
        id: profileId,
        phone: user.phone,
        country: user.country,
        city: user.city,
        street: user.street,
        house_number: user.house_number,
        time_since_created: user.time_since_created,
        time_since_updated: user.time_since_updated,
        bio: user.bio,
        profile_pic: user.profile_pic || null,
        birth_date: user.birth_date || null,
        user: userId,
    };

    let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API}/user-profile/${profileId}/`,
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

export const GetUserProfileById = (profileId) => {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${API}/user-profile/${profileId}/`,
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
