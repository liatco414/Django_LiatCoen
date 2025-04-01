import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetUserProfileById, UpdateUserProfile } from "../services/usersService";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { successMsg } from "../services/feedbackService";

function EditProfileInfo() {
    const [profileData, setProfileData] = useState(null);
    const [userId, setUserId] = useState(null);
    let { profileId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decode = jwtDecode(token);
            setUserId(decode.user_id);
        }
    }, [userId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            phone: profileData?.phone || "",
            country: profileData?.country || "",
            city: profileData?.city || "",
            street: profileData?.street || "",
            house_number: profileData?.house_number || "",
            username: profileData?.username || "",
            bio: profileData?.bio || "",
            profile_pic: profileData?.profile_pic || "",
            birth_date: profileData?.birth_date || null,
        },
        validationSchema: yup.object({
            phone: yup.string().max(10).min(2).required("Phone number is required"),
            country: yup.string().required("Country is required").min(2),
            city: yup.string().required("City is required").min(2),
            street: yup.string().required("Street is required").min(2),
            house_number: yup.number().min(1).required("House number is required"),
            username: yup.string().min(2),
            bio: yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                const response = await UpdateUserProfile(values, userId, profileId);
                if (response) {
                    setProfileData(response);
                    successMsg("Profile info updated successfully");
                    navigate(`/user-profile/${profileId}`);
                }
            } catch (error) {
                console.log(error);
            }
        },
    });

    useEffect(() => {
        const fecthUserProfile = async () => {
            try {
                if (!profileId) {
                    console.error("No article ID provided!");
                    return;
                }
                const response = await GetUserProfileById(profileId);
                if (response) {
                    setProfileData(response);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fecthUserProfile();
    }, [profileId]);

    return (
        <>
            <div
                className="form"
                style={{
                    padding: "90px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.626)",
                }}
            >
                <h1 style={{ color: "white", fontWeight: "900" }}>Update article</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="row1" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "15px" }}>
                        <div className="form-floating">
                            <input
                                type="phone"
                                className="form-control"
                                id="phone"
                                placeholder="Phone number"
                                name="phone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                            <label htmlFor="phone">Phone Number</label>
                            {formik.touched.phone && formik.errors.phone && <p className="text-danger">{formik.errors.phone}</p>}
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="country"
                                placeholder="Country"
                                name="country"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.country}
                            />
                            <label htmlFor="country">Country</label>
                            {formik.touched.country && formik.errors.country && <p className="text-danger">{formik.errors.country}</p>}
                        </div>
                    </div>
                    <div className="row2" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "15px", paddingTop: "15px" }}>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="city" placeholder="City" name="city" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city} />
                            <label htmlFor="city">City</label>
                            {formik.touched.city && formik.errors.city && <p className="text-danger">{formik.errors.city}</p>}
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="street"
                                placeholder="Street"
                                name="street"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.street}
                            />
                            <label htmlFor="street">Street</label>
                            {formik.touched.street && formik.errors.street && <p className="text-danger">{formik.errors.street}</p>}
                        </div>
                        <div className="form-floating">
                            <input
                                type="number"
                                className="form-control"
                                id="houseNum"
                                placeholder="House Number"
                                name="house_number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.house_number}
                            />
                            <label htmlFor="houseNum">House Number</label>
                            {formik.touched.house_number && formik.errors.house_number && <p className="text-danger">{formik.errors.house_number}</p>}
                        </div>
                    </div>
                    <div className="form-floating" style={{ paddingBottom: "15px" }}>
                        <textarea
                            style={{ height: "200px", resize: "none" }}
                            className="form-control"
                            id="bio"
                            placeholder="Article's Content"
                            name="bio"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.bio}
                        />
                        <label htmlFor="bio">bio</label>
                        {formik.touched.bio && formik.errors.bio && <p className="text-danger">{formik.errors.bio}</p>}
                    </div>
                    <div className="btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button type="submit" className="btn btn-danger" style={{ fontWeight: "900" }}>
                            Submit Article
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditProfileInfo;
