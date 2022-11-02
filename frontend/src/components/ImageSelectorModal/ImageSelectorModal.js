import React, { useEffect, useState } from "react";
import "./ImageSelectorModal.css";
import { Button } from "primereact/button";
import { API_URL } from "../../constants";

const ImageSelectorModal = ({ visibilityToggle, visible, title = "Title", image = null, returnImageCallback = () => {} }) => {
	const [imageList, setImageList] = useState([]);
	const [selectedImage, setSelectedImage] = useState(image);

	useEffect(() => {
		fetch(API_URL + "image")
			.then((response) => (response.ok ? response.json() : Promise.reject("Response not ok")))
			.then((response) => {
				setImageList(response);
			});
	}, []);

	const saveChanges = () => {
		returnImageCallback(selectedImage);
		visibilityToggle();
	};

	return (
		<div className='image-selector-modal' style={{ visibility: visible ? "visible" : "hidden" }} onClick={visibilityToggle}>
			<div className='modal-window' onClick={(event) => event.stopPropagation()}>
				<h2 className='title'>{title}</h2>
				<div className='image-gallery'>
					{imageList.map((image, index) => (
						<div className='image-container' key={index} onClick={() => setSelectedImage(image)}>
							{/* eslint-disable-next-line */}
							<img src={`${API_URL}image/${image}`} alt={`Image ${image} not found`}></img>
							<div className='selected-image' style={{ visibility: selectedImage === image && visible ? "visible" : "hidden" }}>
								<i className='pi pi-star-fill' style={{ fontSize: "2rem" }} />
							</div>
						</div>
					))}
				</div>
				<Button className='save-text-btn p-button-sm p-button-secondary' onClick={saveChanges} icon='pi pi-check' label='Zapisz'></Button>
			</div>
		</div>
	);
};

export default ImageSelectorModal;