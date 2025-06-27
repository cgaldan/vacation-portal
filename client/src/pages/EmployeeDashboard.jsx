import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function EmployeeDashboard() {
    const { logout } = useContext(AuthContext);
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Employee Dashboard</h1>
            <p>Welcome, Employee! Here you'll see your vacation requests and can submit new ones.</p>
            <button onClick={logout}>Sign Out</button>
        </div>
    );
}

export default EmployeeDashboard