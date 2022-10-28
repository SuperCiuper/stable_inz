import { useContext } from "react";
import { ColorContext } from "../../App";
import "./Footer.css";

const Footer = () => {
	const { colorContext } = useContext(ColorContext);

	return (
		<footer className='Footer' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='Item' style={{ color: `#${colorContext.buttonsRGB}` }}>
				dodać coś
			</div>
		</footer>
	);
};

export default Footer;
