function validateEmployeeCode(code) {
    return /^\d{7}$/.test(code);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
}

export { validateEmployeeCode, validatePassword };