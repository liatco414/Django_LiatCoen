import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./components/LogIn";
import { useEffect, useState } from "react";
import LoggedInNavBar from "./components/LoggedInNavBar";
import Home from "./components/Home";
import LogOutModal from "./components/LogOutModal";
import FullArticle from "./components/FullArticle";
import CommentsModal from "./components/CommentsModal";
import PostArticle from "./components/PostArticle";
import { jwtDecode } from "jwt-decode";
import Register from "./components/Register";
import UpdateArticle from "./components/EditArticle";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/Profile";
import EditProfileInfo from "./components/EditProfileInfo";
import DraftArticles from "./components/DraftArticles";
import ArchivedArticles from "./components/ArchivedArticles";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogOutModal, setShowLogOutModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodeToken = jwtDecode(token);
            setIsLoggedIn(true);
            setIsAdmin(decodeToken.isadmin);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    let handleLogOutModal = () => {
        setShowLogOutModal(!showLogOutModal);
    };

    let handleCommentModal = () => {
        setShowCommentModal(!showCommentModal);
    };

    let handleUserLogOut = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        setShowLogOutModal(false);
        window.location.href = "/";
    };

    return (
        <>
            <div className="body">
                <ToastContainer />
                {isLoggedIn && <CommentsModal show={showCommentModal} onHide={() => setShowCommentModal(false)} />}

                <BrowserRouter>
                    {isLoggedIn ? (
                        <>
                            <LoggedInNavBar setShowLogOutModal={handleLogOutModal} onSearchChange={handleSearchChange} />
                            <Routes>
                                <Route path="/" element={<Home setShowCommentModal={setShowCommentModal} showCommentModal={showCommentModal} searchTerm={searchTerm} />} />
                                <Route path="/articles/:id" element={<FullArticle />} />
                                <Route path="/api/articles/:id/comments" element={<CommentsModal show={showCommentModal} onHide={() => setShowCommentModal(false)} />} />
                                <Route path="/post-article" element={<PostArticle />} />
                                <Route path="/edit-article/:articleId" element={<UpdateArticle />} />
                                <Route path="/user-profile/:profileId" element={<UserProfile />} />
                                <Route path="/edit-profile/:profileId" element={<EditProfileInfo />} />
                                <Route path="/drafts" element={<DraftArticles />} />
                                <Route path="/archives" element={<ArchivedArticles />} />
                                <Route path="/about" element={<About />} />
                            </Routes>
                        </>
                    ) : (
                        <>
                            <NavBar onSearchChange={handleSearchChange} />
                            <Routes>
                                <Route path="/" element={<Home setShowCommentModal={setShowCommentModal} showCommentModal={showCommentModal} searchTerm={searchTerm} />} />
                                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                                <Route path="/articles/:id" element={<FullArticle />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/about" element={<About />} />
                            </Routes>
                        </>
                    )}
                    <Footer />
                </BrowserRouter>

                <LogOutModal show={showLogOutModal} onHide={handleLogOutModal} handleLogOut={handleUserLogOut} />
            </div>
        </>
    );
}

export default App;
