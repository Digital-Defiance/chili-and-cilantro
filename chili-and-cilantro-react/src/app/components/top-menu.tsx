import { faPepperHot, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chiliCilantroSymbol from '../../assets/images/Chili-and-Cilantro.png';
import { AuthContext } from '../auth-provider';
import { GameMenuOption, useMenu } from '../menu-context';
import './top-menu.scss';

const TopMenu: React.FC = () => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const { gameOptions } = useMenu();
  const [, setRender] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gameDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRender((prev) => prev + 1);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        gameDropdownRef.current &&
        !gameDropdownRef.current.contains(event.target as Node)
      ) {
        setGameDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="top-menu">
      <div className="container">
        <div className="logo-container">
          <img
            src={chiliCilantroSymbol}
            alt="CurseFund"
            className="logo-symbol"
          />
          <span className="logo-text playfair-display-regular">
            Chili and Cilantro
          </span>
        </div>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {isAuthenticated && gameOptions.length > 0 && (
                <div className="game-dropdown" ref={gameDropdownRef}>
                  <button
                    className="menu-icon"
                    onClick={() => setGameDropdownOpen(!gameDropdownOpen)}
                  >
                    <FontAwesomeIcon icon={faPepperHot} />
                  </button>
                  {gameDropdownOpen && (
                    <div className="game-dropdown-menu">
                      {gameOptions.map((option: GameMenuOption) => (
                        <button key={option.id} onClick={option.action}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="user-dropdown" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="menu-icon">
                  <FontAwesomeIcon icon={faUserCircle} />
                  <span className="fallback-icon">👤</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/change-password"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Change Password
                    </Link>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="user-dropdown" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="menu-icon">
                <FontAwesomeIcon icon={faUserCircle} />
                <span className="fallback-icon">👤</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/login" onClick={() => setDropdownOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setDropdownOpen(false)}>
                    Register
                  </Link>
                  <Link
                    to="/forgot-password"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
