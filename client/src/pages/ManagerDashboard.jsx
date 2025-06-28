import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, fetchVacations, approveVacation, rejectVacation, createUser, updateUser, deleteUser } from "../api";

function ManagerDashboard() {
    const { token, logout } = useContext(AuthContext);
    const [ users, setUsers ] = useState([]);
    const [ newUser, setNewUser ] = useState({
        username: '',
        email: '',
        password: '',
        role: 'employee',
        employee_code: ''
    })
    const [ editingUser, setEditingUser ] = useState({});
    const [ requests, setRequests ] = useState([]);
    const [ error, setError ] = useState('');
    const [ pwdModal, setPwdModal ] = useState({
        open: false,
        userId: null,
        value: ''
    })

    function openPwdModal(userId) {
        setPwdModal({
            open: true,
            userId,
            value: ''
        });
    }

    function closePwdModal() {
        setPwdModal({
            open: false,
            userId: null,
            value: ''
        });
    }
    
    useEffect(() => {
        fetchUsers(token).then(setUsers).catch(e => setError(e.message));
        fetchVacations(token).then(setRequests).catch(e => setError(e.message));
    }, [token]);

    const handleNewUserChange = (e) => {
        setNewUser(form => ({ ...form, [e.target.name]: e.target.value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const user = await createUser(token, newUser);
            setUsers(users => [...users, user]);
            setNewUser({
                username: '',
                email: '',
                password: '',
                role: 'employee',
                employee_code: ''
            });
        } catch (e) {
            setError(e.message);
        }
    };

    const handleEditUser = (userId, field, value) => {
        setEditingUser(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: value
            }
        }));
    };

    const handleUpdateUser = async (userId) => {
        const user = users.find(user => user.id === userId);
        const edited = editingUser[userId] || {};
        try {
            const updated = await updateUser(token, userId, {
                ...user,
                ...edited
            });
            setUsers(users => users.map(user => user.id === userId ? updated : user));
            setEditingUser(prev => {
                const newEditingUser = { ...prev };
                delete newEditingUser[userId];
                return newEditingUser
            });
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(token, userId);
            setUsers(users => users.filter(user => user.id !== userId));
        } catch (e) {
            setError(e.message);
        }
    };

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
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Manager Dashboard</h1>
                <button className="btn btn-outline-secondary" onClick={logout}>Sign Out</button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <p className="lead">Welcome, Manager! Here you'll see user lists and vacation requests to approve.</p>

            <section className="mb-5">
                <h2 className="h5 mb-3">Create User</h2>
                <form className="row g-3" onSubmit={handleCreateUser}>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            name="username"
                            value={newUser.username}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-control"
                            name="email"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-control"
                            name="password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            placeholder="Employee Code"
                            className="form-control"
                            name="employee_code"
                            value={newUser.employee_code}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button className="btn btn-primary w-100" type="submit">Create User</button>
                    </div>
                </form>
            </section>

            <section className="mb-5">
                <h2 className="h5 mb-3">Users</h2>
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Employee Code</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user =>
                                <tr key={user.id}>
                                    <td>
                                        <input
                                            className="form-control"
                                            value={editingUser[user.id] && editingUser[user.id].username !== undefined ? editingUser[user.id].username : user.username}
                                            onChange={e => handleEditUser(user.id, 'username', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            value={editingUser[user.id] && editingUser[user.id].email !== undefined ? editingUser[user.id].email : user.email}
                                            onChange={e => handleEditUser(user.id, 'email', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={editingUser[user.id] && editingUser[user.id].role !== undefined ? editingUser[user.id].role : user.role}
                                            onChange={e => handleEditUser(user.id, 'role', e.target.value)}
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="manager">Manager</option>
                                        </select>
                                    </td>
                                    <td> {user.employee_code} </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary me-1" onClick={() => openPwdModal(user.id)}>Change Password</button>
                                        <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdateUser(user.id)}>Save</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="h5 mb-3">Vacation Requests</h2>
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead className="table-light">
                            <tr>
                                {/* <th>User</th> */}
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request =>
                                <tr key={request.id}>
                                    {/* <td>{request.user.username}</td> */}
                                    <td>{request.start_date} </td>
                                    <td>{request.end_date}</td>
                                    <td>{request.reason}</td>
                                    <td>
                                        <span className={`badge ${
                                            request.status === 'approved' ? 'bg-success' :
                                            request.status === 'rejected' ? 'bg-danger' :
                                            'bg-secondary'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-success me-1" onClick={() => handleApprove(request.id)}>Approve</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(request.id)}>Reject</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            
            {pwdModal.open && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                >
                        <div className="custom-modal p-4 bg-white rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
                        <h5>Change Password</h5>
                        <input
                            type="password"
                            className="custom-modal p-4 bg-white rounded shadow"
                            placeholder="New Password"
                            value={pwdModal.value}
                            onChange={(e) => setPwdModal({ ...pwdModal, value: e.target.value })}
                        />
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary me-2" onClick={closePwdModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={ async () => {
                                try {
                                    await updateUser(token, pwdModal.userId, { password: pwdModal.value });
                                    closePwdModal();
                                } catch (e) {
                                    setError(e.message);
                                }
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerDashboard