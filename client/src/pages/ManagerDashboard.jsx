import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, fetchVacations, approveVacation, rejectVacation } from "../api";

function ManagerDashboard() {
    const { token, logout } = useContext(AuthContext);
    const [ users, setUsers ] = useState([]);
    const [ requests, setRequests ] = useState([]);
    const [ error, setError ] = useState('');
    
    useEffect(() => {
        fetchUsers(token).then(setUsers).catch(e => setError(e.message));
        fetchVacations(token).then(setRequests).catch(e => setError(e.message));
    }, [token]);

    const handleApprove = async (vacationId) => {
        try {
            const updated = await approveVacation(token, vacationId);
            setRequests(reqs => reqs.map(request => request.id === vacationId ? updated : request));
        } catch (e) {
            setError(e.message);
        }
    };

    const handleReject = async (vacationId) => {
        try {
            const updated = await rejectVacation(token, vacationId);
            setRequests(reqs => reqs.map(request => request.id === vacationId ? updated : request));
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Manager Dashboard</h1>
            {error && <div className="error">{error}</div>}
            <p>Welcome, Manager! Here you'll see user lists ans vacation requests to approve.</p>

            <section>
                <h2>Users</h2>
                <ul>
                    {users.map(user =>
                        <li key={user.id}>
                            <span>{user.username}</span>
                            <span>{user.email}</span>
                            <span>{user.role}</span>
                            <span>{user.employee_code}</span>
                        </li>
                    )}
                </ul>
            </section>

            <section>
                <h2>Vacation Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request =>
                            <tr key={request.id}>
                                <td>{users.find(user => user.id === request.user_id)?.username || request.user_id}</td>
                                <td>{request.start_date} → {request.end_date}</td>
                                <td>{request.reason}</td>
                                <td>{request.status}</td>
                                <td>
                                    <button onClick={() => handleApprove(request.id)}>Approve</button>
                                    <button onClick={() => handleReject(request.id)}>Reject</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
            <button onClick={logout}>Sign Out</button>
        </div>
    );
}

export default ManagerDashboard