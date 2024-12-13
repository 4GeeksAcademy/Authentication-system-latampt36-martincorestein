import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

export function Private() {
    const {actions } = useContext(Context);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            
            const savedToken = localStorage.getItem("token");
            // console.log("Token en useEffect:", savedToken);

            if (!savedToken) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("https://curly-capybara-5wp69779qr27xvp-3001.app.github.dev/api/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${savedToken}`,
                    },
                });

                if (!response.ok) {
                    setError("Token no válido o expirado. Por favor, vuelve a iniciar sesión.");
                    setLoading(false);
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Hubo un problema al obtener los datos. Intenta de nuevo.");
                setLoading(false);
                navigate("/login");  
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    }

    if (error) {
        return <div className="d-flex justify-content-center align-items-center vh-100">Error: {error}</div>;
    }

    return (
        <main className="container mt-5">
            <div className="card bg-black shadow-lg p-4 rounded-3 border">
                <h1 className="text-center mb-4 text-danger">{user.username || "No userName provided"}</h1><h1 className="text-center mb-4 text-warning"> Private Profile</h1>
                {user ? (
                    <div>
                        <div className="d-flex justify-content-center mb-3">
                            <img
                                src={`https://avatar.iran.liara.run/public/${user.id}`} 
                                alt="User Avatar"
                                className="rounded-circle"
                                width="120"
                                height="120"
                            />
                        </div>
                        <div className="mb-3">
                            <strong className="text-warning">Name:</strong> {user.name || "No name provided"}
                        </div>
                        <div className="mb-3">
                            <strong className="text-warning">Email:</strong> {user.email}
                        </div>
                        <div className="mb-3">
                            <strong className="text-warning">Birthdate:</strong> {user.birthdate || "Not provided"}
                        </div>
                        <div className="mb-3">
                            <strong className="text-warning">Country:</strong> {user.country || "Not provided"}
                        </div>
                        <div className="text-center">
                            <button
                                className="btn btn-warning fw-bold"
                                onClick={() =>  {
                                    const userConfirmed = window.confirm(`Are you sure you want to Logout, ${user.username || "user"}?`);
                                    if (userConfirmed) {
                                        actions.logout();
                                        navigate("/login");
                                    }
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-danger">Failed to load user data.</p>
                )}
            </div>
        </main>
    );
}
