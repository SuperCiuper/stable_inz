import { useContext } from "react";
import { ColorContext } from "../../App";
import "./BiographyBlock.css";
import { API_URL } from "../../constants";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
			<img src={`${API_URL}image/${image}`} alt={`Image_${image}`}></img>
		</div>
	);
};

const BiographyBlock = ({ index, image, children }) => {
	const colorContext = useContext(ColorContext);

	return (
		<div className='BiographyBlock' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{image && index % 2 == 1 ? <ImageBlock image={image} /> : ""}
			<p className='Description'>{children}</p>
			{image && index % 2 == 0 ? <ImageBlock image={image} /> : ""}
		</div>
	);
};

export default BiographyBlock;
