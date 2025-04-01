import { useParams } from "react-router-dom";
import { GetArticleById } from "../services/articlesServices";
import { useEffect, useState } from "react";

function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        GetArticleById(id)
            .then((response) => {
                setArticle(response);
            })
            .catch((error) => {
                console.log("Error fetching article:", error);
            });
    }, [id]);

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div
            className="article-page"
            style={{
                color: "white",
                padding: "90px",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.77)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1 style={{ fontWeight: "900" }}>{article.title}</h1>
            <h2>{article.subtitle}</h2>
            <p style={{ fontSize: "1.2em" }}>{article.text}</p>
            <img style={{ width: "100%", height: "600px" }} src={article.image_url || null} alt={article.title} />
        </div>
    );
}

export default ArticlePage;
