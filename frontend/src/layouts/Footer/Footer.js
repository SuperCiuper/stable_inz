import { useContext } from "react";
import { ColorContext } from "../../App";
import "./Footer.css";

const Footer = () => {
	const colorContext = useContext(ColorContext);

	return (
		<footer className='Footer' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<div className='Item'>
				<h3> Task </h3>
				<p> SaaS Native recruitment task </p>
			</div>
			<div className='Item'>
				<h3> Contact </h3>
				<p>
					Szymon Hutnik - &nbsp;
					<a href='https://github.com/SuperCiuper/SaaS-Native-recruitment-task'>Github</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
