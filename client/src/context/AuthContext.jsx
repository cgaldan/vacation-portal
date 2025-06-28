import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    token: null,
    role: null,
    login: async () => {},
    logout: () => {}
});


function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const login = async ({ token, role }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setToken(token);
        setRole(role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };