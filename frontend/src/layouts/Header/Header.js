import { useContext } from "react";
import { ColorContext } from "../../App";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ stableName }) => {
	const colorContext = useContext(ColorContext);

	return (
		<div className='Header' style={{ backgroundColor: `#${colorContext.supportRGB}` }}>
			<Link to='/'>
				<div className='Logo'>
					<img src='logo.png' alt={stableName} />
				</div>
			</Link>
			<div className='ButtonBar'>
				<Link to='/horses'>
					<div className='Item'>Horses</div>
				</Link>
				<Link to='/offer'>
					<div className='Item'>Offer</div>
				</Link>
				<Link to='/prices'>
					<div className='Item'>Price list</div>
				</Link>
			</div>
		</div>
	);
};

export default Header;
