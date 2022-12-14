import "./Header.css";

import { useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { ColorEditor } from "../../components";
import { AuthContext, ColorContext } from "../../contextProviders";

import { OverlayPanel } from "primereact/overlaypanel";

const HeaderButton = ({ pathName, buttonName }) => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const currentPath = useLocation().pathname;

  const highlightButton = (e) => {
    e.target.style.color = colorContext.highlight;
  };

  const colorButton = (e) => {
    e.target.style.color = colorContext.button;
  };

  return (
    <Link to={pathName}>
      <div
        className="header-button"
        onMouseOver={currentPath.includes(pathName) ? undefined : highlightButton}
        onMouseOut={currentPath.includes(pathName) ? undefined : colorButton}
        style={{
          color: currentPath.includes(pathName) ? colorContext.highlight : colorContext.button,
          fontWeight: currentPath.includes(pathName) ? "600" : "inherit",
        }}
        onClick={buttonName === "Wyloguj" ? () => authContext.logoutUser() : () => {}}
      >
        {buttonName}
      </div>
    </Link>
  );
};

const Header = () => {
  const authContext = useContext(AuthContext);
  const { colorContext } = useContext(ColorContext);
  const colorButtonRef = useRef(null);

  const highlightButton = (e) => {
    e.target.style.color = colorContext.highlight;
  };

  const colorButton = (e) => {
    e.target.style.color = colorContext.button;
  };

  return (
    <div className="Header" style={{ backgroundColor: colorContext.header }}>
      <div className="Logo">
        <Link to="/main">
          <img src="logo.png" alt="Stajnia Malta" />{" "}
        </Link>
      </div>
      <div className="button-bar">
        <HeaderButton pathName="/main" buttonName="Strona główna" />
        <HeaderButton pathName="/horses" buttonName="Konie" />
        <HeaderButton pathName="/trainers" buttonName="Trenerzy" />
        <HeaderButton pathName="/offer" buttonName="Oferta" />
        <HeaderButton pathName="/prices" buttonName="Cennik" />
        <HeaderButton pathName="/gallery" buttonName="Galeria" />
        <HeaderButton pathName="/contact" buttonName="Kontakt" />
        {authContext.isLogged ? (
          <>
            <div
              className="header-button"
              onMouseOver={highlightButton}
              onMouseOut={colorButton}
              onClick={(e) => colorButtonRef.current.toggle(e)}
              aria-haspopup
              aria-controls="overlay_panel"
              style={{ color: colorContext.button }}
            >
              Kolory
            </div>{" "}
            <OverlayPanel
              ref={colorButtonRef}
              id="overlay_panel"
              style={{ width: "17rem" }}
              className="overlaypanel-demo"
            >
              <ColorEditor />
            </OverlayPanel>
          </>
        ) : (
          ""
        )}
        {authContext.isLogged ? <HeaderButton pathName="/logout" buttonName="Wyloguj" /> : ""}
      </div>
    </div>
  );
};

export default Header;
