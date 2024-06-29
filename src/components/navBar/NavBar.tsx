import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../assets/images/logo.png";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <img src={logo} alt=""></img>
      </div>
      <div className={styles.navbarLinks}>
        <button
          className={`${styles.navbarLink} ${
            location.pathname === "/" ? styles.active : ""
          }`}
          onClick={() => handleNavigation("/")}
        >
          Home
        </button>
        <button
          className={`${styles.navbarLink} ${
            location.pathname === "/events" ? styles.active : ""
          }`}
          onClick={() => handleNavigation("/events")}
        >
          Eventos
        </button>
        <button
          className={`${styles.navbarLink} ${
            location.pathname === "/places" ? styles.active : ""
          }`}
          onClick={() => handleNavigation("/places")}
        >
          Lugares
        </button>
      </div>
      <div className={styles.navbarUser}>Olá Thiago</div>
    </nav>
  );
};

export default NavBar;
