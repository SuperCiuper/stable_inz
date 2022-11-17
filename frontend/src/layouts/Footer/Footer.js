import { useContext } from "react";
import { ColorContext } from "../../contextProviders";
import "./Footer.css";

const Footer = () => {
	const { colorContext } = useContext(ColorContext);

	return (
		<footer className='footer' style={{ backgroundColor: colorContext.header }}>
			<div className='item' style={{ color: colorContext.button }}>
				&copy; 2022 Stajnia Malta. All rights reserved
			</div>
		</footer>
	);
};

export default Footer;
