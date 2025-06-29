import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    token: null,
    role: null,
    userId: null,
    login: async () => {},
    logout: () => {}
});


function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const login = async ({ token, role }) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('token', token);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('userId', payload.sub);
        setToken(token);
        setRole(role);
        setUserId(payload.sub);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setToken(null);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };