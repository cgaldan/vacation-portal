import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchVacations, createVacation, deleteVacation } from "../api";

function EmployeeDashboard() {
    const { token, logout } = useContext(AuthContext);
    const [ requests, setRequests ] = useState([]);
    const [ form , setForm ] = useState({
        start_date: '',
        end_date: '',
        reason: ''
    })
    const [ error, setError ] = useState('');

    useEffect(() => {
        fetchVacations(token).then(setRequests).catch(e => setError(e.message));
    }, [token]);

    const handleChange = (e) => {
        setForm(form => ({ ...form, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newRequest = await createVacation(token, form);
            setRequests(reqs => [newRequest, ...reqs]);
            setForm({
                start_date: '',
                end_date: '',
                reason: ''
            })
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDelete = async (vacationId) => {
        try {
            await deleteVacation(token, vacationId);
            setRequests(reqs => reqs.filter(request => request.id !== vacationId));
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Employee Dashboard</h1>
            {error && <div className="error">{error}</div>}
            <p>Welcome, Employee! Here you'll see your vacation requests and can submit new ones.</p>

            <section>
                <h2>Vacation Requests</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="date"
                        name="start_date"
                        placeholder="Start Date"
                        value={form.start_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="end_date"
                        placeholder="End Date"
                        value={form.end_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="reason"
                        placeholder="Reason"
                        value={form.reason}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Request</button>
                </form>
            </section>

            <section>
                <h2>Your Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(request => (
                            <tr key={request.id}>
                                <td>{request.start_date} → {request.end_date}</td>
                                <td>{request.reason}</td>
                                <td>{request.status}</td>
                                <td>
                                    {request.status === 'pending' && (
                                        <button onClick={() => handleDelete(request.id)}>Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <button onClick={logout}>Sign Out</button>
        </div>
    );
}

export default EmployeeDashboard