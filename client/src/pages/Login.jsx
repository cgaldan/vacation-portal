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
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            {error && <div className="error">{error}</div>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    )
}

export default Login