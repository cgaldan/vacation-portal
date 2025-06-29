function Layout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div className="container">
                    <a className="navbar-brand" href="/">Vacation Portal</a>
                </div>
            </nav>
            <main className="flex-grow-1">
                {children}
            </main>
            <footer className="d-flex flex-wrap justify-content-between bg-light align-items-center py-3 my-4  border-top">
                <div className="container text-center">
                    <span className="mb-3 mb-md-0 text-body-secondary pd-3 align-items-center">© 2025 Vacation Portal</span>
                </div>
            </footer>
        </div>
    );
}

export default Layout;