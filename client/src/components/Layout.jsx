function Layout({ children }) {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container">
                    <a className="navbar-brand" href="/">Vacation Portal</a>
                </div>
            </nav>
            <main className="container">
                {children}
            </main>
            <footer className="footer mt-auto py-3 bg-light">
                <div className="container text-center">
                    <small>© 2025 Your Company</small>
                </div>
            </footer>
        </>
    );
}

export default Layout;