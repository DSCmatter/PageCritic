// src/App.tsx

import { useEffect, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useAuth } from "./hooks/useAuth.ts";
import "./App.css";

// Import Layouts
import { AdminLayout } from "./layouts.tsx/AdminLayout.tsx";
import { UserLayout } from "./layouts.tsx/UserLayout.tsx";
import { AuthLayout } from "./layouts.tsx/AuthLayout.tsx";

// Import components (will be created in the next steps)
import { HomePage } from "./components/HomePage";
import { BookListPage } from "./components/BookListPage.tsx";
import { AddBookPage } from "./components/AddBookPage.tsx";
import { BookDetailPage } from "./components/BookDetailPage.tsx";
import { LoginPage } from "./components/LoginPage.tsx";
import { SignupPage } from "./components/SignupPage.tsx";
import { AboutUs } from "./components/AboutUs.tsx";
import { ReviewsPage } from "./components/ReviewsPage.tsx";
import { ErrorPage } from "./components/ErrorPage.tsx";

// Private Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	return isAuthenticated ? <>{children}</> : <ErrorPage/>;
};

const AppContent = () => {
	// const { isAuthenticated, logout } = useAuth();

	return (
		<>
			<Routes>
				<Route element={<UserLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/books" element={<BookListPage />} />
					<Route path="/reviews" element={<ReviewsPage />} />
					<Route path="/aboutus" element={<AboutUs />} />
					<Route path="/books/:id" element={<BookDetailPage />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
				</Route>
				<Route
					path="/add-book"
					element={
						<ProtectedRoute>
							<AddBookPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
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
