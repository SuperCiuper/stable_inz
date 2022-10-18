import { useContext } from "react";
import { ColorContext } from "../../App";
import "./Footer.css";

const Footer = () => {
	const colorContext = useContext(ColorContext);

	return (
		<footer className='Footer' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='Item' style={{ color: `#${colorContext.buttonsRGB}` }}>
				SaaS Native recruitment task
			</div>
			<div className='Item' style={{ color: `#${colorContext.buttonsRGB}` }}>
				Szymon Hutnik - &nbsp;
				<a href='https://github.com/SuperCiuper/SaaS-Native-recruitment-task'>Github</a>
			</div>
		</footer>
	);
};

export default Footer;
