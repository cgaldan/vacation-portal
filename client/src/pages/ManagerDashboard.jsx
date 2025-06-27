import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ManagerDashboard() {
    const { logout } = useContext(AuthContext);
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Manager Dashboard</h1>
            <p>Welcome, Manager! Here you'll see user lists ans vacation requests to approve.</p>
            <button onClick={logout}>Sign Out</button>
        </div>
    );
}

export default ManagerDashboard