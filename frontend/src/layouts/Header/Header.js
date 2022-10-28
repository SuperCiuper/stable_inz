import { useContext, useRef } from "react";
import { AuthContext, ColorContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { OverlayPanel } from "primereact/overlaypanel";
import { ColorEditor } from "../../components";

const HeaderButton = ({ pathName, buttonName }) => {
	const authContext = useContext(AuthContext);
	const { colorContext } = useContext(ColorContext);
	const currentPath = useLocation().pathname;

	const highlightButton = (e) => {
		e.target.style.color = `#${colorContext.highlightRGB}`;
	};

	const colorButton = (e) => {
		e.target.style.color = `#${colorContext.buttonsRGB}`;
	};

	return (
		<Link to={pathName}>
			<div
				className='header-button'
				onMouseOver={currentPath.includes(pathName) ? undefined : highlightButton}
				onMouseOut={currentPath.includes(pathName) ? undefined : colorButton}
				style={{ color: `#${currentPath.includes(pathName) ? colorContext.highlightRGB : colorContext.buttonsRGB}` }}
				onClick={buttonName === "Wyloguj" && authContext.isLogged ? () => authContext.logoutUser() : () => {}}
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

	console.log(authContext);
	const highlightButton = (e) => {
		e.target.style.color = `#${colorContext.highlightRGB}`;
	};

	const colorButton = (e) => {
		e.target.style.color = `#${colorContext.buttonsRGB}`;
	};

	return (
		<div className='Header' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='Logo'>
				<Link to='/'>
					<img src='logo.png' alt='Stajnia Malta' />{" "}
				</Link>
			</div>
			<div className='ButtonBar'>
				<HeaderButton pathName={"/horses"} buttonName={"Konie"} />
				<HeaderButton pathName={"/offer"} buttonName={"Oferta"} />
				<HeaderButton pathName={"/prices"} buttonName={"Cennik"} />
				<HeaderButton pathName={"/gallery"} buttonName={"Galeria"} />
				<HeaderButton pathName={"/contact"} buttonName={"Kontakt"} />
				{authContext.isLogged ? (
					<>
						<div
							className='header-button'
							onMouseOver={highlightButton}
							onMouseOut={colorButton}
							onClick={(e) => colorButtonRef.current.toggle(e)}
							aria-haspopup
							aria-controls='overlay_panel'
							style={{ color: `#${colorContext.buttonsRGB}` }}
						>
							Kolory
						</div>{" "}
						<OverlayPanel ref={colorButtonRef} id='overlay_panel' style={{ width: "240px" }} className='overlaypanel-demo'>
							<ColorEditor />
						</OverlayPanel>
					</>
				) : (
					""
				)}
				{authContext.isLogged ? <HeaderButton pathName={"/logout"} buttonName={"Wyloguj"} /> : ""}
			</div>
		</div>
	);
};

export default Header;
