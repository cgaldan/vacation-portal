import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUsers, fetchVacations, approveVacation, rejectVacation, createUser, updateUser, deleteUser } from "../api";

function ManagerDashboard() {
    const { token,  userId, logout } = useContext(AuthContext);
    const [ myProfile, setMyProfile ] = useState({
        username: '',
        email: '',
        employee_code: ''
    });
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
    const [ success, setSuccess ] = useState('');
    const [ pwdModal, setPwdModal ] = useState({
        open: false,
        userId: null,
        value: ''
    })
    const currentId = Number(userId);

    const showError = (message) => {
        setSuccess(null);
        setError(message);
    };

    const showSuccess = (message) => {
        setError(null);
        setSuccess(message);
    };

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => {
            setError(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => {
            setSuccess(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [success]);

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
        if (!currentId) return;
        fetchUsers(token).then(fetched => {
            setUsers(fetched);
            const me = fetched.find(user => user.id === currentId);
            if (me) {
                setMyProfile({
                    username: me.username,
                    email: me.email,
                    employee_code: me.employee_code
                });
            }
        }).catch(e => showError(e.message));
    }, [token]);

    const handleProfileChange = (e) => {
        setMyProfile(form => ({ ...form, [e.target.name]: e.target.value }));
    };

    const handleProfileSave = async e => {
        e.preventDefault();
        try {
            const updated = await updateUser(token, currentId, {
                username: myProfile.username,
                email: myProfile.email,
            });
            setUsers(users => users.map(user => user.id === currentId ? updated : user));
            setMyProfile({
                username: updated.username,
                email: updated.email,
                employee_code: updated.employee_code
            });
            showSuccess('Profile updated successfully!');
        } catch (e) {
            showError(e.message);
        }
    };
    
    useEffect(() => {
        fetchUsers(token).then(setUsers).catch(e => showError(e.message));
        fetchVacations(token).then(setRequests).catch(e => showError(e.message));
    }, [token]);

    const visibleUsers = users.filter(user => user.id !== currentId);

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
            showSuccess('User created successfully!');
        } catch (e) {
            showError(e.message);
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
            showSuccess('User updated successfully!');
        } catch (e) {
            showError(e.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(token, userId);
            setUsers(users => users.filter(user => user.id !== userId));
            showSuccess('User deleted successfully!');
        } catch (e) {
            showError(e.message);
        }
    };

    const handleApprove = async (vacationId) => {
        try {
            const updated = await approveVacation(token, vacationId);
            setRequests(reqs => reqs.map(request => request.id === vacationId ? updated : request));
        } catch (e) {
            showError(e.message);
        }
    };

    const handleReject = async (vacationId) => {
        try {
            const updated = await rejectVacation(token, vacationId);
            setRequests(reqs => reqs.map(request => request.id === vacationId ? updated : request));
        } catch (e) {
            showError(e.message);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Manager Dashboard</h1>
                <button className="btn btn-outline-secondary" onClick={logout}>Sign Out</button>
            </div>
            <div>
                {success && (
                    <div className="alert alert-success" role="alert">
                        <strong>{success}</strong>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger" role="alert">   
                        {error === "weak password" ? (
                            <>    
                                <strong>The password is weak and must contain at least:</strong>
                                <ul className="mb-0">
                                    <li>8 characters</li>
                                    <li>One uppercase letter</li>
                                    <li>One lowercase letter</li>
                                    <li>One number</li>
                                    <li>One special character</li>
                                </ul>
                            </>
                    ) : (
                        <strong>{error}</strong>
                    )}
                    </div>
                )}
            </div>
            <p className="lead">Welcome, Manager! Here you'll see user lists and vacation requests to approve.</p>
            <section className="mb-5">
                <h2 className="h5 mb-3">My Profile</h2>
                <div className="card">
                    <div className="card-body">
                        {users.filter(user => user.id === currentId).map(user => (
                            <form key={user.id} className="row g-3" onSubmit={handleProfileSave}>
                                <div className="col-md-3">
                                    <input
                                        className="form-control"
                                        name="username"
                                        value={myProfile.username}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={myProfile.email}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        className="form-control"
                                        name="employee_code"
                                        value={myProfile.employee_code}
                                        disabled
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-sm btn-secondary me-1" type="button" onClick={() => openPwdModal(user.id)}>Change Password</button>
                                    <button className="btn btn-primary" type="submit">Save</button>
                                </div>
                            </form>
                        ))}
                    </div>
                </div>
            </section>
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
                            {visibleUsers.map(user => {
                                const isSelf = user.id === userId;
                                return (
                                    <tr key={user.id} className={isSelf ? 'table-secondary' : ''}>
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
                                );
                            })}
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
                        <div className="custom-modal p-4 bg-white rounded-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="modal-header border-bottom-0">
                            <h1 className="modal-title fs-5">Change Password</h1>
                            <button type="button" className="btn-close" onClick={closePwdModal}></button>
                        </div>
                        <div className="modal-body py-0 pt-3">
                            <input
                                type="password"
                                className="custom-modal p-4 bg-white rounded shadow"
                                placeholder="New Password"
                                value={pwdModal.value}
                                onChange={(e) => setPwdModal({ ...pwdModal, value: e.target.value })}
                            />
                        </div>
                        <div className="modal-footer border-top-0 gap-2 mb-2 mt-3">
                            <button className="btn btn-primary" onClick={ async () => {
                                try {
                                    await updateUser(token, pwdModal.userId, { password: pwdModal.value });
                                    closePwdModal();
                                } catch (e) {
                                    setError(e.message);
                                }
                            }}>Confirm</button>
                            <button className="btn btn-secondary me-2" onClick={closePwdModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerDashboard