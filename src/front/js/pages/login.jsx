import React, { useState, useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export function Login() {
    const { actions } = useContext(Context);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleLogin = async (userEmailOrUsername, userPassword) => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://curly-capybara-5wp69779qr27xvp-3001.app.github.dev/api/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email_or_username: userEmailOrUsername,
                        password: userPassword,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al iniciar sesión:", errorData.message);
                if (isMounted.current) setLoading(false);
                return;
            }

            const data = await response.json();
            // console.log("Inicio de sesión exitoso:", data);

            const username = data.username || userEmailOrUsername;
            
            actions.setToken(data.token, username); 
            if (isMounted.current) navigate("/private");
        } catch (error) {
            console.error("Error en el fetch:", error);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await handleLogin(emailOrUsername, password);
    };

    return (
        <main className="d-flex vh-100 justify-content-center align-items-center">
            <form onSubmit={handleSubmit} className="w-50 p-4 border rounded">
                <div className="mb-4 text-center">
                    <h2>Login to your account</h2>
                    <p className="text-secondary">Enter your credentials below.</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="loginEmailOrUsername" className="form-label">
                        Email or Username
                    </label>
                    <input
                        value={emailOrUsername}
                        onChange={(event) => setEmailOrUsername(event.target.value)}
                        type="text"
                        className="form-control"
                        id="loginEmailOrUsername"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        className="form-control"
                        id="loginPassword"
                    />
                </div>
                <button type="submit" className="btn btn-warning fw-bold w-100 mb-3" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </button>
                <div>
                    <p>
                        ¿Don't have an account? <Link to="/" className="text-warning fw-bold">Sign-Up</Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
