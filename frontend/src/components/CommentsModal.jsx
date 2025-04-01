import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteComment, GetAllCommentsForArticle, PostNewComment } from "../services/commentsService";
import { useParams } from "react-router-dom";
import "../CSS/comments.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";

function CommentsModal({ show, onHide, articleId }) {
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decode = jwtDecode(token);
            setUserId(decode.profile_id);
            setIsAdmin(decode.isadmin);
        }
    }, []);

    useEffect(() => {
        if (articleId) {
            GetAllCommentsForArticle(articleId)
                .then((res) => {
                    setComments(res);
                })
                .catch((error) => console.log(error));
        }
    }, [articleId]);

    const formik = useFormik({
        initialValues: {
            text: "",
            reply_to: null,
        },
        validationSchema: yup.object({
            text: yup.string().min(2, "Comment must contain at least 2 characters"),
        }),
        onSubmit: (values, { resetForm }) => {
            PostNewComment(values, articleId)
                .then(() => {
                    resetForm();
                    setReplyingTo(null);
                    return GetAllCommentsForArticle(articleId);
                })
                .then((res) => {
                    setComments(res);
                })
                .catch((error) => console.log(error.response?.data));
        },
    });

    const buildCommentTree = (comments) => {
        const tree = [];
        const map = {};

        comments.forEach((comment) => {
            map[comment.id] = { ...comment, replies: [] };
        });

        comments.forEach((comment) => {
            if (comment.reply_to) {
                map[comment.reply_to].replies.push(map[comment.id]);
            } else {
                tree.push(map[comment.id]);
            }
        });

        return tree;
    };

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.id}>
                <div
                    className="cmnt"
                    style={{
                        backgroundColor: "rgb(243, 243, 243)",
                        borderRadius: "15px",
                        boxShadow: "1px 1px 2px grey",
                        margin: "5px",
                        border: replyingTo === comment.id ? "2px solid #007bff" : "none",
                        marginLeft: comment.reply_to ? "20px" : "0",
                        padding: "5px",
                        paddingBottom: "0px",
                    }}
                >
                    <p style={{ fontSize: "0.7em" }}>
                        <strong>{comment.author_username}</strong>
                    </p>
                    <p>{comment.text}</p>

                    <div className="commnetDets" style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "start", paddingLeft: "5px", paddingRight: "5px" }}>
                        <div className="commentTime" style={{ padding: "0", width: "100%", display: "flex", justifyContent: "end", color: "grey" }}>
                            <p>{comment.time_since_created}</p>
                        </div>
                        <div className="commentBtns" style={{ display: "flex", gap: "8px", paddingLeft: "5px" }}>
                            <i
                                onClick={() => {
                                    formik.setFieldValue("reply_to", comment.id);
                                    setReplyingTo(comment.id);
                                }}
                                className="fa-solid fa-reply"
                            ></i>
                            {(userId === comment.author_id || isAdmin === true) && <i className="fa-solid fa-trash" onClick={() => handleDeleteComment(comment.id)}></i>}
                        </div>
                    </div>
                </div>
                {comment.replies && comment.replies.length > 0 && <div style={{ marginLeft: "20px" }}>{renderComments(comment.replies)}</div>}
            </div>
        ));
    };

    const handleDeleteComment = (commentId) => {
        DeleteComment(commentId)
            .then(() => {
                setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
            })
            .catch((error) => {
                console.error("Full error:", error);
            });
    };

    const commentTree = comments && comments.length > 0 ? buildCommentTree(comments) : [];

    return (
        <div className="custom-modal-container">
            <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-bottom-right">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "230px", overflow: "auto" }}>{commentTree && commentTree.length > 0 ? renderComments(commentTree) : <p>Be the first to comment!</p>}</Modal.Body>
                <Modal.Footer>
                    <div className="new-comment" style={{ width: "100%", display: "flex", gap: "5px" }}>
                        <form onSubmit={formik.handleSubmit} style={{ width: "100%", display: "flex", gap: "5px" }}>
                            <div className="form-floating" style={{ width: "95%" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="New Comment"
                                    name="text"
                                    value={formik.values.text}
                                    onChange={formik.handleChange}
                                    style={{
                                        border: replyingTo ? "2px solid #007bff" : "none",
                                    }}
                                />
                                <label htmlFor="floatingInput">New Comment</label>
                            </div>
                            <button className="btn btn-dark" type="submit" style={{ width: "60px" }}>
                                <i className="fa-solid fa-arrow-up"></i>
                            </button>
                        </form>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CommentsModal;
