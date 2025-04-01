import { useFormik } from "formik";
import * as yup from "yup";
import { RegisterUser } from "../services/usersService";
import { useNavigate } from "react-router-dom";
import { errorMsg, successMsg } from "../services/feedbackService";
import "../CSS/forms.css";

function Register() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            username: yup.string().required().min(2, "Username must be at least 2 characters"),
            email: yup.string().required().min(2, "Email must contain at least 2 charcters").email(),
            password: yup.string().required(),
        }),
        onSubmit: async (values) => {
            try {
                const response = await RegisterUser(values);
                if (response) {
                    successMsg("User registered successfully! login to confirm user");
                    navigate("/login");
                }
            } catch (error) {
                console.log(error);
                errorMsg("Something went wrong, please try again", error);
            }
        },
    });

    return (
        <>
            <div className="form">
                <h1 style={{ color: "white", fontWeight: "900" }}>Register</h1>
                <form onSubmit={formik.handleSubmit} className="form-border">
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control input-username" id="username" placeholder="User-Name" name="username" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <label htmlFor="username">User Name</label>
                        {formik.touched.username && formik.errors.username && <p className="text-danger">{formik.errors.username}</p>}
                    </div>
                    <div className="form-floating" style={{ paddingBottom: "15px" }}>
                        <input type="email" className="form-control input-email" id="email" placeholder="name@example.com" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <label htmlFor="email">Email</label>
                        {formik.touched.email && formik.errors.email && <p className="text-danger">{formik.errors.email}</p>}
                    </div>
                    <div className="form-floating" style={{ paddingBottom: "15px" }}>
                        <input
                            type="password"
                            className="form-control input"
                            id="password"
                            placeholder="Password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ width: "300px" }}
                        />
                        <label htmlFor="password">Password</label>
                        {formik.touched.password && formik.errors.password && <p className="text-danger">{formik.errors.password}</p>}
                    </div>
                    <div className="btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button type="submit" className="btn btn-dark" style={{ boxShadow: "2px 2px 5px black" }}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Register;
