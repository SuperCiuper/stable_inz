import { useContext } from "react";
import { ColorContext } from "../../App";
import "./TextBlock.css";
import { API_URL } from "../../constants";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
			<img src={`${API_URL}image/${image}`} alt={`${image} not found`}></img>
		</div>
	);
};

const TextBlock = ({ index, image, children }) => {
	const colorContext = useContext(ColorContext);

	return (
		<div className='TextBlock' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{image && index % 2 === 1 ? <ImageBlock image={image} /> : ""}
			<p className='Description'>{children}</p>
			{image && index % 2 === 0 ? <ImageBlock image={image} /> : ""}
		</div>
	);
};

export default TextBlock;
