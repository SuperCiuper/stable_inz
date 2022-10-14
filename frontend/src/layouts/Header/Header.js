import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="Header">
      <div className="Item">
        <Link to="/">Apiary storage</Link>
      </div>
      <div className="Item">
        <Link to="/apiaryList">Apiary list</Link>
      </div>
    </div>
  );
};

export default Header;
