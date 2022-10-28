import { useEffect, useState } from "react";
import "./GalleryView.css";
import { API_URL } from "../../constants";
import { Image } from "primereact/image";

const GalleryView = () => {
	// TODO check what happens with more photos
	const [imageList, setImageList] = useState([]);

	useEffect(() => {
		fetch(API_URL + "image")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setImageList(response);
			});
	}, []);

	return (
		<div className='gallery-view'>
			{imageList.map((item, index) => (
				<div className='image-container' key={index}>
					{/* eslint-disable-next-line */}
					<Image
						className='image-item'
						src={`${API_URL}image/${item}`}
						onError={(e) => (e.target.src = "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")}
						alt={`Image ${item} not found`}
						preview
					/>
				</div>
			))}

			<div className='image-container'></div>
		</div>
	);
};

export default GalleryView;
