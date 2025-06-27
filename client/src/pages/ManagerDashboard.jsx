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
        <div style={{ padding: "2rem" }}>
            <h1>Manager Dashboard</h1>
            {error && <div className="error">{error}</div>}
            <p>Welcome, Manager! Here you'll see user lists ans vacation requests to approve.</p>

            <section>
                <h2>Create User</h2>
                <form onSubmit={handleCreateUser}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={newUser.username}
                        onChange={handleNewUserChange}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={newUser.email}
                        onChange={handleNewUserChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={newUser.password}
                        onChange={handleNewUserChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Employee Code"
                        name="employee_code"
                        value={newUser.employee_code}
                        onChange={handleNewUserChange}
                        required
                    />
                    <button type="submit">Create User</button>
                </form>
            </section>

            <section>
                <h2>Users</h2>
                <table>
                    <thead>
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
                                        value={editingUser[user.id] && editingUser[user.id].username !== undefined ? editingUser[user.id].username : user.username}
                                        onChange={e => handleEditUser(user.id, 'username', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        value={editingUser[user.id] && editingUser[user.id].email !== undefined ? editingUser[user.id].email : user.email}
                                        onChange={e => handleEditUser(user.id, 'email', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        value={editingUser[user.id] && editingUser[user.id].role !== undefined ? editingUser[user.id].role : user.role}
                                        onChange={e => handleEditUser(user.id, 'role', e.target.value)}
                                    />
                                </td>
                                <td> {user.employee_code} </td>
                                <td>
                                    <button onClick={() => openPwdModal(user.id)}>Change Password</button>
                                    <button onClick={() => handleUpdateUser(user.id)}>Save</button>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            <section>
                <h2>Vacation Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
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
            {pwdModal.open}
                <div className="modal-backdrop" style ={{ display: pwdModal.open ? 'flex' : 'none' }}>
                    <div className="modal">
                        <h3>Change Password</h3>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={pwdModal.value}
                            onChange={(e) => setPwdModal({ ...pwdModal, value: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <button onClick={ async () => {
                                try {
                                    await updateUser(token, pwdModal.userId, { password: pwdModal.value });
                                    closePwdModal();
                                } catch (e) {
                                    setError(e.message);
                                }
                            }}>Confirm</button>
                            <button onClick={closePwdModal}>Cancel</button>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default ManagerDashboard