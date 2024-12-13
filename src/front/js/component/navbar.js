import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        const userConfirmed = window.confirm(`Are you sure you want to Logout, ${store.username || "user"}?`);
        if (userConfirmed) {
            actions.logout();
            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between">
                <h1 className="text-warning fw-bold">My Private Profile Account</h1>
                <div>
                    {store.token ? (
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary mr-2">
                                Login
                            </Link>
                            <Link to="/" className="btn btn-secondary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
