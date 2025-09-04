// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import React from 'react';
import './App.css';

// Import components (will be created in the next steps)
import HomePage from './components/HomePage';
import BookListPage from './components/BookListPage.tsx';
import AddBookPage from './components/AddBookPage.tsx';
import BookDetailPage from './components/BookDetailPage.tsx';
import LoginPage from './components/LoginPage.tsx';
import SignupPage from './components/SignupPage.tsx';

// Private Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <>{children}</> : null;
};

const AppContent = () => {
    const { isAuthenticated, logout } = useAuth();
    return (
        <div className="main-container">
            <header>
                <h1>Book Reviews</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/books">Books</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/add-book">Add Book</Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Signup</Link>
                        </>
                    )}
                </nav>
            </header>
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<BookListPage />} />
                    <Route path="/books/:id" element={<BookDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                        path="/add-book"
                        element={
                            <ProtectedRoute>
                                <AddBookPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;