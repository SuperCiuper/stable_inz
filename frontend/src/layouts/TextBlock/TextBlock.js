import { useContext } from "react";
import { ColorContext } from "../../App";
import "./TextBlock.css";
import { API_URL } from "../../constants";

const ImageBlock = ({ image }) => {
	return (
		<div className='ImageBlock'>
<<<<<<< HEAD
			<img src={`${API_URL}image/${image}`} alt={`${image} not found`}></img>
=======
			<img src={`${API_URL}image/${image.name}`} alt={`Image ${image.id}`}></img>
>>>>>>> 32f4b74b3824269bcfddbf1eafe1cc834102d0dd
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
