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
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Employee Dashboard</h1>
                <button className="btn btn-outline-secondary" onClick={logout}>Sign Out</button>
            </div>

            {error && <div className="error">{error}</div>}
            <p className="lead">Welcome, Employee! Here you'll see your vacation requests and can submit new ones.</p>

            <section className="mb-5">
                <h2 className="h5 mb-3">Vacation Requests</h2>
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-3">
                        <input
                            type="date"
                            name="start_date"
                            placeholder="Start Date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            name="end_date"
                            placeholder="End Date"
                            value={form.end_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="reason"
                            placeholder="Reason"
                            value={form.reason}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-primary w-100" type="submit">Request</button>
                    </div>
                </form>
            </section>

            <section>
                <h2 className="h5 mb-3">Your Requests</h2>
                <div className="table-responsive">
                    <table  className="table table-striped align-middle">
                        <thead className="table-light">
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
                                    <td className={`badge ${
                                        request.status === 'approved' ? 'bg-success' :
                                        request.status === 'rejected' ? 'bg-danger' :
                                        'bg-secondary'
                                    }`}>{request.status}</td>
                                    <td>
                                        {request.status === 'pending' && (
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(request.id)}>Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
        </div>
    );
}

export default EmployeeDashboard