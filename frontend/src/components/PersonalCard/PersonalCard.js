import { useContext } from "react";
import { ColorContext } from "../../App";
import "./PersonalCard.css";
import { Galleria } from "primereact/galleria";
import { API_URL } from "../../constants";

const PersonalCard = ({ title, images, children }) => {
	const colorContext = useContext(ColorContext);

	const renderImage = (image) => {
		console.log(image);
		return (
			<img
				src={`${API_URL}image/${image.name}`}
				onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
				alt={`Image ${image.id}`}
				style={{ width: "100%", display: "block" }}
			/>
		);
	};

	return (
		<div className='PersonalCard' style={{ borderColor: `#${colorContext.detailRGB}` }}>
			{images ? (
				<Galleria
					value={images}
					item={renderImage}
					circular
					style={{ maxWidth: "640px" }}
					showItemNavigators
					showItemNavigatorsOnHover
					showThumbnails={false}
				/>
			) : (
				""
			)}
			<h2>{title}</h2>
			<p className='Description'>{children}</p>
		</div>
	);
};

export default PersonalCard;
