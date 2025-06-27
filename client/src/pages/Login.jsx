import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login as apiLogin } from "../api";

function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await apiLogin(email, password);
            const payload = JSON.parse(atob(token.split('.')[1]));
            login({ token, role: payload.role });

            window.location = payload.role === 'manager' ? '/manager' : '/employee';
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form className="mx-auto" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center">Sign In</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>
    )
}

export default Login