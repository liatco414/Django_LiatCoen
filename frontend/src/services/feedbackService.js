import { toast } from "react-toastify";
export function successMsg(msg) {
    toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
    });
}

export function errorMsg(msg) {
    toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        theme: "dark",
    });
}
