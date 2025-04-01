import { useFormik } from "formik";
import * as yup from "yup";
import { PostNewArticle } from "../services/articlesServices";
import { useNavigate } from "react-router-dom";
import { errorMsg, successMsg } from "../services/feedbackService";
import "../CSS/forms.css";

function PostArticle() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            tags: [],
            title: "",
            subtitle: "",
            image: "",
            image_url: "",
            text: "",
            status: "draft",
        },
        validationSchema: yup.object({
            title: yup.string().required().min(2, "Title must be at least two characters"),
            subtitle: yup.string().required().min(2, "Subtitle must be at least two characters"),
            image_url: yup.string().matches(/^https?:\/\/\S+$/, "Invalid image URL"),
            text: yup.string().min(20, "Article's content must be at least 20 characters"),
            status: yup.string().oneOf(["draft", "published", "archived"], "Invalid status"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await PostNewArticle(values);
                if (response) {
                    successMsg("Article Published Successfully!");
                    navigate("/");
                }
            } catch (error) {
                console.log(error);
                errorMsg("Something went wrong, try again later");
            }
        },
    });

    return (
        <div className="form">
            <h1>Upload a new article</h1>
            <form onSubmit={formik.handleSubmit} className="form-border">
                <div className="row1" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "15px" }}>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="title" placeholder="Title" name="title" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title} />
                        <label htmlFor="title">Title</label>
                        {formik.touched.title && formik.errors.title && <p className="text-danger">{formik.errors.title}</p>}
                    </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="subTitle"
                            placeholder="Subtitle"
                            name="subtitle"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.subtitle}
                        />
                        <label htmlFor="subTitle">Subtitle</label>
                        {formik.touched.subtitle && formik.errors.subtitle && <p className="text-danger">{formik.errors.subtitle}</p>}
                    </div>
                </div>
                <div className="row2" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "15px", paddingTop: "15px" }}>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="imageURL"
                            placeholder="Image URL"
                            name="image_url"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.image_url}
                        />
                        <label htmlFor="imageURL">Image URL</label>
                        {formik.touched.image_url && formik.errors.image_url && <p className="text-danger">{formik.errors.image_url}</p>}
                    </div>
                    <div className="form-floating">
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            onChange={(event) => {
                                formik.setFieldValue("image", event.currentTarget.files[0]);
                            }}
                        />
                        <label htmlFor="image">Upload Image</label>
                        {formik.touched.image && formik.errors.image && <p className="text-danger">{formik.errors.image}</p>}
                    </div>
                </div>
                <div className="row3" style={{ width: "100%", display: "flex", justifyContent: "center", gap: "20px", paddingBottom: "15px" }}>
                    <div className="form-floating" style={{ width: "60%" }}>
                        <select className="form-control" id="status" name="status" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.status}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        <label htmlFor="status">Status</label>
                    </div>
                </div>
                <div className="form-floating" style={{ paddingBottom: "15px" }}>
                    <textarea
                        style={{ height: "200px", resize: "none" }}
                        className="form-control"
                        id="text"
                        placeholder="Article's Content"
                        name="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.text}
                    />
                    <label htmlFor="text">Article's Content</label>
                    {formik.touched.text && formik.errors.text && <p className="text-danger">{formik.errors.text}</p>}
                </div>
                <div className="btn" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <button type="submit" className="btn btn-danger" style={{ fontWeight: "900" }}>
                        Submit Article
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostArticle;
