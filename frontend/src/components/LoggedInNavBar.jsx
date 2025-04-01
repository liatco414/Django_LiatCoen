import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";

function LoggedInNavBar({ setShowLogOutModal, onSearchChange }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const token = localStorage.getItem("token");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        onSearchChange(event.target.value);
    };

    useEffect(() => {
        if (token) {
            const decodeToken = jwtDecode(token);
            setIsAdmin(decodeToken.isadmin);
            setUserId(decodeToken.profile_id);
        }
    }, [token]);

    return (
        <nav
            className="navbar navbar-expand-lg bg-body-tertiary"
            style={{
                width: "100%",
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "1000",
                boxShadow: "1px 1px 5px black",
            }}
        >
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <i className="fa-solid fa-house"></i>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* כאן נמצא התפריט שיתכווץ במסך קטן */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/about">
                                About
                            </NavLink>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" aria-current="page" to="/drafts">
                                        Draft Articles
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" aria-current="page" to="/archives">
                                        Archive Articles
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* חיפוש */}
                    <form className="d-flex" role="search">
                        <div className="input-group">
                            <input className="form-control" type="search" placeholder="Search" aria-label="Search" onChange={handleInputChange} />
                            <span className="input-group-text">
                                <button className="btn" type="submit">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </span>
                        </div>
                    </form>

                    {/* אפשרויות משתמש */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Button style={{ color: "black", textDecoration: "none" }} variant="link" onClick={() => setShowLogOutModal(true)}>
                                Log-Out
                            </Button>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={`/user-profile/${userId}`}>
                                <i className="fa-solid fa-user"></i>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default LoggedInNavBar;
