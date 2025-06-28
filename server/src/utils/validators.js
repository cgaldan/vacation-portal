function validateEmployeeCode(code) {
    return /^\d{7}$/.test(code);
}

export { validateEmployeeCode }