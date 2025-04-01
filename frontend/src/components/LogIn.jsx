import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { UserLogin } from "../services/usersService";
import { successMsg } from "../services/feedbackService";
import "../CSS/forms.css";

function Login({ setIsLoggedIn }) {
    let nav = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: yup.object({
            username: yup.string().required().min(2),
            password: yup.string().required().min(5).max(20),
        }),
        onSubmit: (values) => {
            UserLogin(values).then((res) => {
                if (res) {
                    let userToken = res.jwt.access;
                    localStorage.setItem("token", userToken);
                    successMsg("User logged in succefully");
                    nav("/");
                    setIsLoggedIn(true);
                }
            });
        },
    });

    return (
        <>
            <div className="form">
                <h1 style={{ fontSize: "3em", fontWeight: "900", color: "white" }}>Log-in</h1>
                <form onSubmit={formik.handleSubmit} className="form-border">
                    <div className="form-floating mb-3" style={{ margin: "30px", width: "350px" }}>
                        <input type="text" className="form-control input-login" id="floatingInput" placeholder="user_name" name="username" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <label htmlFor="floatingInput">User Name</label>
                        {formik.touched.username && formik.errors.username && <p className="text-danger">{formik.errors.username}</p>}
                    </div>
                    <div className="form-floating" style={{ margin: "30px", width: "350px" }}>
                        <input
                            type="password"
                            className="form-control input-login"
                            id="floatingPassword"
                            placeholder="Password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                        {formik.touched.password && formik.errors.password && <p className="text-danger">{formik.errors.password}</p>}
                    </div>
                    <button className="btn btn-dark" type="submit" disabled={!formik.dirty || !formik.isValid} style={{ boxShadow: "2px 2px 5px black", marginBottom: "10px" }}>
                        login
                    </button>
                    <p>
                        Don't have an account? <Link to={"/register"}>Sign-Up</Link>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;
