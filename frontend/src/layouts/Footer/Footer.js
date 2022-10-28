import { useContext } from "react";
import { ColorContext } from "../../contextProviders";
import "./Footer.css";

const Footer = () => {
	const { colorContext } = useContext(ColorContext);

	return (
		<footer className='footer' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='item' style={{ color: `#${colorContext.buttonsRGB}` }}>
				dodać coś
			</div>
		</footer>
	);
};

export default Footer;
