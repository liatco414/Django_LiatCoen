import { useState } from "react";
import { NavLink } from "react-router-dom";

function NavBar({ onSearchChange }) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        onSearchChange(event.target.value);
    };

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
                height: "80px",
                boxShadow: "1px 1px 5px black",
            }}
        >
            <div className="container-fluid">
                {/* אייקון הבית */}
                <NavLink className="navbar-brand" to="/">
                    <i className="fa-solid fa-house"></i>
                </NavLink>

                {/* כפתור תפריט למובייל */}
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

                {/* אלמנטים בתוך ה-collapse */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/about">
                                About
                            </NavLink>
                        </li>
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

                    {/* קישורים נוספים */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/register">
                                Register
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login">
                                Login
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
