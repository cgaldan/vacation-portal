const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.token && { Authorization: `Bearer ${options.token}` })
        },
        ...options
    });

    if (response.status === 204) return null;

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || response.statusText);
    return data;
}

async function login(identifier, password) {
    return request('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
    });
}

async function fetchUsers(token) {
    return request('/api/users/', { token });
}

async function createUser(token, user) {
    return request('/api/users/', {
        method: 'POST',
        token,
        body: JSON.stringify(user)
    });
}

async function updateUser(token, userId, user) {
    return request(`/api/users/${userId}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(user)
    });
}

async function deleteUser(token, userId) {
    return request(`/api/users/${userId}`, {
        method: 'DELETE',
        token
    });
}

async function fetchVacations(token) {
    return request('/api/vacations/', { token });
}

async function createVacation(token, vacation) {
    return request('/api/vacations/', {
        method: 'POST',
        token,
        body: JSON.stringify(vacation)
    });
}

async function deleteVacation(token, vacationId) {
    return request(`/api/vacations/${vacationId}`, {
        method: 'DELETE',
        token
    });
}

async function approveVacation(token, vacationId) {
    return request(`/api/vacations/${vacationId}/approve`, {
        method: 'POST',
        token
    });
}

async function rejectVacation(token, vacationId) {
    return request(`/api/vacations/${vacationId}/reject`, {
        method: 'POST',
        token
    });
}

export {
    login,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchVacations,
    createVacation,
    deleteVacation,
    approveVacation,
    rejectVacation
};