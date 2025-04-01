import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/footer.css";

function Footer() {
    let isAdmin, profileId;
    let token = localStorage.getItem("token");
    if (token) {
        let decoded = jwtDecode(token);
        isAdmin = decoded.isadmin;
        profileId = decoded.profile_id;
    }

    return (
        <>
            <div className="footer">
                <div className="content">
                    <div className="icon1">
                        <Link className="link" to="/about">
                            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "1.4em" }}></i>
                            <p>About</p>
                        </Link>
                    </div>
                    <div className="icon2">
                        <Link className="link" to="mailto:liat667788@gmail.com">
                            <i className="fa-solid fa-envelope" style={{ fontSize: "1.4em" }}></i>
                            <p>Contact</p>
                        </Link>
                    </div>
                    {token && (
                        <div className="icon3">
                            <Link className="link" to={`/user-profile/${profileId}`}>
                                <i className="fa-solid fa-address-card" style={{ fontSize: "1.4em" }}></i>
                                <p>Profile</p>
                            </Link>
                        </div>
                    )}
                    {isAdmin === true && (
                        <div className="admin">
                            <div className="icon4">
                                <Link className="link" to="/drafts">
                                    <i className="fa-regular fa-file" style={{ fontSize: "1.4em" }}></i>
                                    <p>Drafts</p>
                                </Link>
                            </div>
                            <div className="icon5">
                                <Link className="link" to="/archives">
                                    <i className="fa-solid fa-box-archive" style={{ fontSize: "1.4em" }}></i>
                                    <p>Archives</p>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Footer;
