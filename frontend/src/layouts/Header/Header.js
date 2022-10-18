import { useContext } from "react";
import { ColorContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Item = ({ pathName, buttonName }) => {
	const colorContext = useContext(ColorContext);
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
				className='Item'
				onMouseOver={currentPath.includes(pathName) ? undefined : highlightButton}
				onMouseOut={currentPath.includes(pathName) ? undefined : colorButton}
				style={{ color: `#${currentPath.includes(pathName) ? colorContext.highlightRGB : colorContext.buttonsRGB}` }}
			>
				{buttonName}
			</div>
		</Link>
	);
};

const Header = () => {
	const colorContext = useContext(ColorContext);

	return (
		<div className='Header' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='Logo'>
				<Link to='/'>
					<img src='logo.png' alt='Stajnia Malta' />{" "}
				</Link>
			</div>
			<div className='ButtonBar'>
				<Item pathName={"/horses"} buttonName={"Konie"} />
				<Item pathName={"/offer"} buttonName={"Oferta"} />
				<Item pathName={"/prices"} buttonName={"Cennik"} />
				<Item pathName={"/contact"} buttonName={"Kontakt"} />
			</div>
		</div>
	);
};

export default Header;
