import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const signUp = async (email, password, username, name, birthdate, country) => {
        setLoading(true);
        try {

            const formattedBirthdate = birthdate ? new Date(birthdate).toLocaleDateString('en-GB') : null;

            const response = await fetch('https://curly-capybara-5wp69779qr27xvp-3001.app.github.dev/api/signup', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    name,
                    birthdate: formattedBirthdate,
                    country,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al registrarse:", errorData.message);
                setLoading(false);
                return;
            }

            const data = await response.json();
            // console.log("Registro exitoso:", data);

            setTimeout(() => {
                setLoading(false);
                navigate("/login"); 
            }, 1000);
        } catch (error) {
            console.error("Error en el fetch:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!email || !username || !password || !confirmPassword) {
            alert("Email, username, and password are required.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            alert("Account created successfully!");
            setLoading(false);
        }, 2000);



        await signUp(email, password, username, name, birthdate, country);
    };

    return (
        <main className="d-flex vh-100 justify-content-center align-items-center">
            <form onSubmit={handleSubmit} className="w-50 p-4 border rounded">
                <div className="mb-4 text-center">
                    <h2>Create Your Account</h2>
                    <p className="text-secondary">Fields marked with * are required.</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email *
                    </label>
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        className="form-control"
                        id="email"
                        required
                    />
                    <div id="emailHelp" className="text-secondary">
                        Enter the email address you wish to use for your account.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username *
                    </label>
                    <input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        type="text"
                        className="form-control"
                        id="username"
                        required
                    />
                    <div id="emailHelp" className="text-secondary">
                        Enter your unique username that you want to use for your account.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password *
                    </label>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        className="form-control"
                        id="password"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password *
                    </label>
                    <input
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Full Name
                    </label>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        type="text"
                        className="form-control"
                        id="name"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="birthdate" className="form-label">
                        Birthdate
                    </label>
                    <input
                        value={birthdate}
                        onChange={(event) => setBirthdate(event.target.value)}
                        type="date"
                        className="form-control"
                        id="birthdate"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                        Country
                    </label>
                    <input
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        type="text"
                        className="form-control"
                        id="country"
                    />
                </div>
                <button type="submit" className="btn btn-warning fw-bold w-100 mb-3" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign-Up"}
                </button>
                <div className="text-center">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-warning fw-bold">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
};