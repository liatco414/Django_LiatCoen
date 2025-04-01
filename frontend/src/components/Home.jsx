import { useEffect, useState } from "react";
import { DeleteArticle, EditArticle, GetAllArticles } from "../services/articlesServices";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import CommentsModal from "./CommentsModal";
import { jwtDecode } from "jwt-decode";
import "../CSS/home.css";

function Home({ setShowCommentModal, showCommentModal, searchTerm }) {
    const [articles, setArticles] = useState([]);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [displayCount, setDisplayCount] = useState(3);

    const loadMore = () => {
        setDisplayCount((prev) => prev + 3);
    };

    useEffect(() => {
        GetAllArticles().then((response) => {
            setArticles(response.filter((article) => article.status === "published"));
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setIsAdmin(decoded.isadmin);
            setIsLoggedIn(token);
        }
    }, []);

    const handleDeleteArticle = (articleId) => {
        DeleteArticle(articleId)
            .then(() => {
                setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
            })
            .catch((error) => {
                console.log(error.response?.data);
            });
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = articles.filter((article) => article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || article.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredArticles(filtered);
        } else {
            setFilteredArticles(articles);
        }
    }, [searchTerm, articles]);

    const displayedArticles = searchTerm ? filteredArticles.slice(0, displayCount) : articles.slice(0, displayCount);

    return (
        <>
            <div className="h1p">
                <h1 style={{ fontWeight: "900" }}>News Around The World</h1>
                <p>Welcome to our news site, here you can see what's new today around the world</p>
            </div>
            {isAdmin === true && (
                <div className="add" style={{ width: "100%", height: "100%" }}>
                    <Link
                        to={"/post-article"}
                        style={{
                            width: "60px",
                            height: "60px",
                            position: "fixed",
                            bottom: "30px",
                            right: "30px",
                            backgroundColor: "rgb(0, 149, 255)",
                            borderRadius: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "2px 2px 5px grey",
                        }}
                    >
                        <i style={{ color: "white", fontSize: "2em" }} className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            )}

            <div className="articles">
                {articles ? (
                    displayedArticles.map((post) => (
                        <div className="card" key={post.id} style={{ border: "none", boxShadow: "2px 2px 5px black", marginTop: "10px", width: "20rem", padding: "0", borderRadius: "0" }}>
                            <img src={post.image || post.image_url} alt="Image related to the article" class="card-img-top" style={{ borderRadius: "0", height: "200px" }} />
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
                                        <Link to={`articles/${post.id}`} className="btn btn-danger">
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
                    <img src="https://i.gifer.com/YlWC.gif" alt="loading..." />
                )}
                {displayCount < articles.length && (
                    <div style={{ display: "grid", gridColumn: "span 3", justifyContent: "center", alignItems: "center", width: "100%", paddingTop: "30px" }}>
                        <button className="btn btn-dark" style={{ padding: "5px", boxShadow: "2px 2px 5px grey", fontWeight: "900" }} onClick={loadMore}>
                            Show More
                        </button>
                    </div>
                )}
            </div>

            <CommentsModal show={showCommentModal} onHide={() => setShowCommentModal(false)} articleId={selectedArticleId} />
        </>
    );
}
export default Home;
