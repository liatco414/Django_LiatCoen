import { useEffect, useState } from "react";
import { GetAllArticles } from "../services/articlesServices";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../CSS/home.css";

function ArchivedArticles() {
    const [archives, setArchives] = useState([]);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            let decode = jwtDecode(token);
            setIsAdmin(decode.isadmin);
            setIsLoggedIn(token);
        }
    }, []);

    useEffect(() => {
        GetAllArticles()
            .then((response) => {
                setArchives(response.filter((article) => article.status === "archived"));
            })
            .catch((error) => console.log(error));
    }, []);
    return (
        <>
            <div className="articles">
                {archives ? (
                    archives.map((post) => (
                        <div className="card" key={post.id} style={{ border: "none", boxShadow: "2px 2px 5px black", marginTop: "10px", width: "20rem", padding: "0", borderRadius: "0" }}>
                            <img src={post.image || post.image_url} alt="Image related to the article" className="card-img-top" style={{ borderRadius: "0", height: "200px" }} />
                            <div className="card-body">
                                {isAdmin === true ? (
                                    <div className="icons" style={{ width: "100%", display: "flex", justifyContent: "start", gap: "10px", fontSize: "1.2em", alignItems: "center" }}>
                                        <i className="fa-solid fa-trash" onClick={() => handleDeleteArticle(post.id)} style={{ cursor: "pointer" }}></i>
                                        <Link to={`/edit-article/${post.id}`} style={{ color: "black", cursor: "pointer" }}>
                                            <i className="fa-solid fa-pen-to-square"></i>{" "}
                                        </Link>
                                    </div>
                                ) : null}
                                <div className="content" style={{ height: "150px", display: "flex", flexDirection: "column" }}>
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text" style={{ height: "80px", overflowY: "scroll" }}>
                                        {post.subtitle}
                                    </p>
                                </div>
                                <div className="btns" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "30px", paddingTop: "10px" }}>
                                    <div className="link" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Link to={`/articles/${post.id}`} className="btn btn-danger">
                                            See full article
                                        </Link>
                                    </div>
                                    {isLoggedIn ? (
                                        <button
                                            style={{ backgroundColor: "black", border: "none", boxShadow: "1px 1px 3px grey", borderRadius: "7px" }}
                                            onClick={() => {
                                                setSelectedArticleId(post.id);
                                                setShowCommentModal(true);
                                            }}
                                        >
                                            <i className="fa-regular fa-comment" style={{ fontSize: "1.2em", color: "white" }}></i>
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            <div className="card-footer text-body-secondary">{post.time_since_created}</div>
                        </div>
                    ))
                ) : (
                    <div style={{ display: "grid", gridColumn: "span 3", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <img style={{ width: "90%", height: "80%" }} src="https://i.gifer.com/YlWC.gif" alt="loading..." />
                    </div>
                )}
            </div>
        </>
    );
}

export default ArchivedArticles;
