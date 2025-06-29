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
        <div className="modal modal-sheet position-static d-block p-4 py-md-5" tabindex="-1" role="dialog" id="modalSignin">
            <div className="modal-dialog">
                <div className="modal-content rounded-4 shadow">                    
                    <div className="modal-body p-5 pt-0">
                        <form className="mx-auto" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
                            <div className="p-5 pb-4 border-bottom-0">
                                <h1 className="fw-bold mb-4 fs-2 text-center">Sign In</h1>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <input
                                    type="identifier"
                                    className="form-control rounded-3"
                                    placeholder="Email or Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control rounded-3"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login