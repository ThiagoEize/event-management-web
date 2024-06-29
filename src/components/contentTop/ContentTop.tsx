import { Link, useLocation } from "react-router-dom";
import styles from "./ContentTop.module.css";

interface ContentTopProps {
  title: string;
  message: string;
}

const ContentTop: React.FC<ContentTopProps> = ({ title, message }) => {
  const location = useLocation();

  return (
    <>
      <div className={styles.navLinks}>
        <Link
          to="/"
          className={location.pathname === "/" ? styles.selected : ""}
        >
          Home
        </Link>
        /
        <Link to={location.pathname} className={styles.selected}>
          {title}
        </Link>
      </div>
      <h1>{title}</h1>
      <p>{message}</p>
    </>
  );
};

export default ContentTop;
