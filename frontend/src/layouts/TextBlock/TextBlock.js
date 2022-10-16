import { useContext } from "react";
import { ColorContext } from "../../App";
import "./TextBlock.css";
import { API_URL } from "../../constants";

const TextBlock = ({ image, children }) => {
	const colorContext = useContext(ColorContext);

	return (
		<div className='TextBlock' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			<p className='Description'>{children}</p>
			{image ? (
				<div className='ImageBlock'>
					<img src={`${API_URL}image/${image}`} alt={`Image_${image}`}></img>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default TextBlock;
