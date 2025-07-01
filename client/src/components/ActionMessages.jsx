import { useState, useEffect } from "react";

function ActionMessages() {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <div>
            { success && <div className="alert alert-success"><strong>{success}</strong></div> }
            { error && <div className="alert alert-danger"><strong>{error}</strong></div> }
        </div>
    );
}

export default ActionMessages;