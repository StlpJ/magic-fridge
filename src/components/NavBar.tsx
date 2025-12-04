import { useState } from "react";
import { Link, useLocation } from "react-router";
import "../styles/NavBar.css";
import logo from "../assets/images/logo.png";

export default function NavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const handleToggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const handleCloseMenu = () => {
		setIsMenuOpen(false);
	};

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className="global-nav">
			<Link to="/" className="nav-logo" onClick={handleCloseMenu}>
				<img src={logo} alt="logo" className="logo-image" />
			</Link>

			<button
				type="button"
				className={`burger-button ${isMenuOpen ? "burger-button--open" : ""}`}
				aria-label="Toggle navigation menu"
				onClick={handleToggleMenu}
			>
				<span className="burger-line" />
				<span className="burger-line" />
				<span className="burger-line" />
			</button>

			<ul className={`nav-links ${isMenuOpen ? "nav-links--open" : ""}`}>
				<li>
					<Link
						to="/blog"
						onClick={handleCloseMenu}
						className={`nav-link ${
							isActive("/blog") ? "nav-link--active" : ""
						}`}
					>
						Blog
					</Link>
				</li>
				<li>
					<Link
						to="/favorite"
						onClick={handleCloseMenu}
						className={`nav-link ${
							isActive("/favorite") ? "nav-link--active" : ""
						}`}
					>
						Favorites
					</Link>
				</li>
				<li>
					<Link
						to="/sign-up"
						onClick={handleCloseMenu}
						className={`nav-link ${isActive("/sign-up") ? "nav-link--active" : ""}`}
					>
						Sign up
					</Link>
				</li>
			</ul>
		</nav>
	);
}
